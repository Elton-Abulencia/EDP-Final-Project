export class Reward {
  constructor(data, root) {
    this._root = root;
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.points = data.points;
    // this.sizes
  }

  get _dataToStore() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      points: this.points,
    };
  }
}

/**
 * id
 * name
 * desc
 * points cost
 *
 */
