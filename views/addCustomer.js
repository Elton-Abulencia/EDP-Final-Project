import { getContactError } from "../lib/helpers/inputValidations.js";

export function registerAddCustomer(view, { customers }) {
  view.registerView("addCustomer", "addCustomer", (elem, data) => {
    const addCustomerForm = elem.querySelector("#addCustomerForm");
    const nameInput = elem.querySelector("#name");
    const contactInput = elem.querySelector("#contact");
    const noteInput = elem.querySelector("#note");
    const nameErr = elem.querySelector("#nameErr");
    const contactErr = elem.querySelector("#contactErr");
    const codeInput = elem.querySelector("#code");
    const codeErr = elem.querySelector("#codeErr");
    const generateCodeBtn = elem.querySelector("#generateCode");
    const successMsg = elem.querySelector("#successMsg");

    function validateName() {
      const name = nameInput.value.trim();
      if (name.length < 3) {
        nameErr.textContent = "Name must be at least 3 characters long.";
        return false;
      }
      nameErr.textContent = "";
      return true;
    }

    function validateContact() {
      const error = getContactError(contactInput.value);
      contactErr.textContent = error;
      return error === "";
    }

    function validateCode() {
      const code = codeInput.value.trim();
      if (code.length !== 6) {
        codeErr.textContent = "Code must be exactly 6 characters long.";
        return false;
      }
      if (customers.getFromCode(code)) {
        codeErr.textContent = "This code already exists. Generate a new one.";
        return false;
      }
      codeErr.textContent = "";
      return true;
    }

    function onGenerateCode() {
      successMsg.textContent = "";
      codeInput.value = customers.generateNewCode();
      validateCode();
    }

    function onSubmit(e) {
      e.preventDefault();
      successMsg.textContent = "";

      const isNameValid = validateName();
      const isContactValid = validateContact();
      const isCodeValid = validateCode();
      if (!isNameValid || !isContactValid || !isCodeValid) return;

      const name = nameInput.value.trim();
      const contact = contactInput.value.trim();
      const note = noteInput.value.trim();
      const code = codeInput.value.trim();

      const success = customers.addNewCustomer(code, name, contact, note);
      if (!success) {
        codeErr.textContent =
          "Failed to add customer. Code might already exist.";
        return;
      }

      successMsg.textContent = `Customer "${name}" successfully added!`;
      addCustomerForm.reset();
    }

    nameInput.addEventListener("blur", validateName);
    contactInput.addEventListener("blur", validateContact);
    codeInput.addEventListener("blur", validateCode);

    nameInput.addEventListener("input", () => {
      if (nameErr.textContent) validateName();
    });
    contactInput.addEventListener("input", () => {
      if (contactErr.textContent) validateContact();
    });
    codeInput.addEventListener("input", () => {
      if (codeErr.textContent) validateCode();
    });

    generateCodeBtn.addEventListener("click", onGenerateCode);
    addCustomerForm.addEventListener("submit", onSubmit);
  });
}
