// Configuração do Phaser e criação do game
var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	backgroundColor: '#222',
	parent: 'game-container',
	scene: [Scene01],
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 1000 },
			// debug: true
		},
		pixelArt: true
	}
};
