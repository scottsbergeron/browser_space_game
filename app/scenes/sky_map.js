define(function (require) {
  var Phaser = require('Phaser');
  var MapGenerator = require('utils/map_generator');

  const TILE_SIZE = 128;

  class SkyMapScene extends Phaser.Scene {
    constructor() {
      super();

      this.controls;
    }

    preload() {
      this.load.image('tilesetGround', 'assets/tileset_ground.png');
      this.load.image('tilesetUnderside', 'assets/tileset_underside.png');
    }

    create() {
      const mapGenerator = new MapGenerator([1, 2, 3, 4, 5]);
      const ground = mapGenerator.generate();

      const tilemapUnderside = this.make.tilemap({ data: ground, tileWidth: TILE_SIZE, tileHeight: TILE_SIZE });
      const tileUndersides = tilemapUnderside.addTilesetImage('tilesetUnderside');

      const tilemapGround = this.make.tilemap({ data: ground, tileWidth: TILE_SIZE, tileHeight: TILE_SIZE });
      const tileGrounds = tilemapGround.addTilesetImage('tilesetGround');

      tilemapUnderside.createLayer(0, tileUndersides, 0, 20);
      tilemapGround.createLayer(0, tileGrounds, 0, 0);

      var cursors = this.input.keyboard.createCursorKeys();

      this.cameras.main.centerOn(ground[0].length * TILE_SIZE / 2, ground.length * TILE_SIZE / 2);

      var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        acceleration: 0.02,
        drag: 0.001,
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