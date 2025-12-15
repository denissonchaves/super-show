const main = document.querySelector('main');
const footer = document.querySelector('footer');

const mainMenu = document.querySelector('#main-menu');
const gameOverMenu = document.querySelector('#game-over-menu');
const gameContainer = document.querySelector('#game-container');

const mainMenuItems = document.querySelectorAll('#main-menu .menu-item');
const gameOverMenuItems = document.querySelectorAll('#game-over-menu .menu-item');

const gameName = document.querySelector('.game-name');
const gameOverName = document.querySelector('.game-over-name');
const gameWin = document.querySelector('.game-win');

const dialogOverlays = document.querySelectorAll('.dialog-overlay');

let currentIndex = 0;

function handleKeyDown(event) {
	const isDialogOpen = Array.from(dialogOverlays).some(
		(overlay) => !overlay.classList.contains('-hidden')
	);

	if (isDialogOpen) {
		if (event.key === 'Enter' || event.key === 'Escape') {
			dialogOverlays.forEach((overlay) => {
				if (!overlay.classList.contains('-hidden')) {
					overlay.classList.add('-hidden');
				}
			});
		}
		return; // Se um diálogo estiver aberto, não continue para o menu
	}

	let menuItems;

	if (!mainMenu.classList.contains('-hidden')) {
		menuItems = mainMenuItems;
	} else if (!gameOverMenu.classList.contains('-hidden')) {
		menuItems = gameOverMenuItems;
	} else {
		return; // Nenhum menu visível
	}

	if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') {
		currentIndex = (currentIndex + 1) % menuItems.length;
	} else if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') {
		currentIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
	} else if (event.key === 'Enter') {
		menuItems[currentIndex].click();
	}
	updateSelection(menuItems);
}

function updateSelection(menuItems) {
	menuItems.forEach((item, index) => {
		item.classList.toggle('selected', index === currentIndex);
	});
}

function menuChange(elementToHide, elementToShow) {
	const menuToHide = document.querySelector('#' + elementToHide.closest('section').id);
	const menuToShow = document.querySelector(elementToShow);
	gameOverName.classList.add('-hidden');
	menuToHide.classList.add('-hidden');
	gameName.classList.remove('-hidden');
	menuToShow.classList.remove('-hidden');
	currentIndex = 0;
	updateSelection(menuToShow.querySelectorAll('button'));
}

function openDialog(element) {
	const overlay = document.querySelector(element);
	overlay.classList.remove('-hidden');
}

function closeDialog(that) {
	that.closest('.dialog-overlay').classList.add('-hidden');
}

document.addEventListener('keydown', handleKeyDown);
updateSelection(mainMenuItems);

// audio control
const audio = document.querySelector('#background-music');
const buttonAudio = document.querySelector('.button-audio');
const audioOn = document.querySelector('.audio-on');
const audioOff = document.querySelector('.audio-off');

buttonAudio.addEventListener('click', function () {
	if (audio.paused) {
		audioOn.classList.remove('-hidden');
		audioOff.classList.add('-hidden');
		audio.play();
	} else {
		audioOn.classList.add('-hidden');
		audioOff.classList.remove('-hidden');
		audio.pause();
	}
});

let game;

function showWinGame() {
	if (game) {
		game.destroy(true);
	}
	gameContainer.classList.add('-hidden');
	main.classList.add('-hidden');
	footer.classList.add('-hidden');
	gameName.classList.add('-hidden');
	gameOverName.classList.add('-hidden');
	gameWin.classList.remove('-hidden');
}

function startGame() {
	if (game) {
		game.destroy(true);
	}

	if (audio) {
		audioOn.classList.remove('-hidden');
		audioOff.classList.add('-hidden');
		audio.volume = 0.5;
		audio.loop = true;
		audio.play();
	}

	game = new Phaser.Game(config);
	main.classList.add('-hidden');
	footer.classList.add('-hidden');
	gameWin.classList.add('-hidden');
	gameContainer.classList.remove('-hidden');
}
