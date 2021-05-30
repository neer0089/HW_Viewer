// Hardware viewer server

const si = require('systeminformation');
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

// Creating the backend server
const server = http.createServer();

// Listening to particular host and port
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


const io = require("socket.io")(server, {
  cors: {
    origin: '*',
  }
});


io.on("connection", socket => {
  console.log("Socket Connected")

  let timer = setInterval(() => {
    systemInfo()
      .then(hwData => {
        socket.emit("hwdata", hwData);
      });
  }, 1000);

  socket.on('disconnect', () => {
    clearInterval(timer);
    console.log("Socket Disconnected")
  })

});


async function systemInfo() {
  let hwData = {};

  try {
    const system = await si.system();
    hwData.device = system.model;
    hwData.deviceManufacturer = system.manufacturer;

    const cpu = await si.cpu();
    hwData.cpuManufacturer = cpu.manufacturer;
    hwData.cpuModel = cpu.brand;
    hwData.cpuCores = cpu.cores;

    const cpuLoad = await si.currentLoad();
    hwData.cpuLoad = cpuLoad.currentLoad.toFixed(2);

    const memory = await si.mem();
    hwData.totalMemory = bytesToSize(memory.total);
    hwData.freeMemory = bytesToSize(memory.available);
    hwData.usedMemory = bytesToSize(memory.active);

    const netStats = await si.networkStats();
    let networks = [];
    let netStat = {};
    for (i = 0; i < netStats.length; i++){
      netStat.interface = netStats[i].iface;
      netStat.totalReceived = bytesToSize(netStats[i].rx_bytes);
      netStat.totalTransferred = bytesToSize(netStats[i].tx_bytes);
      networks.push(netStat);
    }
    hwData.networks = networks;

    return hwData;

  } catch (e) {
      console.log(e);
  }
}

function bytesToSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
