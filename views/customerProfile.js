import { getContactError } from "../lib/helpers/inputValidations.js";

export function registerCustomerProfile(view, { customers }) {
  view.registerView("customerProfile", "customerProfile", (elem, data) => {
    const codeInput = elem.querySelector("#code");
    const findCustomerBtn = elem.querySelector("#findCustomer");
    const findError = elem.querySelector("#findError");
    const profileContent = elem.querySelector("#profileContent");

    const profileName = elem.querySelector("#profileName");
    const profileCode = elem.querySelector("#profileCode");
    const profilePoints = elem.querySelector("#profilePoints");
    const profilePurchaseBtn = elem.querySelector("#profilePurchaseBtn");
    const profileRedeemBtn = elem.querySelector("#profileRedeemBtn");

    const profileDetailsForm = elem.querySelector("#profileDetailsForm");
    const profileContact = elem.querySelector("#profileContact");
    const contactErr = elem.querySelector("#contactErr");
    const profileNote = elem.querySelector("#profileNote");
    const saveMsg = elem.querySelector("#saveMsg");

    const historyList = elem.querySelector("#historyList");
    const historyEntryTemplate = elem.querySelector("#historyEntry");
    const prevHistoryPageBtn = elem.querySelector("#prevHistoryPageBtn");
    const nextHistoryPageBtn = elem.querySelector("#nextHistoryPageBtn");
    const historyPageIndicator = elem.querySelector("#historyPageIndicator");

    const ITEMS_PER_PAGE = 5;
    let currentHistoryPage = 1;
    let currentCustomer = null;

    function validateContact() {
      const error = getContactError(profileContact.value);
      contactErr.textContent = error;
      return error === "";
    }

    function renderHistory() {
      const history = currentCustomer?.history || [];
      historyList.innerHTML = "";

      if (history.length === 0) {
        const emptyLi = document.createElement("li");
        emptyLi.textContent = "No history logs recorded yet.";
        historyList.appendChild(emptyLi);
        historyPageIndicator.textContent = "Page 0 of 0";
        prevHistoryPageBtn.disabled = true;
        nextHistoryPageBtn.disabled = true;
        return;
      }

      const totalPages = Math.max(
        1,
        Math.ceil(history.length / ITEMS_PER_PAGE),
      );
      if (currentHistoryPage > totalPages) currentHistoryPage = totalPages;

      const start = (currentHistoryPage - 1) * ITEMS_PER_PAGE;
      const pageItems = history.slice(start, start + ITEMS_PER_PAGE);

      pageItems.forEach((entry) => {
        const clone = historyEntryTemplate.content.cloneNode(true);
        clone.querySelector(".historyTitle").textContent = entry.title;
        clone.querySelector(".historyDesc").textContent = entry.desc;
        clone.querySelector(".historyDate").textContent = entry.date;
        historyList.appendChild(clone);
      });

      historyPageIndicator.textContent = `Page ${currentHistoryPage} of ${totalPages}`;
      prevHistoryPageBtn.disabled = currentHistoryPage <= 1;
      nextHistoryPageBtn.disabled = currentHistoryPage >= totalPages;
    }

    function renderProfile(customer) {
      profileName.textContent = customer.name;
      profileCode.textContent = customer.code;
      profilePoints.textContent = customer.points;
      profileContact.value = customer.contact;
      profileNote.value = customer.note;
      contactErr.textContent = "";
      saveMsg.textContent = "";
      currentHistoryPage = 1;
      renderHistory();
      profileContent.style.display = "block";
    }

    function onFindCustomer() {
      const code = codeInput.value.trim();
      saveMsg.textContent = "";

      if (!code) {
        findError.textContent = "Please enter a customer code.";
        profileContent.style.display = "none";
        currentCustomer = null;
        return;
      }

      const found = customers.getFromCode(code);
      if (!found) {
        findError.textContent = "User not found!";
        profileContent.style.display = "none";
        currentCustomer = null;
        return;
      }

      findError.textContent = "";
      currentCustomer = found;
      view.updateState({ code: found.code });
      renderProfile(currentCustomer);
    }

    function onSaveDetails(e) {
      e.preventDefault();
      saveMsg.textContent = "";
      if (!currentCustomer) return;

      if (!validateContact()) return;

      currentCustomer.updateDetails({
        contact: profileContact.value.trim(),
        note: profileNote.value.trim(),
      });
      currentCustomer.addHistory(
        "Profile Updated",
        "Updated contact or customer note",
      );
      currentHistoryPage = 1;
      renderHistory();
      saveMsg.textContent = "Details saved!";
    }

    prevHistoryPageBtn.addEventListener("click", () => {
      if (currentHistoryPage > 1) {
        currentHistoryPage--;
        renderHistory();
      }
    });

    nextHistoryPageBtn.addEventListener("click", () => {
      currentHistoryPage++;
      renderHistory();
    });

    profilePurchaseBtn.addEventListener("click", () => {
      if (!currentCustomer) return;
      view.goto("processPurchase", { code: currentCustomer.code });
    });

    profileRedeemBtn.addEventListener("click", () => {
      if (!currentCustomer) return;
      view.goto("redeemRewards", { code: currentCustomer.code });
    });

    profileContact.addEventListener("blur", validateContact);
    profileContact.addEventListener("input", () => {
      if (contactErr.textContent) validateContact();
    });

    findCustomerBtn.addEventListener("click", onFindCustomer);
    profileDetailsForm.addEventListener("submit", onSaveDetails);

    if (data && data.code) {
      codeInput.value = data.code;
      onFindCustomer();
    }
  });
}
