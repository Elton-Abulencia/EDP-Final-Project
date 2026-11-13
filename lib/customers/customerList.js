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

  search(query, limit = 10) {
    const term = query.trim().toLowerCase();
    if (!term) return [];

    const matches = [];
    for (const customer of this._customers) {
      const codeMatch = customer.code.toLowerCase().includes(term);
      const nameMatch = customer.name.toLowerCase().includes(term);
      const contactMatch = customer.contact.toLowerCase().includes(term);

      if (codeMatch || nameMatch || contactMatch) {
        matches.push(customer);
        if (matches.length >= limit) break;
      }
    }
    return matches;
  }

  addNewCustomer(code, name, contact = "", note = "") {
    if (this._customers.findIndex((c) => c.code === code) !== -1) {
      return false;
    }
    const newUser = new Customer(
      { code, name, points: 0, contact, note, history: [] },
      this,
    );
    newUser.addHistory("Account Created", `Registered customer ${name}`);
    this._customers.push(newUser);
    this._save();
    return true;
  }

  generateNewCode() {
    const chars = "0123456789";
    const codeLength = 6;

    const usedCodes = this._customers.map((c) => c.code);
    while (true) {
      let code = "";
      for (let i = 0; i < codeLength; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
      }
      if (usedCodes.includes(code)) continue;

      return code;
    }
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
            contact: c.contact || "",
            note: c.note || "",
            history: c.history || [],
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
