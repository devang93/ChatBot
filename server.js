var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var child_process = require('child_process');
var result;
var yt;
var util = require('./lib/ytCommands.js');
//python shell used to invoke python scripts.
var PythonShell = require('python-shell');
//var pyshell = new PythonShell(/lib/youtubeScrapper.py);

app.use(express.static(__dirname));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

io.on('connection', function(socket){
	
  console.log('a user connected '+socket.id);
  // socket.emit('user join', 'Welcome to the ChatBot! Lets start signing in with your userName.');
  // socket.emit('user join', 'Commands: $user userName');
  // socket.emit()
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });

  processCommand(socket);

  socket.on('disconnect', function(){
  	console.log('socket closing: '+ socket.id);
 //  	console.log(userNames[socket.id]);
	// var user = userNames[socket.id];
	// console.log(user +' disconnected');
	// delete userNames[socket.id];
  });

});

http.listen(3000, function(){
  console.log('listening on localhost:3000');
});


// function callYoutube(socket, query){
// 	console.log("Calling youtube for :"+ query);
// 	var pyshell = new PythonShell('./lib/youtubeScrapper.py');
// 	pyshell.send(JSON.stringify({'search_query': query}));

// 	pyshell.on('message', function(message){
// 		try {
// 		 result = JSON.parse(message);
// 		 displayResult(socket, result);
// 		} catch (e) {
// 			console.log(e);
// 		}
		
// 	});

// 	pyshell.end(function(err){
// 		if(err){
// 			console.log(err);
// 		}
// 		console.log('YoutubeScrapper ended.');
// 	});
// }

// function displayResult(socket, result) {

// 	socket.emit('search_results', result)
// }

// function ytCommand(socket, command, query){

// 	switch(command) {
// 		case 'play' :
// 			console.log('Previous results size: '+ result.length);
// 			console.log(result[query]);
// 			var r = JSON.parse(result[query]);
// 			var url = ["https://www.youtube.com"+r.link];
// 			console.log("here");
// 			console.log(url);
// 			var opt = {
// 				killSignal: 'SIGKILL'
// 			}
// 			yt = child_process.execFile("C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",url,opt, function(err, data) {
// 				if(err) {console.log(err);}
// 			});

// 			break;

// 		case 'search' :
// 			console.log('Query: '+ query);
// 			callYoutube(socket,query);
// 			break;

// 		case 'stop' :

// 			console.log("stop invoked!!");
// 			yt.kill('SIGKILL');
// 			// child_process.spawn('kill', [c.pid]);
// 			break;
// 	}
// }

function processCommand(socket) {

	socket.on('command', function(msg){
  		var words = msg.split(' ');
  		var command = words[0].substring(1, words[0].length).toLowerCase();

  		switch(command) {
  		
			case 'youtube' :
				words.shift();
				var subcommand = words[0].toLowerCase();
				words.shift();
				util.ytCommand(socket, subcommand, words.join('+') )
		
  			default:
				message = 'Unrecognized command.';  // return error message for unrecognized command.
				break;
  		}
  		console.log('received command from user: '+msg.substring(1, msg.length).toLowerCase());
  	});
}
