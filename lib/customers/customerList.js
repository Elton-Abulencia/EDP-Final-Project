import { Customer } from "./customer.js";

export class CustomerList {
  constructor(localStorePropName = "customers") {
    this._localStorePropName = localStorePropName;
    this._customers = [];
    this._load();
  }
  getFromCode(code) {
    const customer = this._customers.find((cus) => cus.code === code);
    return customer || null;
  }
  addNewCustomer(code, name) {
    if (this._customers.findIndex((c) => c.code === code) !== -1) {
      return false;
    }
    const newUser = new Customer({ code, name, points: 0 }, this);
    this._customers.push(newUser);
    this._save();
    return true;
  }

  _load() {
    const rawData = localStorage.getItem(this._localStorePropName);
    const customers = rawData ? JSON.parse(rawData) : [];
    this._customers = customers.map(
      (c) =>
        new Customer(
          {
            code: c.code || "",
            name: c.name || "",
            points: c.points || 0,
          },
          this,
        ),
    );
  }
  _save() {
    const data = this._customers.map((customer) => customer._dataToStore);
    localStorage.setItem(this._localStorePropName, JSON.stringify(data));
  }
}

// const customers = new CustomerList();
// const user1 = customers.getFromCode("574832");
// if (!user1) return showError("user not found");

//user1.code
//user1.name
//user1.points
//user1.updatePoints(5) or ((point) => point + 5)
//user1.addHistory(title, desc)
