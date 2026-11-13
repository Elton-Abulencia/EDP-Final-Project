import { Product } from "./product.js";

export class ProductsList {
  constructor(localStorePropName = "products") {
    this._localStorePropName = localStorePropName;
    this._products = [];
    this._nextProductId = 0;
    this._load();
  }

  getById(productId) {
    return this._products.find((p) => p.id === productId) || null;
  }

  addNewProduct(name, description, points) {
    const newProduct = new Product(
      { id: this._nextProductId++, name, description, points },
      this,
    );
    this._products.push(newProduct);
    this._save();
    return true;
  }

  updateProduct(productId, { name, description, points }) {
    const product = this.getById(productId);
    if (!product) return false;
    product.update({ name, description, points });
    return true;
  }

  removeProduct(productId) {
    const index = this._products.findIndex((p) => p.id === productId);
    if (index !== -1) {
      this._products.splice(index, 1);
      this._save();
      return true;
    }
    return false;
  }

  calculatePointsEarned(productIds) {
    let pointsEarned = 0;
    for (const productId of productIds) {
      const product = this._products.find((p) => p.id === productId);
      if (!product) return false;
      pointsEarned += product.points;
    }
    return pointsEarned;
  }

  get products() {
    return this._products.map((p) => p._dataToShow);
  }

  _load() {
    const rawData = localStorage.getItem(this._localStorePropName);
    const products = rawData ? JSON.parse(rawData) : [];
    this._products = products.map(
      (p) =>
        new Product(
          {
            id: p.id,
            name: p.name,
            description: p.description,
            points: p.points,
          },
          this,
        ),
    );
    this._nextProductId = this._products.reduce(
      (max, curr) => (curr.id >= max ? curr.id + 1 : max),
      0,
    );
  }

  _save() {
    const data = this._products.map((products) => products._dataToStore);
    localStorage.setItem(this._localStorePropName, JSON.stringify(data));
  }
}
