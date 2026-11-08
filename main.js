import { CustomerList } from "./lib/customers/customerList.js";
import { ProductsList } from "./lib/products/productsList.js";
import { RewardList } from "./lib/rewards/rewardsList.js";
import { sidebarInit } from "./lib/view/sidebar.js";
import { View } from "./lib/view/view.js";
import { registerViews } from "./views/index.js";
// localStorage.clear(1);
const customers = new CustomerList();
const products = new ProductsList();
const rewards = new RewardList();
const view = new View();
sidebarInit(view);

registerViews(view, {
  customers,
  products,
  rewards,
});

// console.log(view._views);
view.goto("dashboard");
// view.goto("addCustomer");
// view.goto("addProducts");
// view.goto("addRewards");
// view.goto("processPurchase");

// customers.addNewCustomer("234353", "asds");

// customers.generateNewCode();
