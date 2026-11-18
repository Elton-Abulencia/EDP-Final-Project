import {
  validateContact,
  validateCustomerCode,
  validateCustomerName,
} from "../lib/helpers/inputValidations.js";

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

    function checkName() {
      const { isValid, error } = validateCustomerName(nameInput.value);
      nameErr.textContent = error;
      return isValid;
    }

    function checkContact() {
      const { isValid, error } = validateContact(contactInput.value);
      contactErr.textContent = error;
      return isValid;
    }

    function checkCode() {
      const { isValid, error } = validateCustomerCode(codeInput.value);
      if (!isValid) {
        codeErr.textContent = error;
        return false;
      }
      if (customers.getFromCode(codeInput.value.trim())) {
        codeErr.textContent = "This code already exists. Generate a new one.";
        return false;
      }
      codeErr.textContent = "";
      return true;
    }

    function onGenerateCode() {
      successMsg.textContent = "";
      codeInput.value = customers.generateNewCode();
      checkCode();
    }

    function onSubmit(e) {
      e.preventDefault();
      successMsg.textContent = "";

      const isNameValid = checkName();
      const isContactValid = checkContact();
      const isCodeValid = checkCode();
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

    nameInput.addEventListener("blur", checkName);
    contactInput.addEventListener("blur", checkContact);
    codeInput.addEventListener("blur", checkCode);

    nameInput.addEventListener("input", () => {
      if (nameErr.textContent) checkName();
    });
    contactInput.addEventListener("input", () => {
      if (contactErr.textContent) checkContact();
    });
    codeInput.addEventListener("input", () => {
      if (codeErr.textContent) checkCode();
    });

    generateCodeBtn.addEventListener("click", onGenerateCode);
    addCustomerForm.addEventListener("submit", onSubmit);
  });
}