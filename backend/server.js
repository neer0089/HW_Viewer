// Hardware viewer server

const si = require('systeminformation');
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hardware Viewer server is running');
});

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
        console.log(hwData)
      })
    // console.log("timer");
  }, 1000)

  socket.on('disconnect', () => {
    clearInterval(timer);
    console.log("Socket Disconnected")
  })
  /* setInterval(() => {
    systemInfo()
      .then(hwData => {
        socket.broadcast.emit("hwdata", getRandomValue())
        // console.log(hwData)
      })
  }, 1000) */
});


async function systemInfo() {
  let hwData = {};
  try {
    
    // const system = await si.system();
    // hwData.device = system.model;
    // hwData.deviceManufacturer = system.manufacturer;

    // const cpu = await si.cpu();
    // hwData.cpuManufacturer = cpu.manufacturer;
    // hwData.cpuModel = cpu.brand;
    // hwData.physicalCores = cpu.physicalCores;

    const cpuLoad = await si.currentLoad();
    const load = cpuLoad.currentLoad;  //.toFixed(2);

    // const memory = await si.mem();
    // hwData.totalMemory = bytesToSize(memory.total.toFixed(2));
    // hwData.freeMemory = bytesToSize(memory.free.toFixed(2));
    // hwData.usedMemory = bytesToSize(memory.used.toFixed(2));

    // const netStats = await si.networkStats();
    // let networks = [];
    // let netStat = {};
    
    // for (i = 0; i < netStats.length; i++){
    //   netStat.interface = netStats[i].iface;
    //   netStat.totalReceived = bytesToSize(netStats[i].rx_bytes);
    //   netStat.totalTranferred = bytesToSize(netStats[i].tx_bytes);
    //   networks.push(netStat);
    // }
    // hwData.networks = networks;

    // socket.broadcast.emit("hwdata", hwData);
    return load;

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

function getRandomValue(){
  return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
}