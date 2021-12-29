define(function (require) {
  // var platformScene = require('scenes/platform');
  var SkyMapScene = require('scenes/sky_map');

  var config = {
    backgroundColor: '#2d2d2d',
    height: 1440,
    scale: {
      autoCenter: Phaser.Scale.Center.CENTER_HORIZONTALLY,
      mode: Phaser.Scale.FIT,
      parent: 'game-container',
    },
    scene: new SkyMapScene(),
    type: Phaser.AUTO,
    width: 2560,
  };

  new Phaser.Game(config);
});
