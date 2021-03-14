const express = require("express");
const socket = require("socket.io");
const PORT = 3000;
const app = express();
const server = app.listen(PORT, function () {
	console.log(`Listening on port ${PORT}`);
	console.log(`http://localhost:${PORT}`);
});
app.use(express.static("public"));
const io = socket(server, {
	allowEIO3: true,
});

let players = [];
let serverData = {
	password: "OBRAZ KONIUNKCJI WARUNKÓW",
	turn: 0,
	started: false,
};

io.on("connection", socket => {
	socket.on('join', data => {
		players.push({
			id: data.id,
			name: data.name,
		})
		io.sockets.emit("players", players)
	})
	socket.on('start', data => {
		serverData.started = true
		io.sockets.emit('started', {
			data: serverData,
			players
		})
	})
	// socket.on('guess', data => {
	// 	serverData.turn = serverData.turn + 1;
	// 	io.sockets.emit('guessed', serverData);
	// })
	socket.on('click', data => {
		serverData.turn = serverData.turn + 1;
		if(serverData.turn > players.length - 1)
			serverData.turn = 0;
		io.sockets.emit('guessed', serverData);
		io.sockets.emit('clicked', data);
	})
	socket.on('end', data => {
		io.sockets.emit('ended');
	})
}) 