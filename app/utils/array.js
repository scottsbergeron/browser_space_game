define(function () {
  class ArrayUtil {
    static defaultMatrix(rows, columns, defaultValue) {
      var matrix = [];
      for (var i=0; i < rows; i++) {
        matrix.push([]);
        for (var j=0; j < columns; j++) {
          matrix[i].push(defaultValue);
        }
      }
      return matrix;
    }
  };

  return ArrayUtil;
});