'use strict';

const readline = require('readline');
const net = require('net');
const socket = new net.Socket();

socket.on('end', () => {
	console.log(`Connection closed...\n`);
	connecting = false;
	console.dir({
		bytesRead: socket.bytesRead,
		bytesWritten: socket.bytesWritten,
	});
	menu();
})

socket.on('connect', () => {
	console.log('Connection is successful...\n');
	connecting = true;
	console.dir({
    localAddress: socket.localAddress,
    localPort: socket.localPort,
    remoteAddress: socket.remoteAddress,
    remoteFamily: socket.remoteFamily,
    remotePort: socket.remotePort,
  });
  console.log('\n');
  menu();
})

socket.on('error', error => {
	console.log(error.message);
})

socket.on('data', data => {
	console.log(`Server: ${data}.`);
})

socket.on('close', () => {
	console.log('Socket was closed...\n');
})

console.log(`Hello! This is chat client api.\n`);

global.connecting = false;

const connect = () => {

	rl.question(`Write server port:\nYou: `, answer => {
		const port = parseInt(answer, 10);
		if (isNaN(port)) connect();	
		else {
			console.log(`port: ${port}`);
		}

		rl.question(`Write server host:\nYou: `, answer => {
			const host = answer;
		  console.log(`host: ${host}.`);
		  socket.connect({
		  	port,
		  	host,
		  });
	  });
	
	});
};

const chat = () => {
	if (!connecting) {
		console.log('You have not connected to the server...\n');
		menu();
	} else {
		console.log('You are in chat...(!!! to quit)\nYou:');
		rl.on('line', (line) => {
			console.log('You: (!!! to quit)');
			if (line === '!!!') {
				console.log('You left the chat...\n');
				menu();
			} else {
				socket.write(line);
			}
		})
	}
}

const disconnect = () => {
	
	if (!connecting) {
		console.log('You are not connected to server:\n');
		menu();
	} else socket.end();

}

const finish = () => {
	
	if (connecting) {
		console.log('Before quit, please disconnect.\n');
		menu();
	} 
	else {
	  console.log(`You finished work with api\nGood luck!\n`);
	  rl.close();
	}

}

global.menu = () => {
	rl.question(`Choose option you want to do:\n1) Connect to the server.\n2) Chat.\n3) Disconnect from server.\n4) Quit.\nYou: `, (answer) => {
		if (answer === '1') connect();
		else if (answer === '2') chat();
		else if (answer === '3') disconnect();
		else if (answer === '4') finish();
		else menu();
	})
} 

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

menu();
