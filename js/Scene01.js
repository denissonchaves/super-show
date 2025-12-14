class Scene01 extends Phaser.Scene {
	constructor() {
		super({ key: 'Scene01' });
	}

	preload() {
		this.load.image('background', 'assets/sprites/background-game.png');

		this.load.image('ground', 'assets/sprites/chao.png');
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

		this.load.spritesheet('player', 'assets/sprites/player-parado.png', {
			frameWidth: 105,
			frameHeight: 198,
		});

		this.load.spritesheet('playerRunning', 'assets/sprites/player-correndo.png', {
			frameWidth: 164,
			frameHeight: 198,
		});
	}

	create() {
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
		this.platformsSmall = this.physics.add.staticGroup();
		this.platformsMedium = this.physics.add.staticGroup();
		this.platformsLarge = this.physics.add.staticGroup();

		/* CHÃO */
		this.grounds.create(0, 600, 'ground').setScale(2, 1).setOrigin(0, 1).refreshBody();
		this.grounds.create(800, 600, 'ground').setScale(2, 1).setOrigin(0, 1).refreshBody();

		/* PLATAFORMAS */
		this.platformsSmall.create(350, 450, 'platformSmall').refreshBody();
		this.platformsSmall.create(700, 450, 'platformSmall').refreshBody();
		this.platformsLarge.create(400, 300, 'platformLarge').refreshBody();
		this.platformsLarge.create(600, 150, 'platformLarge').refreshBody();

		/* PLATAFORMA MÓVEL */
		this.movingPlatform = this.physics.add
			.image(200, 350, 'platformMedium')
			.setImmovable(true)
			.setVelocityX(100);

		this.movingPlatform.body.allowGravity = false;

		/* ITENS COLETÁVEIS */
		this.collectables = this.physics.add.group();

		const itemsConfig = [
			{ key: 'produto', x: 600, y: 100 },
			{ key: 'dev', x: 350, y: 400 },
			{ key: 'suporte', x: 700, y: 400 },
			{ key: 'cloudInfra', x: 400, y: 250 },
		];

		itemsConfig.forEach(({ key, x, y }) => {
			const item = this.collectables.create(x, y, key).setScale(0.4);

			// metadata opcional (pode usar depois)
			item.type = key;
		});

		/* COLISÕES */
		this.physics.add.collider(this.player, this.grounds);
		this.physics.add.collider(this.player, this.platformsSmall);
		this.physics.add.collider(this.player, this.platformsMedium);
		this.physics.add.collider(this.player, this.platformsLarge);
		this.physics.add.collider(this.player, this.movingPlatform);

		// player x coletáveis
		this.physics.add.overlap(this.player, this.collectables, this.coletarItem, null, this);

		// coletáveis x cenário
		this.physics.add.collider(this.collectables, this.grounds);
		this.physics.add.collider(this.collectables, this.platformsSmall);
		this.physics.add.collider(this.collectables, this.platformsMedium);
		this.physics.add.collider(this.collectables, this.platformsLarge);

		/* CÂMERA */
		this.physics.world.setBounds(0, 0, this.background.width, this.background.height);
		this.cameras.main.setBounds(0, 0, this.background.width, this.background.height);
		this.cameras.main.startFollow(this.player);
	}

	update() {
		const left = this.control.left.isDown || this.wasd.left.isDown;
		const right = this.control.right.isDown || this.wasd.right.isDown;
		const up = this.control.up.isDown || this.wasd.up.isDown;

		if (left) {
			this.player.setVelocityX(-200);
			this.player.setFlipX(true);
		} else if (right) {
			this.player.setVelocityX(200);
			this.player.setFlipX(false);
		} else {
			this.player.setVelocityX(0);
		}

		if (up && this.player.canJump && this.player.body.blocked.down) {
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
		} else {
			this.player.anims.play('idle', true);
		}

		if (this.movingPlatform.x >= 600) {
			this.movingPlatform.setVelocityX(-100);
		} else if (this.movingPlatform.x <= 200) {
			this.movingPlatform.setVelocityX(100);
		}
	}

	coletarItem(player, item) {
		item.disableBody(true, true);

		// lógica específica por tipo (se precisar)
		switch (item.type) {
			case 'produto':
				console.log('Coletou produto');
				break;
			case 'dev':
				console.log('Coletou dev');
				break;
			case 'suporte':
				console.log('Coletou suporte');
				break;
			case 'cloudInfra':
				console.log('Coletou cloud infra');
				break;
		}
	}
}
