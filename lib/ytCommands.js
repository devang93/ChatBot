var PythonShell = require('python-shell');
var child_process = require('child_process');


function callYoutube(socket, query){
	console.log("Calling youtube for :"+ query);
	var pyshell = new PythonShell('./lib/youtubeScrapper.py');
	pyshell.send(JSON.stringify({'search_query': query}));

	pyshell.on('message', function(message){
		try {
		 result = JSON.parse(message);
		 displayResult(socket, result);
		} catch (e) {
			console.log(e);
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

var ytCommand = function ytCommand(socket, command, query){

	switch(command) {
		case 'play' :
			console.log('Previous results size: '+ result.length);
			console.log(result[query]);
			var r = JSON.parse(result[query]);
			var url = ["https://www.youtube.com"+r.link];
			console.log("here");
			console.log(url);
			var opt = {
				killSignal: 'SIGKILL'
			}
			yt = child_process.execFile("C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",url,opt, function(err, data) {
				if(err) {console.log(err);}
			});

			break;

		case 'search' :
			console.log('Query: '+ query);
			callYoutube(socket,query);
			break;

		case 'stop' :

			console.log("stop invoked!!");
			yt.kill('SIGKILL');
			// child_process.spawn('kill', [c.pid]);
			break;
	}
};

module.exports.ytCommand = ytCommand;