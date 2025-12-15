class Scene01 extends Phaser.Scene {
	constructor() {
		super({ key: 'Scene01' });
	}

	preload() {
		this.load.audio('soundJump', 'assets/audios/audioPulo.wav');

		this.load.image('background', 'assets/sprites/background-game.png');

		this.load.image('ground', 'assets/sprites/chao.png');
		this.load.image('brick', 'assets/sprites/bloco.png');
		this.load.image('door', 'assets/sprites/porta.png');
		this.load.image('platformSmall', 'assets/sprites/plataforma-p.png');
		this.load.image('platformMedium', 'assets/sprites/plataforma-m.png');
		this.load.image('platformLarge', 'assets/sprites/plataforma-g.png');

		this.load.image('produto', 'assets/sprites/produto.png');
		this.load.image('dev', 'assets/sprites/dev.png');
		this.load.image('suporte', 'assets/sprites/suporte.png');
		this.load.image('cloudInfra', 'assets/sprites/cloud-infra.png');
		this.load.image('marketing', 'assets/sprites/marketing.png');
		this.load.image('comercial', 'assets/sprites/comercial.png');
		this.load.image('financeiro', 'assets/sprites/financeiro.png');
		this.load.image('cs', 'assets/sprites/cs.png');
		this.load.image('implantacao', 'assets/sprites/implantacao.png');
		this.load.image('ecossistema', 'assets/sprites/ecossistema.png');
		this.load.image('iopa', 'assets/sprites/iopa.png');
		this.load.image('sdr', 'assets/sprites/sdr.png');

		this.load.image('shoot', 'assets/sprites/disparo.png');

		this.load.spritesheet('player', 'assets/sprites/player-parado.png', {
			frameWidth: 105,
			frameHeight: 198,
		});

		this.load.spritesheet('playerRunning', 'assets/sprites/player-correndo.png', {
			frameWidth: 164,
			frameHeight: 198,
		});

		this.load.spritesheet('monster', 'assets/sprites/churn.png', {
			frameWidth: 352,
			frameHeight: 252,
		});
	}

	create() {
		this.soundJump = this.sound.add('soundJump');

		this.nanCount = 0; // Contador de vezes que o HP virou NaN
		this.shoots = this.physics.add.group();
		// Cooldown para evitar múltiplos tiros por frame
		this.shootCooldown = 0;
		// Contador de equipes coletadas
		this.equipesColetadas = 0;
		this.totalEquipes = 12;
		this.equipesText = this.add
			.text(16, 16, `Equipes: 0/12`, {
				// fontFamily: 'Press Start 2P',
				fontSize: '18px',
				fill: '#fff',
				backgroundColor: 'rgba(0,0,0,0.5)',
				padding: { x: 8, y: 4 },
			})
			.setScrollFactor(0)
			.setDepth(100);
		this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);

		this.player = this.physics.add
			.sprite(50, 50, 'player')
			.setScale(0.5)
			.setCollideWorldBounds(true);

		this.player.canJump = true;

		/* ANIMAÇÕES */
		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
			frameRate: 8,
			repeat: -1,
		});

		this.anims.create({
			key: 'run',
			frames: this.anims.generateFrameNumbers('playerRunning', { start: 0, end: 8 }),
			frameRate: 16,
			repeat: -1,
		});

		this.anims.create({
			key: 'jump',
			frames: [{ key: 'playerRunning', frame: 3 }],
			frameRate: 1,
		});

		this.player.anims.play('idle');

		/* INPUT */
		this.control = this.input.keyboard.createCursorKeys();
		this.wasd = this.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			right: Phaser.Input.Keyboard.KeyCodes.D,
			space: Phaser.Input.Keyboard.KeyCodes.SPACE,
		});

		/* GRUPOS */
		this.grounds = this.physics.add.staticGroup();
		this.bricks = this.physics.add.staticGroup();
		this.doors = this.physics.add.staticGroup();
		this.platformsSmall = this.physics.add.staticGroup();
		this.platformsMedium = this.physics.add.staticGroup();
		this.platformsLarge = this.physics.add.staticGroup();

		/* CHÃO */
		this.grounds.create(0, 600, 'ground').setScale(2, 1).setOrigin(0, 1).refreshBody();
		this.grounds.create(800, 600, 'ground').setScale(2, 1).setOrigin(0, 1).refreshBody();
		this.grounds.create(1600, 600, 'ground').setScale(2, 1).setOrigin(0, 1).refreshBody();

		/* BLOCOS */
		this.bricks.create(784, 182, 'brick').refreshBody();
		this.bricks.create(784, 190, 'brick').refreshBody();
		this.bricks.create(784, 222, 'brick').refreshBody();
		this.bricks.create(784, 254, 'brick').refreshBody();
		this.bricks.create(784, 286, 'brick').refreshBody();
		this.bricks.create(784, 318, 'brick').refreshBody();
		this.bricks.create(784, 350, 'brick').refreshBody();
		this.bricks.create(784, 382, 'brick').refreshBody();
		this.bricks.create(784, 414, 'brick').refreshBody();
		this.bricks.create(784, 446, 'brick').refreshBody();
		this.bricks.create(784, 478, 'brick').refreshBody();
		this.bricks.create(784, 500, 'brick').refreshBody();
		this.bricks.create(784, 532, 'brick').refreshBody();
		this.bricks.create(784, 564, 'brick').refreshBody();
		this.bricks.create(784, 596, 'brick').refreshBody();

		this.bricks.create(1584, 150, 'brick').refreshBody();
		this.bricks.create(1584, 182, 'brick').refreshBody();
		this.bricks.create(1584, 190, 'brick').refreshBody();
		this.bricks.create(1584, 222, 'brick').refreshBody();
		this.bricks.create(1584, 254, 'brick').refreshBody();
		this.bricks.create(1584, 286, 'brick').refreshBody();
		this.bricks.create(1584, 318, 'brick').refreshBody();
		this.bricks.create(1584, 350, 'brick').refreshBody();
		this.bricks.create(1584, 382, 'brick').refreshBody();
		this.bricks.create(1584, 414, 'brick').refreshBody();
		this.bricks.create(1584, 446, 'brick').refreshBody();
		this.bricks.create(1584, 478, 'brick').refreshBody();
		this.bricks.create(1584, 500, 'brick').refreshBody();
		this.bricks.create(1584, 532, 'brick').refreshBody();
		this.bricks.create(1584, 564, 'brick').refreshBody();
		this.bricks.create(1584, 596, 'brick').refreshBody();

		this.doors.create(1584, 72, 'door').refreshBody();

		/* PLATAFORMAS */
		this.platformsLarge.create(250, 150, 'platformSmall').refreshBody();
		this.platformsSmall.create(350, 450, 'platformSmall').refreshBody();
		this.platformsSmall.create(718, 450, 'platformSmall').refreshBody();
		this.platformsLarge.create(400, 300, 'platformLarge').refreshBody();
		this.platformsLarge.create(600, 150, 'platformLarge').refreshBody();

		this.platformsMedium.create(1200, 150, 'platformLarge').refreshBody();
		this.platformsSmall.create(850, 300, 'platformSmall').refreshBody();
		this.platformsSmall.create(1518, 300, 'platformSmall').refreshBody();

		/* PLATAFORMA MÓVEL */
		this.movingPlatform = this.physics.add
			.image(1000, 450, 'platformMedium')
			.setImmovable(true)
			.setVelocityX(100);

		this.movingPlatform.body.allowGravity = false;

		/* ITENS COLETÁVEIS */
		this.collectables = this.physics.add.group();

		const itemsConfig = [
			{ key: 'dev', x: 250, y: 100 },
			{ key: 'produto', x: 350, y: 400 },
			{ key: 'suporte', x: 700, y: 400 },
			{ key: 'cloudInfra', x: 250, y: 250 },
			{ key: 'marketing', x: 500, y: 250 },
			{ key: 'comercial', x: 600, y: 100 },

			{ key: 'financeiro', x: 1500, y: 100 },
			{ key: 'cs', x: 850, y: 100 },
			{ key: 'implantacao', x: 1100, y: 100 },
			{ key: 'ecossistema', x: 1300, y: 100 },
			{ key: 'iopa', x: 1500, y: 500 },
			{ key: 'sdr', x: 900, y: 500 },
		];

		itemsConfig.forEach(({ key, x, y }) => {
			const item = this.collectables.create(x, y, key).setScale(0.4);
			item.type = key;
		});

		/* COLISÕES */
		// Colisão do tiro com blocos
		this.physics.add.collider(this.shoots, this.bricks, (shoot, brick) => {
			shoot.destroy();
		});
		this.physics.add.collider(this.player, this.grounds);
		this.physics.add.collider(this.player, this.bricks);
		this.physics.add.collider(this.player, this.platformsSmall);
		this.physics.add.collider(this.player, this.platformsMedium);
		this.physics.add.collider(this.player, this.platformsLarge);
		this.physics.add.collider(this.player, this.movingPlatform);
		this.physics.add.collider(this.player, this.doors);

		// player x coletáveis
		this.physics.add.overlap(this.player, this.collectables, this.coletarItem, null, this);

		// coletáveis x cenário
		this.physics.add.collider(this.collectables, this.grounds);
		this.physics.add.collider(this.collectables, this.bricks);
		this.physics.add.collider(this.collectables, this.platformsSmall);
		this.physics.add.collider(this.collectables, this.platformsMedium);
		this.physics.add.collider(this.collectables, this.platformsLarge);

		/* CÂMERA */
		this.physics.world.setBounds(0, 0, this.background.width, this.background.height);
		this.cameras.main.setBounds(0, 0, this.background.width, this.background.height);
		this.cameras.main.startFollow(this.player);

		this.monster = this.physics.add.sprite(2200, 450, 'monster');

		// this.monster.setCollideWorldBounds(true);
		this.monster.setImmovable(true);
		this.monster.body.allowGravity = false;

		this.monster.body.setSize(105, 105).setOffset(100, 125);

		// ⚠️ HP PRECISA SER DEFINIDO AQUI
		this.monster.hp = 10;
		this.monster.isDead = false;
		this.monster.lastHit = 0;

		this.anims.create({
			key: 'monster-idle',
			frames: this.anims.generateFrameNumbers('monster', { start: 4, end: 13 }),
			frameRate: 6,
			repeat: -1,
		});

		this.monster.play('monster-idle');

		this.monsterOverlap = this.physics.add.overlap(
			this.shoots,
			this.monster,
			this.acertarMonstro,
			null,
			this
		);
	}

	update() {
		// Atualiza cooldown do tiro
		if (this.shootCooldown > 0) {
			this.shootCooldown--;
		}
		const left = this.control.left.isDown || this.wasd.left.isDown;
		const right = this.control.right.isDown || this.wasd.right.isDown;
		const up = this.control.up.isDown || this.wasd.up.isDown;

		if (left) {
			this.player.setVelocityX(-200);
			// this.player.setVelocityX(-800);
			this.player.setFlipX(true);
		} else if (right) {
			this.player.setVelocityX(200);
			// this.player.setVelocityX(800);
			this.player.setFlipX(false);
		} else {
			this.player.setVelocityX(0);
		}

		if (up && this.player.canJump && this.player.body.blocked.down) {
			this.soundJump.play();
			this.player.setVelocityY(-575);
			this.player.canJump = false;
		}

		if (!up && this.player.body.blocked.down) {
			this.player.canJump = true;
		}

		if (!this.player.body.blocked.down) {
			this.player.anims.play('jump', true);
		} else if (left || right) {
			this.player.anims.play('run', true);
			this.player.body.setSize(100, 198);
		} else {
			this.player.anims.play('idle', true);
			this.player.body.setSize(105, 198);
		}

		if (this.movingPlatform.x >= 1400) {
			this.movingPlatform.setVelocityX(-100);
		} else if (this.movingPlatform.x <= 1000) {
			this.movingPlatform.setVelocityX(100);
		}

		// Disparo ao pressionar espaço
		if (
			(Phaser.Input.Keyboard.JustDown(this.control.space) ||
				Phaser.Input.Keyboard.JustDown(this.wasd.space)) &&
			this.shootCooldown === 0
		) {
			this.shootCooldown = 50;

			const offsetX = this.player.flipX ? -40 : 40;
			const shoot = this.shoots.create(this.player.x + offsetX, this.player.y, 'shoot');

			shoot.setVelocityX(this.player.flipX ? -500 : 500);
			shoot.setVelocityY(0);
			shoot.setGravityY(0);
			shoot.setCollideWorldBounds(true);
			shoot.body.onWorldBounds = true;
			shoot.body.allowGravity = false;
			shoot.setScale(0.75);

			// ⚠️ AQUI: chave única + Set de monstros atingidos
			shoot.key = Phaser.Math.RND.uuid();
			shoot.hitMonsters = new Set();

			// Remove o tiro ao sair da tela
			shoot.body.world.on('worldbounds', function (body) {
				if (body.gameObject === shoot) {
					shoot.destroy();
				}
			});
		}
	}

	coletarItem(player, item) {
		item.disableBody(true, true);

		// Atualiza contador de equipes
		this.equipesColetadas++;
		this.equipesText.setText(`Equipes: ${this.equipesColetadas}/${this.totalEquipes}`);

		// Remove a porta se coletou todos os itens
		if (this.equipesColetadas >= this.totalEquipes) {
			this.doors.clear(true, true);
		}

		// switch (item.type) {
		// 	case 'produto':
		// 		console.log('Reuniu Produto');
		// 		break;
		// }
	}

	acertarMonstro(shoot, monster) {
		if (monster.isDead) return;

		if (!shoot.hitMonsters) {
			shoot.hitMonsters = new Set();
		}

		if (shoot.hitMonsters.has(monster)) return;

		shoot.hitMonsters.add(monster);

		monster.hp--;
		console.log('HP do monstro:', monster.hp);

		if (isNaN(monster.hp)) {
			this.nanCount++;
			console.log('Contador de NaN:', this.nanCount);

			if (this.nanCount >= 10) {
				this.gameOver();
				return;
			}
		}

		monster.setTint(0xff0000);
		this.time.delayedCall(100, () => monster.clearTint());

		if (monster.hp <= 0) {
			monster.isDead = true;
			this.matarMonstro(monster);
		}
	}

	gameOver() {
		console.log('Fim de jogo!');
		this.physics.world.pause();
		this.scene.pause();
		// Aqui você pode exibir tela de Game Over ou reiniciar a cena se quiser
		const style = { fontSize: '48px', fill: '#fff' };
		this.add.text(
			this.cameras.main.centerX - 150,
			this.cameras.main.centerY,
			'GAME OVER',
			style
		);
	}

	matarMonstro(monster) {
		if (this.monsterOverlap) {
			this.physics.world.removeCollider(this.monsterOverlap);
			this.monsterOverlap = null;
		}
		monster.destroy();
		this.monster = null;
		console.log('Monstro destruído!');
	}
}
