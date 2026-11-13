export class Product {
  constructor(data, root) {
    this._root = root;
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.points = data.points;
  }

  update({ name, description, points }) {
    if (name !== undefined) this.name = name;
    if (description !== undefined) this.description = description;
    if (points !== undefined) this.points = points;
    this._root._save();
  }

  get _dataToStore() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      points: this.points,
    };
  }

  get _dataToShow() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      points: this.points,
    };
  }
}
