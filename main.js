requirejs.config({
  baseUrl: 'lib',
  paths: {
      app: '../app',
      Phaser: 'https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min'
  }
});

requirejs(['app/game']);
