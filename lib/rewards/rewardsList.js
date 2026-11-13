import { Reward } from "./reward.js";

export class RewardList {
  constructor(localStorePropName = "rewards") {
    this._localStorePropName = localStorePropName;
    this._rewards = [];
    this._nextRewardId = 0;
    this._load();
  }

  getById(rewardId) {
    return this._rewards.find((r) => r.id === rewardId) || null;
  }

  addNewReward(name, description, points) {
    const newReward = new Reward(
      { id: this._nextRewardId++, name, description, points },
      this,
    );
    this._rewards.push(newReward);
    this._save();
    return true;
  }

  updateReward(rewardId, { name, description, points }) {
    const reward = this.getById(rewardId);
    if (!reward) return false;
    reward.update({ name, description, points });
    return true;
  }

  removeReward(rewardId) {
    const index = this._rewards.findIndex((r) => r.id === rewardId);
    if (index !== -1) {
      this._rewards.splice(index, 1);
      this._save();
      return true;
    }
    return false;
  }

  get rewards() {
    return this._rewards.map((r) => r._dataToShow);
  }

  getAvailableRewards(availablePoints) {
    return this._rewards.filter((r) => r.points <= availablePoints);
  }

  calculatePointsCost(rewardIds) {
    let pointsCost = 0;
    for (const rewardId of rewardIds) {
      const reward = this._rewards.find((r) => r.id === rewardId);
      if (!reward) return false;
      pointsCost += reward.points;
    }
    return pointsCost;
  }

  _load() {
    const rawData = localStorage.getItem(this._localStorePropName);
    const rewards = rawData ? JSON.parse(rawData) : [];
    this._rewards = rewards.map(
      (r) =>
        new Reward(
          {
            id: r.id,
            name: r.name,
            description: r.description,
            points: r.points,
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
