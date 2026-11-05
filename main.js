import { CustomerList } from "./lib/customers/customerList.js";
import { ProductsList } from "./lib/products/productsList.js";
import { RewardList } from "./lib/rewards/rewardsList.js";
import { View } from "./lib/view/view.js";
localStorage.clear(1);
const customers = new CustomerList();
const products = new ProductsList();
const rewards = new RewardList();
const view = new View();
