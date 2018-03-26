const icons = ['ambulance', 'anchor', 'balance-scale', 'basketball-ball', 'bath', 'bed', 'beer', 'bicycle', 'binoculars', 'bomb', 'bug', 'car', 'chess-rook', 'chess-queen', 'cloud', 'fighter-jet', 'fire', 'gamepad', 'home', 'sun', 'volleyball-ball', 'chess-knight'];
const board = document.querySelector('.game-board');
const reset = document.getElementById('reset');
const replay = document.getElementById('replay');
const form = document.getElementById('form');
const difficulties = document.querySelectorAll("input[name='difficulty']");
const timer = document.getElementById('timer');
const ratingPerfect = document.getElementById('rating-perfect');
const ratingAverage = document.getElementById('rating-average');
const cardContainers = document.querySelectorAll('.card-container');
const modal = document.querySelector('.modal');
let clickCount = 0;
let selectedCards = [];
let iconClasses, sec, moves, wrongMoves, correctMoves, difficulty, difficultyClass, setTimer;

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
	[].forEach.call(difficulties, function(input){
		input.nextElementSibling.classList.remove('checked');
		console.log(input.nextElementSibling)
		if (input.value === 'easy' && input.checked === true) {
			difficulty = 4;
			difficultyClass = 'easy';
			input.nextElementSibling.classList.add('checked');
		} else if (input.value === 'normal' && input.checked === true) {
			difficulty = 16;
			difficultyClass = 'normal';
			input.nextElementSibling.classList.add('checked');
		} else if (input.value === 'hard' && input.checked === true) {
			difficulty = 36;
			difficultyClass = 'hard';
			input.nextElementSibling.classList.add('checked');
		}
	});
}

function populate(num) {
	iconClasses = [];
	clickCount = 0;
	board.innerHTML = '';
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

function stopwatch(){
	sec+=1;
	if (sec<60) {
		timer.innerText = sec;
	} else if (sec<3600) {
		let minutes = Math.floor(sec/60);
		let seconds = sec % 60;
		timer.innerText = minutes+":"+seconds;
	}
}

function rating(num) {
	//star rating differs with difficulty. Allow as many wrong moves as card pairs, and then another 50% to next level. 
	switch (difficultyClass) {
		case 'easy' :
			if (num === 2) {
				ratingPerfect.classList.add('hide');
			} else if (num === 3) {
				ratingAverage.classList.add('hide');
			};
			break;
		case 'normal' :
			if (num === 8) {
				ratingPerfect.classList.add('hide');
			} else if (num === 12) {
				ratingAverage.classList.add('hide');
			};
			break;
		case 'hard' :
			if (num === 18) {
				ratingPerfect.classList.add('hide');
			} else if (num === 27) {
				ratingAverage.classList.add('hide');
			};
			break;
	}
}

function checkwin(num) {
	//easy won with 2 correct moves, normal with 8 and hard with 18
	let won;
	switch (difficultyClass) {
		case 'easy' :
			if (num === 2) {
				won = true;
			};
			break;
		case 'normal' :
			if (num === 8) {
				won = true;	
			};
			break;
		case 'hard' :
			if (num === 18){
				won = true;
			};
			break;
	};
	if (won === true) {
		//wait 1 sec for the cards to flip right side up
		setTimeout(function(){
			//fill in and display modal
			document.getElementById('final-time').innerText = timer.innerText;
			document.getElementById('final-moves').innerText = moves;
			document.getElementById('final-rating').innerHTML = document.getElementById('stars').innerHTML;
			modal.classList.remove('hide');
			//stop the stopwatch
			clearInterval(setTimer);
		}, 1000);
	}
}

function matchChecker(e){
	//LOGIC IS: make sure the click target is a card and prevent doubleclicking 
	if (e.target.classList.contains('card') && !e.target.classList.contains('front-open')) {
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
				correctMoves += 1;
				//check if game is won
				checkwin(correctMoves);
				iconClasses = [];
				//add the class 'correct' to keep the matched cards open
				[].forEach.call(selectedCards, c =>{
					c.classList.add('front-correct');
					c.nextElementSibling.classList.add('back-correct');	
				});
			} else {
				console.log('not match');
				//remove stars if too many wrong moves are made, how many depends on the difficulty
				wrongMoves +=1;
				rating(wrongMoves);
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
	//cleanup board and reset everything
	sec = 0; 
	moves = 0;
	wrongMoves = 0;
	correctMoves = 0;
	timer.innerText = '0';
	document.getElementById('moves').innerHTML = '0';
	modal.classList.add('hide');
	ratingPerfect.classList.remove('hide');
	ratingAverage.classList.remove('hide');
	clearInterval(setTimer);
	//restart game logic
	checkDifficulty();
	populate(difficulty);
	//start the timer on first click
	board.addEventListener('click', function clickOnce(){
		clearInterval(setTimer);
		setTimer = setInterval(stopwatch, 1000);
		board.removeEventListener('click', clickOnce)
	});
}

reset.addEventListener('click', startGame);
replay.addEventListener('click', startGame);
form.addEventListener('change', startGame);
window.addEventListener('click', function(e){
	if (e.target === modal) {
		startGame();
	}
});
board.addEventListener('click', matchChecker);
window.addEventListener('load', startGame);