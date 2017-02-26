var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var exec = require('child_process').exec;
var userNames= {};
var userPwds = {};
var namesUsed = [];
var guestNumber = 1;
var util = require('./lib/commands.js');
//python shell used to invoke python scripts.
var PythonShell = require('python-shell');
//var pyshell = new PythonShell(/lib/youtubeScrapper.py);

app.use(express.static(__dirname));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

io.on('connection', function(socket){

  console.log('a user connected '+socket.id);
  socket.emit('user join', 'Welcome to the ChatBot! Lets start signing in with your userName.');
  socket.emit('user join', 'Commands: $user userName');
  socket.emit()
  askUserName(socket);
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });

  processCommand(socket, userNames, namesUsed, userPwds);

  socket.on('disconnect', function(){
  	console.log('socket closing: '+ socket.id);
  	console.log(userNames[socket.id]);
	var user = userNames[socket.id];
	console.log(user +' disconnected');
	delete userNames[socket.id];
  });

});

http.listen(3000, function(){
  console.log('listening on localhost:3000');
});


function askUserName(socket){
	var msg = "Please type in your username with $user command to help us identify you."
	socket.emit('botmsg', msg);
}

function callYoutube(socket, query){
	var pyshell = new PythonShell('./lib/youtubeScrapper.py');
	pyshell.send(JSON.stringify({'search_query': query}));

	pyshell.on('message', function(message){
		try {
		 var result = JSON.parse(message)
		 displayResult(socket, result)
		} catch (e) {
			console.log(e)
		}
		
	});

	pyshell.end(function(err){
		if(err){
			console.log(err);
		}
		console.log('YoutubeScrapper ended.');
	});
}

function displayResult(socket, result) {

	socket.emit('search_results', result)
}

function processCommand(socket, userNames, namesUsed, userPwds) {

	socket.on('command', function(msg){
  		var words = msg.split(' ');
  		var command = words[0].substring(1, words[0].length).toLowerCase();

  		switch(command) {
  			case 'user' :
  				var userName = words[1];
  				console.log('Received user request for '+userName);
  				util.validateUser(socket, userNames, namesUsed, userPwds, userName);
  				break;
  			case 'pwd' :
  				var passwd = words[1]; 
  				console.log('User entered password: '+passwd)
  				util.login(socket, userNames, namesUsed, userPwds, passwd);
			case 'youtube' :
				words.shift();
				var query = words.join('+');
				console.log('User entered youtube command with search :'+query);
				callYoutube(socket, query);
  			default:
				message = 'Unrecognized command.';  // return error message for unrecognized command.
				break;
  		}
  		console.log('received command from user: '+msg.substring(1, msg.length).toLowerCase());
  	});
}
