import { CustomerList } from "./lib/customers/customerList.js";
import { ProductsList } from "./lib/products/productsList.js";
import { RewardList } from "./lib/rewards/rewardsList.js";
localStorage.clear(1);
const customers = new CustomerList();
const products = new ProductsList();
const rewards = new RewardList();

// console.log(customers._customers);
// console.log("is new user added", customers.addNewCustomer("123456", "John"));

// customers.addNewCustomer("503843", "someone");
// const user1 = customers.getFromCode("503843");

// products.addNewProduct("item 1", "item item", 5.0);

// console.log(products.products);

// const pointsEarned = products.calculatePointsEarned([0, 1, 5, 2]);

// user1.updatePoints((p) => p + 50);

// rewards.addNewReward("free milktea", "get free milktea (medium)...", 4);
// rewards.addNewReward("free milktea", "get free milktea (large)...", 7);
// rewards.addNewReward("free milktea", "get free milktea (xl)...", 15);

// const rewardsToBeRedeemed = [0, 0];
// const cost = rewards.calculatePointsCost(rewardsToBeRedeemed);
// const availableRewards = rewards.getAvailableRewards(10 - cost); // 10 - 8 = 2

// user1.updatePoints((p) => p - cost);
// 24
// console.log(customers._customers);

// console.log(user1);
// const user2 = customers.getFromCode("123457");
// console.log(user2);

// user1.updatePoints((point) => point + 5);
// console.log(user1);

// console.log(products._products);
// products.addNewProduct("item 1", "item item", 5.0);
// products.addNewProduct("item 2", "item item", 10.0);
// products.addNewProduct("item 3", "item item", 15.0);
// products.addNewProduct("item 4", "item item", 20.0);
// products.addNewProduct("item 5", "item item", 25.0);
// console.log(products._products);

// console.log(products.calculatePointsEarned([0, 2, 4]));

// console.log(rewards._rewards);
// rewards.addNewReward("reward 1", "some item", 20);
// rewards.addNewReward("reward 1", "some item", 25);
// rewards.addNewReward("reward 1", "some item", 50);
// console.log(rewards._rewards);
// console.log(rewards.calculatePointsCost([0, 1, 2]));
// console.log(rewards.getAvailableRewards(74 - rewards.calculatePointsCost([2])));
