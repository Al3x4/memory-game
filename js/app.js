const icons = ['ambulance', 'anchor', 'balance-scale', 'basketball-ball', 'bath', 'bed', 'beer', 'bicycle', 'binoculars', 'bomb', 'bug', 'car', 'chess-rook', 'chess-queen', 'cloud', 'fighter-jet', 'fire', 'gamepad', 'home', 'sun', 'volleyball-ball', 'chess-knight'];
const board = document.querySelector('.game-board');
const reset = document.getElementById('reset');
const form = document.getElementById('form');
const difficulties = document.querySelectorAll("input[name='difficulty']");
let clickCount = 0;
let iconClasses;
let selectedCards = [];
let sec;
let moves;
let difficulty;
let difficultyClass;
let setTimer;

const cardContainers = document.querySelectorAll(".card-container");

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

function populate(num) {

	//clear previous clicks and memorised cards
	iconClasses = [];
	clickCount = 0;

	//clear the board
	board.innerHTML = "";

	//LOGIC IS: shuffle the main array and slice half the number of cards
	//this is to always get a random selection of icons
	shuffle(icons);
	let boardIcons = icons.slice(0, num/2);
	
	//duplicate the array values to make pairs and shuffle this new array
	boardIcons = boardIcons.concat(boardIcons);
	shuffle(boardIcons);
	
	//actually populate HTML
	const fragment = document.createDocumentFragment(); 

	for (let x = 0; x < num; x++) {
		const cardContainer = document.createElement('div');
		cardContainer.classList.add('card-container', difficultyClass);
    	const front = document.createElement('div');
    	const back = document.createElement('div');
    	front.classList.add('card', 'front');
    	back.classList.add('card', 'back');
    	const icon = document.createElement('i');
    	icon.classList.add('icon','fas', 'fa-' + boardIcons[x]);
    	back.appendChild(icon);
    	cardContainer.appendChild(front);
    	cardContainer.appendChild(back);
		fragment.appendChild(cardContainer);
	}
	board.appendChild(fragment); 
}

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

function matchChecker(e){
	//LOGIC IS: make sure the click target is a card
	if (e.target.classList.contains('card')) { 
		//flip the card on click
		e.target.classList.add('front-open');
	    e.target.nextElementSibling.classList.add('back-open');
	    //keep track of the class of the icons in the clicked cards
		iconClasses.push(e.target.nextElementSibling.firstChild.classList[2]);
		//collect the clicked card elements
		selectedCards.push(e.target);

		clickCount += 1;
		//allow only two clicks and then verify the match
		if (clickCount === 2) {
			clickCount = 0;
			//2 clicks make 1 move
			moves +=1;
			document.getElementById('moves').innerHTML = moves;

			//remove the ability to click extra cards for 1 second while the 2 already clicked cards are checked
			board.removeEventListener('click', matchChecker);
			setTimeout(function(){
				board.addEventListener('click', matchChecker);
			}, 1000);

			if (iconClasses[0]===iconClasses[1]) {
				console.log('match');
				iconClasses = [];
				//add the class 'correct' to keep the matched cards open
				[].forEach.call(selectedCards, c =>{
					c.classList.add('front-correct');
					c.nextElementSibling.classList.add('back-correct');	
				});
				selectedCards = [];
			} else {
				console.log('not match');
				//wait 1 second before closing mismatching cards, so the player can see what they were
				setTimeout(function(){
					iconClasses = [];
					[].forEach.call(selectedCards, c =>{
						c.classList.remove('front-open');
						c.nextElementSibling.classList.remove('back-open');
						selectedCards = [];
					});	
				}, 1000);
			}

		}				
	} 
}


function startGame() {
	checkDifficulty();
	populate(difficulty);
	sec = 0;  //timer reset
	moves = 0;
	document.getElementById('moves').innerHTML = '0';
	clearInterval(setTimer);
	setTimer = setInterval(timer, 1000);
}

reset.addEventListener('click', startGame);
form.addEventListener('change', startGame);
board.addEventListener('click', matchChecker);

window.addEventListener('load', startGame);
