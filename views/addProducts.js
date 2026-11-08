export function registerAddProducts(view, { products }) {
  view.registerView("addProducts", "addProducts", (elem, data) => {
    const form = elem.querySelector("#addProductForm");
    const nameInput = elem.querySelector("#productName");
    const descInput = elem.querySelector("#description");
    const pointsInput = elem.querySelector("#points");
    const nameErr = elem.querySelector("#nameErr");
    const descErr = elem.querySelector("#descErr");
    const pointsErr = elem.querySelector("#pointsErr");
    const successMsg = elem.querySelector("#successMsg");

    function clearMessages() {
      nameErr.textContent = "";
      descErr.textContent = "";
      pointsErr.textContent = "";
      successMsg.textContent = "";
    }

    function onSubmit(e) {
      e.preventDefault();
      clearMessages();
      const name = nameInput.value.trim();
      const desc = descInput.value.trim();
      const pointsVal = pointsInput.value.trim();
      let isValid = true;

      if (!name) {
        nameErr.textContent = "Product name is required.";
        isValid = false;
      }
      if (!desc) {
        descErr.textContent = "Description is required.";
        isValid = false;
      }
      if (pointsVal === "" || Number(pointsVal) < 0) {
        pointsErr.textContent = "Points must be a valid non-negative number.";
        isValid = false;
      }
      if (!isValid) return;

      products.addNewProduct(name, desc, Number(pointsVal));
      successMsg.textContent = `Product "${name}" successfully added!`;
      form.reset();
    }
    nameInput.addEventListener("input", () => (nameErr.textContent = ""));
    descInput.addEventListener("input", () => (descErr.textContent = ""));
    pointsInput.addEventListener("input", () => (pointsErr.textContent = ""));
    form.addEventListener("submit", onSubmit);
  });
}
