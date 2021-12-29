define(function (require) {
  var Phaser = require('Phaser');

  class SkyMapScene extends Phaser.Scene {
    constructor() {
      // TODO: Take in the canvas size
      super();

      this.controls;
    }

    preload() {
      // TODO: Split underside into own tileset
      this.load.image('tilesetGround', 'assets/tileset_ground.png');
    }

    create() {
      // TODO: Write a map generation function
      const ground = [];
      const underside = [];
      for (var i = 0; i < 10; i++) {
        ground[i] = [];
        underside[i] = [];
        for (var j = 0; j < 10; j++) {
          ground[i][j] = Math.floor(Math.random() * 32);
          underside[i][j] = ground[i][j] + 32;
        }
      }
      ground[1][1] = null
      underside[1][1] = null

      // TODO: Pass the same map data to each tilemap
      const tilemapGround = this.make.tilemap({ data: ground, tileWidth: 128, tileHeight: 128 });
      const tileGrounds = tilemapGround.addTilesetImage('tilesetGround');

      const tilemapUnderside = this.make.tilemap({ data: underside, tileWidth: 128, tileHeight: 128 });
      const tileUndersides = tilemapUnderside.addTilesetImage('tilesetGround');

      tilemapUnderside.createLayer(0, tileUndersides, 0, 20);
      tilemapGround.createLayer(0, tileGrounds, 0, 0);

      var cursors = this.input.keyboard.createCursorKeys();

      this.cameras.main.setZoom(1);
      this.cameras.main.centerOn(640, 640);

      var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        acceleration: 0.02,
        drag: 0.0005,
        maxSpeed: 0.7
      };

      this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
    }

    update(time, delta) {
      this.controls.update(delta);
    }
  };

  return SkyMapScene;
});