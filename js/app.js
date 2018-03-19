const icons = ['ambulance', 'anchor', 'balance-scale', 'basketball-ball', 'bath', 'bed', 'beer', 'bicycle', 'binoculars', 'bomb', 'bug', 'car', 'chess-rook', 'chess-queen', 'cloud', 'fighter-jet', 'fire', 'gamepad', 'home', 'sun', 'volleyball-ball', 'chess-knight'];
const board = document.querySelector('.game-board');
const reset = document.getElementById('reset');
const difficulties = document.querySelectorAll("input[name='difficulty']");
let clickCount = 0;
let clickedCards = [];
let sec = 0;
let difficulty;
let difficultyClass;

function startGame() {
	
	checkDifficulty();
	
	//start game in normal mode
	populate(difficulty);

	//timerReset();
	sec = 0;
	clickedCards = [];
}


//shuffle function from https://bost.ocks.org/mike/shuffle/
function shuffle(array) {
  var m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
}

function populate(num) {

	//clear the board
	board.innerHTML = "";

	//LOGIC IS: shuffle the main array and slice half the number of cards
	shuffle(icons);
	let boardIcons = icons.slice(0, num/2);
	
	//duplicate the array values to make pairs and shuflfe this new array
	boardIcons = boardIcons.concat(boardIcons);
	shuffle(boardIcons);
	
	//populate HTML
	const fragment = document.createDocumentFragment(); 

	for (let x = 0; x < num; x++) {
    	const card = document.createElement('div');
    	const icon = document.createElement('i')
    	icon.classList.add('card', 'fas', 'fa-' + boardIcons[x]);
    	icon.classList.add(difficultyClass);
		card.appendChild(icon);
		fragment.appendChild(card);
		console.log('it works');
	}
	board.appendChild(fragment); 
}

board.addEventListener('click', e => {
	
	if (e.target.classList.contains('fas') && !e.target.classList.contains('open')) {
		clickCount += 1;
		console.log(clickCount);
		clickedCards.push(e.target.classList[2]);
		console.log(clickedCards);
		e.target.classList.add('open');
		if (clickCount === 2) {
			clickCount = 0;
			let selectedCards = document.querySelectorAll('.open');
			if (clickedCards[0]===clickedCards[1]) {
					console.log('match');
					clickedCards = [];
					[].forEach.call(selectedCards, c =>{
						c.classList.add('correct');
					});

			} else {
					console.log('no match');
					//set timeout here so they can see the cards before they flip
					setTimeout(function(){
						clickedCards = [];
						[].forEach.call(selectedCards, c =>{
						c.classList.remove('open');
						});
					}, 1200);
					
			}
		}				
	}
});

setInterval(timer, 1000);
function timer(){
	const timer = document.getElementById('timer');
	sec+=1;
	if (sec<60) {
		timer.innerText = sec;
	} else if (sec<3600) {
		let minutes = Math.floor(sec/60);
		let seconds = sec % 60;
		timer.innerText = minutes+":"+seconds;
	}
}

reset.addEventListener('click', startGame);


//check difficulty radio




function checkDifficulty(){
	[].forEach.call(difficulties, function(val){
		
		if (val.value === "easy" && val.checked === true) {
			difficulty = 4;
			difficultyClass = 'easy';
		} else if (val.value === "normal" && val.checked === true) {
			difficulty = 16;
			console.log(difficulty);
			difficultyClass = 'normal';
		} else if (val.value === "hard" && val.checked === true) {
			difficulty = 36;
			console.log(difficulty);
			difficultyClass = 'hard';
		}
	});

}

document.getElementById('form').addEventListener('change', function(){
	checkDifficulty();
	populate(difficulty);
});


startGame();