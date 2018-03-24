const icons = ['ambulance', 'anchor', 'balance-scale', 'basketball-ball', 'bath', 'bed', 'beer', 'bicycle', 'binoculars', 'bomb', 'bug', 'car', 'chess-rook', 'chess-queen', 'cloud', 'fighter-jet', 'fire', 'gamepad', 'home', 'sun', 'volleyball-ball', 'chess-knight'];
const board = document.querySelector('.game-board');
const reset = document.getElementById('reset');
const form = document.getElementById('form');
const difficulties = document.querySelectorAll("input[name='difficulty']");
let clickCount = 0;
let iconClasses;
let selectedCards = [];
let sec;
let difficulty;
let difficultyClass;

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

//populate board with cards
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
	
	//duplicate the array values to make pairs and shuflfe this new array
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
	if (e.target.classList.contains('card')) { 
		//flip the card on click
		e.target.classList.add('front-open');
	    e.target.nextElementSibling.classList.add('back-open');

	    //keep track of the class of the icons in the clicked cards
		iconClasses.push(e.target.nextElementSibling.firstChild.classList[2]);

		selectedCards.push(e.target);

		clickCount += 1;

		if (clickCount === 2) {
			clickCount = 0;
			//remove the abvility to click extra cards for 1 second while the cards are checked
			board.removeEventListener('click', matchChecker);
			setTimeout(function(){
			board.addEventListener('click', matchChecker)
			}, 1000);


			if (iconClasses[0]===iconClasses[1]) {
				console.log('match');
				//clear the icon classes array
				iconClasses = [];
				//if it's a match, add the class 'correct' to keep the cards open
				[].forEach.call(selectedCards, c =>{
					console.log("this is c =>", c);
					c.classList.add('front-correct');
					c.nextElementSibling.classList.add('back-correct');
					
				});
			} else {
				//if it's not a match, remove the class 'open' so the cards close again
				//wait 1 second before reflipping the crds so the player can see what they were
				console.log('not match');
				setTimeout(function(){
					//clear the icon classes array
					iconClasses = [];
					[].forEach.call(selectedCards, c =>{
						c.classList.remove('front-open');
						c.nextElementSibling.classList.remove('back-open');
						// c.firstChild.classList.remove('icon_open');
						selectedCards = [];
					});	
				}, 1000);
			}

		}				
	} 
}

reset.addEventListener('click', startGame);
form.addEventListener('change', startGame);
board.addEventListener('click', matchChecker);

startGame();