function flatMapPolyFill() {
  if (!Array.prototype.flatMap) {
    // eslint-disable-next-line no-extend-native
    Array.prototype.flatMap = function (lambda) {
      return Array.prototype.concat.apply([], this.map(lambda));
    };
  }
}

export function activatePolyFills() {
  flatMapPolyFill();
}
