const icons = ['ambulance', 'anchor', 'balance-scale', 'basketball-ball', 'bath', 'bed', 'beer', 'bicycle', 'binoculars', 'bomb', 'bug', 'car', 'chess-rook', 'chess-queen', 'cloud', 'fighter-jet', 'fire', 'gamepad', 'home', 'sun', 'volleyball-ball', 'chess-knight'];
const board = document.querySelector('.game-board');
let clickCount = 0;
let clickedCards = [];

function startGame() {
	//timerReset();
	//starReset();
	populate(4);
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
		setTimeout ( function(){
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
					clickedCards = [];
					[].forEach.call(selectedCards, c =>{
						c.classList.remove('open');
					});
				}
			}
		}, 2000);		
	}

});


function timer(){
	
}

startGame();
