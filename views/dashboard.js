export function registerDashboard(view) {
  view.registerView("dashboard", "dashboard", (elem, data) => {
    const addCustomerButton = elem.querySelector("#showAddCustomerButton");
    addCustomerButton.addEventListener("click", () => view.goto("addCustomer"));
  });
}
