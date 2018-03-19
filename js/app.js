const icons = ['ambulance', 'anchor', 'balance-scale', 'basketball-ball', 'bath', 'bed', 'beer', 'bicycle', 'binoculars', 'bomb', 'bug', 'car', 'chess-rook', 'chess-queen', 'cloud', 'fighter-jet', 'fire', 'gamepad', 'home', 'sun', 'volleyball-ball', 'chess-knight'];
const board = document.querySelector('.game-board');
const reset = document.getElementById('reset');
const form = document.getElementById('form');
const difficulties = document.querySelectorAll("input[name='difficulty']");
let clickCount = 0;
let clickedCards;
let sec;
let difficulty;
let difficultyClass;


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

// go over the radio buttons and check the difficulty selection
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

//populate board with cards
function populate(num) {

	//clear previous clicks and memorised cards
	clickedCards = [];
	clickCount = 0;

	//clear the board
	board.innerHTML = "";
	//board.classList = ""
	//board.classList.add(difficultyClass);

	//LOGIC IS: shuffle the main array and slice half the number of cards
	//this is to always get a random selection of icons
	shuffle(icons);
	let boardIcons = icons.slice(0, num/2);
	
	//duplicate the array values to make pairs and shuflfe this new array
	boardIcons = boardIcons.concat(boardIcons);
	shuffle(boardIcons);
	
	//actually populate HTML
	const fragment = document.createDocumentFragment(); 

	for (let x = 0; x < num; x++) {
		const card = document.createElement('div');
    	const icon = document.createElement('i');
    	icon.classList.add('icon','fas', 'fa-' + boardIcons[x]);
    	card.classList.add('card', difficultyClass);
    	
		card.appendChild(icon);
		fragment.appendChild(card);

	}
	board.appendChild(fragment); 

}

//timer functionality
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

function startGame() {
	checkDifficulty();
	populate(difficulty);
	sec = 0;  //timer reset
}

function matchChecker(e){
	//LOGIC IS: make sure the click target is a card

	if (e.target.firstChild.classList.contains('fas') 
		//but not an icon inside an open card
		&& !e.target.firstChild.classList.contains('icon_open')
		// but not an icon inside a card that is marked as correct 
		&& !e.target.firstChild.classList.contains('icon_correct') 
		//but not a card that is already open
		&& !e.target.classList.contains('open')
		//but not a card that is already marked as correct
		&& !e.target.classList.contains('correct')){
		console.log(e.target);
		clickCount += 1;
		
		// make an array of the clicked cards' font Awesome classes		
		clickedCards.push(e.target.firstChild.classList[2]);

		e.target.classList.add('open');
		e.target.firstChild.classList.add('icon_open');


		if (clickCount === 2) {
			clickCount = 0;
			let selectedCards = document.querySelectorAll('.open');
			//check if the clicked cards' font Awesome classes match
			if (clickedCards[0]===clickedCards[1]) {
				clickedCards = [];
				//if it's a match, add the class 'correct' to keep the cards open
				[].forEach.call(selectedCards, c =>{
					c.classList.add('correct');
					c.firstChild.classList.add('correct');
				});

			} else {
				//if it's not a match, remove the class 'open' so the cards close again
				//set timeout here so the player can see the cards before they flip(must refactor this 'cause weird errors)
				setTimeout(function(){
					clickedCards = [];
					[].forEach.call(selectedCards, c =>{
					c.classList.remove('open');
					c.firstChild.classList.remove('icon_open');

					});
				}, 1200);
					
			}
		}				
	}
}

reset.addEventListener('click', startGame);
form.addEventListener('change', startGame);
board.addEventListener('click', matchChecker);

startGame();