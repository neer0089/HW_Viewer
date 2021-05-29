// Hardware viewer server

const si = require('systeminformation');
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

// Creating the backend server
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hardware Viewer server is running');
});

// Listening to particular host and port
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


const io = require("socket.io")(server);


io.on("connection", socket => {
  console.log("Socket Connected")

  let timer = setInterval(() => {
    systemInfo()
      .then(hwData => {
        socket.emit("hwdata", hwData)
        // console.log(hwData)
      })
    // console.log("timer");
  }, 1000)

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
    hwData.Cores = cpu.physicalCores;

    const cpuLoad = await si.currentLoad();
    hwData.cpuLoad = cpuLoad.currentLoad.toFixed(2);

    const memory = await si.mem();
    hwData.totalMemory = bytesToSize(memory.total.toFixed(2));
    hwData.freeMemory = bytesToSize(memory.free.toFixed(2));
    hwData.usedMemory = bytesToSize(memory.used.toFixed(2));

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

function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

// function getRandomValue(){
//   return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
// }