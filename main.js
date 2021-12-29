requirejs.config({
  baseUrl: '../app',
  paths: {
      Phaser: 'https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min'
  }
});

requirejs(['game']);
