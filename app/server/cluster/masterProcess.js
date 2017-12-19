const numCPUs = require('os').cpus().length;
const cluster = require('cluster');

function masterProcess() {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    console.log(`Forking process number ${i}...`);
    cluster.fork();
  }

}

module.exports = masterProcess;