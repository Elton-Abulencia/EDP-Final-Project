import { registerAddCustomer } from "./addCustomer.js";
import { registerManageProducts } from "./manageProducts.js";
import { registerManageRewards } from "./manageRewards.js";
import { registerCustomerProfile } from "./customerProfile.js";
import { registerDashboard } from "./dashboard.js";
import { registerFindCustomer } from "./findCustomer.js";
import { registerProcessPurchase } from "./processPurchase.js";
import { registerRedeemRewards } from "./redeemRewards.js";

export function registerViews(view, lib) {
  registerDashboard(view, lib);
  registerAddCustomer(view, lib);
  registerManageProducts(view, lib);
  registerManageRewards(view, lib);
  registerProcessPurchase(view, lib);
  registerRedeemRewards(view, lib);
  registerCustomerProfile(view, lib);
  registerFindCustomer(view, lib);
}
