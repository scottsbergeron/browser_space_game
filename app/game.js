define(function (require) {
  var platformScene = require('app/scenes/platform');

  var config = {
    type: Phaser.AUTO,
    parent: "game-container",
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
        debug: false
      }
    },
    scene: new platformScene()
  };

  new Phaser.Game(config);
});
