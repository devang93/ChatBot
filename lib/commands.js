
var validateUser = function(socket, userNames, namesUsed, userPwds, userName){
	for( var sock in userNames){
		var name = userNames[sock];
		if( name == userName ) {
			socket.emit('botmsg', 'User is already in use! Please check in with admin!');
			return;
		}
	}

	if( userPwds[userName] ){
		console.log('User exists! Need Password!');
		// var oldNameIndex = namesUsed.indexOf(userNames[socket.id]);
		userNames[socket.id] = userName;
		// delete namesUsed[oldNameIndex];
		namesUsed.push(userName);
		socket.emit('askpwd',{
			success: true,
			user: userName
		});
	} else {
		console.log('New user detected!');
		userNames[socket.id] = userName;
		namesUsed.push(userName);
		socket.emit('askpwd',{
			success: true,
			user: userName
		});
	}
};

var login = function(socket, userNames, namesUsed, userPwds, pwd){
	var userName = userNames[socket.id];
	if( userPwds[userName] ){
		if( pwd == userPwds[userName] ){
			console.log('Login successful for '+userName);
			socket.emit('slogin', 'Login successful for '+userName);
		}
		else {
			console.log('Password mismatch...Login FAILED '+userName);
			socket.emit('flogin','Retry with the correct password! Use Command: $pwd pwd');
		}
	} else {
		console.log('Creating a new entry in the username passwords for '+userName);
		userPwds[userName] = pwd;
		socket.emit('sreg', 'SuccessFully register new user: '+userName);
	}
};

module.exports.login = login;
module.exports.validateUser = validateUser;
