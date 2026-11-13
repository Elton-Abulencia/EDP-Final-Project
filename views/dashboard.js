export function registerDashboard(view) {
  view.registerView("dashboard", "dashboard", (elem, data) => {
    elem
      .querySelector("#showAddCustomerButton")
      .addEventListener("click", () => view.goto("addCustomer"));
    elem
      .querySelector("#showPurchaseProcessButton")
      .addEventListener("click", () => view.goto("processPurchase"));
    elem
      .querySelector("#showRedeemButton")
      .addEventListener("click", () => view.goto("redeemRewards"));
    elem
      .querySelector("#findCustomer")
      .addEventListener("click", () => view.goto("findCustomer"));
  });
}
