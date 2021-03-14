// const socket = io("http://localhost:3000");
const socket = io();
let players = [];
let server = {};
let isMyTurn = false;
let myId = null;
let playersContainer = document.getElementById('players');
let keyboard = document.getElementById('alfabet');

document.getElementById('joinBtn').onclick = function() {
	myId = Date.now();
	socket.emit("join", {
		id: myId,
		name: document.getElementById('name').value
	});
	document.getElementById('form_name').innerHTML = "czekamy"
}

socket.on('players', data => {
	players = data
	console.log(data)
})

function start() {
	socket.emit('start')
}

socket.on('started', data => {
	server = data.data
	if(data.data.started) {
		haslo = data.data.password
		//marcin
		haslo=haslo.toUpperCase();
		dlugosc=haslo.length;
		haslo1="";
		for (i=0;i<dlugosc;i++){
				if(haslo.charAt(i)==" ")haslo1= haslo1 + " ";
				else haslo1 = haslo1 + "-";
		}
		wypisz_haslo();
		//marcin end
		let keys = document.getElementsByClassName('litera');
		for (let i = 0; i < keys.length; i++) {
			keys[i].onclick = event => {
				let id = event.target.id.split('lit')[1];
				sprawdz(id);
				socket.emit('click', id);
			}
		}
		document.getElementById('blank').style.display = 'none';
		for (let i = 0; i < data.players.length; i++)
			playersContainer.innerHTML += `<div id="${data.players[i].id}" class="player">${data.players[i].name}</div>`
	}
	checkMyTurn();
})

function checkMyTurn() {
	if(players[server.turn].id == myId) {
		alfabet.classList.remove('keyboard-block');
	} 
	else {
		alfabet.classList.add('keyboard-block');
	}
}

socket.on('guessed', data => {
	server = data;
	checkMyTurn();
})

socket.on('clicked', data => {
	let key = document.getElementById(`lit${data}`);
	if(key && key.style.background.length < 1) {
		sprawdz(data);
	}
})

socket.on('ended', data => {
	koniec(false)
})