'use strict';

const net = require('net');
const readline = require('readline');

const server = net.createServer();

global.listening = false;

console.log('Hello! This is server api.\n');

const connection = (socket) => {

  global.socket = socket;

  console.log(`\nNew connetion...\n`);
  console.dir({
    localAddress: socket.localAddress,
    localPort: socket.localPort,
    remoteAddress: socket.remoteAddress,
    remoteFamily: socket.remoteFamily,
    remotePort: socket.remotePort,
    bufferSize: socket.bufferSize,
  });
  menu();

  socket.on('data', data => {
    console.log(`Client: ${data}`);
  })

  socket.on('end', () => {
    console.log('\nClient disconnected...\nServer: ');
    console.dir({
      bytesRead: socket.bytesRead,
      bytesWritten: socket.bytesWritten,
    });
    menu();
  });

  socket.on('error', (err) => {
    console.log('\nSocket error...\nServer: ');
    console.log(err.message);
    menu();
  });

  socket.on('close', () => {
    console.log('Socket was closed...\n');
  })
}

const startserver = () => {
  rl.question('Write port to start server:\nServer: ', answer => {
    server.listen(answer);
  })
}

const serverchat = () => {
  if (!listening) {
    console.log('Server is not working, chat is not avaible...\n');
    menu();
  }
  else {
    console.log('You are in chat now. (!!! to quit)\nServer: ');
    rl.on('line', line => {
      console.log('Server: (!!! to quit)');
      if (line === '!!!') {
        console.log('You left the chat...\n');
        menu();
      } else {
        socket.write(line);
      }
    })
  }
}

const closeserver = () => {
  console.log('Server will finally close when all connections will be finished.\nServer: ');
  server.close();
  menu();
}

const restartserver = () => {
  if (!listening) {
    console.log('Server is not listening any port...\nServer: ');
    menu();
  }
  else {
    console.log('Server is restarting...\n');
    server.close();
    startserver(); 
  }
}

const finish = () => {
  if (listening) {
    console.log('Please close server.\nServer: ');
    menu();
  } else {
    console.log(`You finished work with api\nGood luck!\n`);
    rl.close();
  }
}

server.on('listening', () => {
	console.log(`Sever is up...\n`);
	console.dir(server.address());
  listening = true;
  menu();
})

server.on('error', error => {
	console.error(error.name);
  menu();
})

server.on('close', close => {
  console.log('Server was closed...\n');
  listening = false;
  menu();
})

server.on('connection', connection);

global.menu = () => {
  rl.question('Choose options:\n1) Start server.\n2) Restart server.\n3) Chat.\n4) Stop server.\n5) Quit api.\nServer: ', (answer) => {
    if (answer === '1') startserver();
    else if (answer === '2') restartserver();
    else if (answer === '3') serverchat();
    else if (answer === '4') closeserver();
    else if (answer === '5') finish();
    else menu();
  })
} 

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

menu();