export class Customer {
  constructor(data, root) {
    this._root = root;
    this.code = data.code;
    this.name = data.name;
    this.points = data.points ?? 0;
    this.contact = data.contact ?? "";
    this.note = data.note ?? "";
    this.history = Array.isArray(data.history) ? data.history : [];
  }

  updatePoints(arg) {
    if (typeof arg === "number") {
      this.points = arg;
    } else if (typeof arg === "function") {
      this.points = arg(this.points);
    }
    this._root._save();
  }

  updateDetails({ contact, note }) {
    if (contact !== undefined) this.contact = contact;
    if (note !== undefined) this.note = note;
    this._root._save();
  }

  addHistory(title, desc = "") {
    this.history.unshift({
      title,
      desc,
      date: new Date().toLocaleString(),
    });
    this._root._save();
  }

  get _dataToStore() {
    return {
      code: this.code,
      name: this.name,
      points: this.points,
      contact: this.contact,
      note: this.note,
      history: this.history,
    };
  }
}
