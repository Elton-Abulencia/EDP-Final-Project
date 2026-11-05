export class Customer {
  constructor(data, root) {
    this._root = root;
    this.code = data.code;
    this.name = data.name;
    this.points = data.points;
  }
  updatePoints(arg) {
    if (typeof arg === "number") {
      this.points = arg;
    } else if (typeof arg === "function") {
      const newPoint = arg(this.points);
      this.points = newPoint;
    } else {
      // throw new Error()
    }
    this._root._save();
  }
  get _dataToStore() {
    return { code: this.code, name: this.name, points: this.points };
  }
}

/**
 * code
 * name
 * //contact
 * points
 * //history logs
 */