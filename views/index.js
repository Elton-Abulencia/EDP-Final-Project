import { registerAddCustomer } from "./addCustomer.js";
import { registerAddProducts } from "./addProducts.js";
import { registerAddRewards } from "./addRewards.js";
import { registerDashboard } from "./dashboard.js";
import { registerProcessPurchase } from "./processPurchase.js";
import { registerRedeemRewards } from "./redeemRewards.js";

export function registerViews(view, lib) {
  registerDashboard(view, lib);
  registerAddCustomer(view, lib);
  registerAddProducts(view, lib);
  registerAddRewards(view, lib);
  registerProcessPurchase(view, lib);
  registerRedeemRewards(view, lib);
}
