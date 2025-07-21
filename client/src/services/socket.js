const socket = new WebSocket('ws://localhost:3000');

socket.onopen = () => {
    console.log('WebSocket connection established');
}

socket.onmessage = (event) => {
    console.log('Message from server:', event.data);
}   

socket.onclose= (event)=>{
console.log('WebSocket connection closed:', event.code, event.reason);

}