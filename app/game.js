define(function (require) {
  // var platformScene = require('scenes/platform');
  var SkyMapScene = require('scenes/sky_map');

  var config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 1200,
    height: 800,
    backgroundColor: '#2d2d2d',
    scene: new SkyMapScene()
  };

  new Phaser.Game(config);
});
