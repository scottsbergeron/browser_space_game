define(['utils/array'], function (ArrayUtil) {

  const POI_GROUND_VARIANCE = new Map([
    [1, [1.0, 0.95, 0.85, 0.65, 0.25]],
    [2, [1.0, 0.9, 0.5]]
  ]);

  const PLAYER_STITCHING = new Map([
    [1, [['P']]],
    [2, [['P', '', 'P']]],
    [3, [
      ['P', '', 'P'],
      ['', 'P', '']
    ]],
    [4, [
      ['P', '', 'P'],
      ['', '', ''],
      ['P', '', 'P']
    ]],
    [5, [
      ['P', '', 'P'],
      ['', 'P', ''],
      ['P', '', 'P']
    ]]
  ]);

  const TOP = 1;
  const RIGHT = 2;
  const BOTTOM = 4;
  const LEFT = 8;

  const GROUND_TILE_SPRITE_POS = new Map([
    [0, [0, 1]],
    [1, [16, 17]],
    [2, [8, 9]],
    [3, [24, 25]],
    [4, [2, 3]],
    [5, [18, 19]],
    [6, [10, 11]],
    [7, [26, 27]],
    [8, [6, 7]],
    [9, [22, 23]],
    [10, [14, 15]],
    [11, [30, 31]],
    [12, [4, 5]],
    [13, [20, 21]],
    [14, [12, 13]],
    [15, [28, 29]]
  ]);

  class MapGenerator {

    constructor(players) {
      this.players = players;
    }

    generate() {
      const poiMaps = [];
      this.players.forEach(player => {
        poiMaps.push(this.genPointsOfInterest(player));
      });

      const playerGroundMaps = [];
      poiMaps.forEach(poiMap => {
        playerGroundMaps.push(this.genPlayerGroundMap(poiMap));
      });

      const groundMap = this.stitchPlayerGroundMap(playerGroundMaps);

      this.calcGroundSprites(groundMap);

      return groundMap;
    }

    genPointsOfInterest(player) {
      return [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 2, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 2, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0, 0, 0]
      ];
    }

    genPlayerGroundMap(poiMap) {
      const varianceMap = ArrayUtil.defaultMatrix(poiMap.length, poiMap[0].length, 0.0);
      const groundMap = ArrayUtil.defaultMatrix(poiMap.length, poiMap[0].length, 0);

      // Iterate through every item in the poi map
      for (var y = 0; y < poiMap.length; y++) {
        for (var x = 0; x < poiMap[y].length; x++) {
          if (poiMap[y][x] > 0) {
            // For each poi, run a BFS with the POI_GROUND_VARIANCE and set each values variance according
            // to the proximity to the POI.
            const visitedMap = ArrayUtil.defaultMatrix(poiMap.length, poiMap[0].length, false);
            this.populateVariance(x, y, POI_GROUND_VARIANCE.get(poiMap[y][x]), varianceMap, visitedMap);
          }
        }
      }

      // Randomly determine where ground is based on variance map
      for (var y = 0; y < varianceMap.length; y++) {
        for (var x = 0; x < varianceMap[y].length; x++) {
          groundMap[y][x] = Math.random() <= varianceMap[y][x] ? 1 : null;
        }
      }

      return groundMap;
    }

    populateVariance(startX, startY, varianceArray, varianceMap, visitedMap) {
      const queue = [];
      queue.push([0, 0, varianceArray]);

      while (queue.length > 0) {
        var [offsetX, offsetY, varianceArray] = queue.shift();
        const currentX = startX + offsetX;
        const currentY = startY + offsetY;

        const newVariance = varianceArray[0];
        const currentVariance = varianceMap[currentY][currentX];
        if (currentVariance < newVariance) {
          varianceMap[currentY][currentX] = newVariance;
        }

        const nextVarianceArray = varianceArray.slice(1)
        if (nextVarianceArray.length > 0) {
          function enqueue(shiftX, shiftY) {
            try {
              if (visitedMap[currentY + shiftY][currentX + shiftX] === false) {
                visitedMap[currentY + shiftY][currentX + shiftX] = true;
                queue.push([offsetX + shiftX, offsetY + shiftY, nextVarianceArray]);
              }
            } catch (err) {
              if (!(err instanceof TypeError)) {
                throw err;
              }
            }
          }

          enqueue(-1, 0);
          enqueue(0, -1);
          enqueue(1, 0);
          enqueue(0, 1);
        }
      }
    }

    stitchPlayerGroundMap(playerGroundMaps) {
      const stitchConfig = PLAYER_STITCHING.get(playerGroundMaps.length);

      const pMapHeight = playerGroundMaps[0].length;
      const pMapLength = playerGroundMaps[0][0].length;

      const groundMap = ArrayUtil.defaultMatrix(
        stitchConfig.length * pMapHeight,
        stitchConfig[0].length * pMapLength,
        null
      );

      var pIndex = 0;
      for (var i = 0; i < stitchConfig.length; i++) {
        for (var j = 0; j < stitchConfig[i].length; j++) {
          if (stitchConfig[i][j] === 'P') {
            const playerGroundMap = playerGroundMaps[pIndex];
            pIndex++;

            for (var y = 0; y < playerGroundMap.length; y++) {
              for (var x = 0; x < playerGroundMap[y].length; x++) {
                groundMap[y + pMapHeight * i][x + pMapLength * j] = playerGroundMap[y][x];
              }
            }
          }
        }
      }

      return groundMap;
    }

    calcGroundSprites(groundMap) {
      for (var y = 0; y < groundMap.length; y++) {
        for (var x = 0; x < groundMap[y].length; x++) {
          if (groundMap[y][x] !== null) {
            function neighbourExists(offsetX, offsetY) {
              try {
                return ![null, undefined].includes(groundMap[y + offsetY][x + offsetX]);
              } catch (err) {
                if (err instanceof TypeError) {
                  return false;
                } else {
                  throw err;
                }
              }
            }

            var spriteScore = 0;
            spriteScore += neighbourExists(0, -1) ? TOP : 0;
            spriteScore += neighbourExists(1, 0) ? RIGHT : 0;
            spriteScore += neighbourExists(0, 1) ? BOTTOM : 0;
            spriteScore += neighbourExists(-1, 0) ? LEFT : 0;

            const possibleSprites = GROUND_TILE_SPRITE_POS.get(spriteScore);
            groundMap[y][x] = possibleSprites[Math.floor(Math.random() * possibleSprites.length)];
          }
        }
      }
    }
  };

  return MapGenerator;
});