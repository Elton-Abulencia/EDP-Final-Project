import { Reward } from "./reward.js";

export class RewardList {
  constructor(localStorePropName = "rewards") {
    this._localStorePropName = localStorePropName;
    this._rewards = [];
    this._nextRewardId = 0;
    this._load();
  }
  addNewReward(name, description, points) {
    const newProduct = new Reward(
      { id: this._nextRewardId++, name, description, points },
      this,
    );
    this._rewards.push(newProduct);
    this._save();
    return true;
  }

  removeReward(productId) {
    const index = this._products.findIndex((p) => p.id === productId);
    if (index !== -1) {
      this._products.splice(index, 1);
      return true;
    }
    return false;
  }

  getAvailableRewards(availablePoints) {
    const rewards = this._rewards.filter((r) => r.points <= availablePoints);
    return rewards;
  }

  calculatePointsCost(rewardIds) {
    let pointsCost = 0;
    for (const rewardId of rewardIds) {
      const reward = this._rewards.find((p) => p.id === rewardId);
      if (!reward) return false;
      pointsCost += reward.points;
    }
    return pointsCost;
  }

  _load() {
    const rawData = localStorage.getItem(this._localStorePropName);
    const rewards = rawData ? JSON.parse(rawData) : [];
    this._rewards = rewards.map(
      (p) =>
        new Reward(
          {
            id: p.id,
            name: p.name,
            description: p.description,
            points: p.points,
          },
          this,
        ),
    );
    this._nextRewardId = this._rewards.reduce(
      (max, curr) => (curr.id >= max ? curr.id + 1 : max),
      0,
    );
  }
  _save() {
    const data = this._rewards.map((rewards) => rewards._dataToStore);
    localStorage.setItem(this._localStorePropName, JSON.stringify(data));
  }
}
