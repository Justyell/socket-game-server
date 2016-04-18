


module.exports = function(io, socket){
	
	console.log("socket in!!");
	/*io.emit('chatMessage',{
		text:'somebody connect',
		created: Date.now(),
		username:socket.request.user.username
	});
	*/
	socket.on('chatMessage',function(message){
		//console.log(message);
		var jmessage = {
			date: Date.now(),
			message: socket.request.user.username
		};
		
		io.emit('chatMessage',jmessage);
	});
	
	
	socket.on('msgSend',function(message){
		console.log(message);
		io.emit('getTalks',{
			talkmsg: message,
			name: socket.request.user.username
			
		});
	});
	
	socket.on('disconnect',function(){
		
		console.log(socket.request.user.username + " has been disconnected the server!");
	});
	
	socket.on('startRect',function(pos){
		console.log("friend start game");
		socket.broadcast.emit('friendRect',pos);
	});
	
	socket.on('rectMove',function(pos){
		console.log("friend move rect, x:" + pos.x + ",y:" + pos.y);
		socket.broadcast.emit('friendRectMove',pos);
	});
}