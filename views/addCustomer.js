export function registerAddCustomer(view, { customers }) {
  view.registerView("addCustomer", "addCustomer", (elem, data) => {
    const addCustomerForm = elem.querySelector("#addCustomerForm");
    const nameInput = elem.querySelector("#name");
    const nameErr = elem.querySelector("#nameErr");
    const codeInput = elem.querySelector("#code");
    const codeErr = elem.querySelector("#codeErr");
    const generateCodeBtn = elem.querySelector("#generateCode");
    const successMsg = elem.querySelector("#successMsg");

    function clearMessages() {
      nameErr.textContent = "";
      codeErr.textContent = "";
      successMsg.textContent = "";
    }
    function onGenerateCode() {
      clearMessages();
      const code = customers.generateNewCode();
      codeInput.value = code;
    }

    function onSubmit(e) {
      e.preventDefault();
      clearMessages();
      const name = nameInput.value.trim();
      const code = codeInput.value.trim();
      let isValid = true;

      if (name.length < 3) {
        nameErr.textContent = "Name must be at least 3 characters long.";
        isValid = false;
      }
      if (code.length !== 6) {
        codeErr.textContent = "Code must be exactly 6 characters long.";
        isValid = false;
      } else if (customers.getFromCode(code)) {
        codeErr.textContent = "This code already exists. Generate a new one.";
        isValid = false;
      }
      if (!isValid) return;

      const success = customers.addNewCustomer(code, name);
      if (!success) {
        codeErr.textContent =
          "Failed to add customer. Code might already exist.";
        return;
      }
      successMsg.textContent = `Customer "${name}" successfully added!`;
      addCustomerForm.reset();
    }

    generateCodeBtn.addEventListener("click", onGenerateCode);
    addCustomerForm.addEventListener("submit", onSubmit);
  });
}