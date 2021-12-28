define(function (require) {
  var Phaser = require('Phaser');

  class PlatformScene extends Phaser.Scene {
    constructor() {
      super();

      // State
      this.score = 0;

      // Objects
      this.bombs;
      this.player;
      this.scoreText;
      this.stars;
    }

    preload() {
      this.load.image('sky', 'assets/sky.png');
      this.load.image('ground', 'assets/platform.png');
      this.load.image('star', 'assets/star.png');
      this.load.image('bomb', 'assets/bomb.png');
      this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create() {
      this.add.image(400, 300, 'sky');

      var platforms = this.physics.add.staticGroup();
      platforms.create(400, 568, 'ground').setScale(2).refreshBody();
      platforms.create(600, 400, 'ground');
      platforms.create(50, 250, 'ground');
      platforms.create(750, 220, 'ground');

      this.player = this.physics.add.sprite(100, 450, 'dude');
      this.player.setBounce(0.2);
      this.player.setCollideWorldBounds(true);

      this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
      });
      this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
      });

      this.stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
      });
      this.bombs = this.physics.add.group();

      this.stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      });

      this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

      this.physics.add.collider(this.player, platforms);
      this.physics.add.collider(this.stars, platforms);
      this.physics.add.collider(this.bombs, platforms);
      this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

      this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
    }

    update() {
      var cursors = this.input.keyboard.createCursorKeys();
      if (cursors.left.isDown) {
        this.player.setVelocityX(-160);

        this.player.anims.play('left', true);
      }
      else if (cursors.right.isDown) {
        this.player.setVelocityX(160);

        this.player.anims.play('right', true);
      }
      else {
        this.player.setVelocityX(0);

        this.player.anims.play('turn');
      }

      if (cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-330);
      }
    }

    collectStar(player, star) {
      star.disableBody(true, true);

      this.score += 10;
      this.scoreText.setText('Score: ' + this.score);

      if (this.stars.countActive(true) === 0) {
        this.stars.children.iterate(function (child) {

          child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = this.bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

      }
    }

    hitBomb(player, bomb) {
      this.physics.pause();

      player.setTint(0xff0000);

      player.anims.play('turn');
    }
  };

  return PlatformScene;
});