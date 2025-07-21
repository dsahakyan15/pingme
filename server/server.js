const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection',()=>{
    console.log('is connected');

    ws.on('message',()=>{
        console.log('Message received from client');})

    ws.on('close',()=>{
        console.log('is disconnected');
    })
})