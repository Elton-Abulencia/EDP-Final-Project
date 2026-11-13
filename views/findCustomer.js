export function registerFindCustomer(view, { customers }) {
  view.registerView("findCustomer", "findCustomer", (elem, data) => {
    const searchQueryInput = elem.querySelector("#searchQuery");
    const searchBtn = elem.querySelector("#searchBtn");
    const resultCount = elem.querySelector("#resultCount");
    const searchResults = elem.querySelector("#searchResults");
    const resultEntryTemplate = elem.querySelector("#customerResultEntry");

    function renderResults(matches) {
      searchResults.innerHTML = "";

      if (matches.length === 0) {
        const emptyLi = document.createElement("li");
        emptyLi.textContent = "No matching customers found.";
        searchResults.appendChild(emptyLi);
        return;
      }

      matches.forEach((customer) => {
        const clone = resultEntryTemplate.content.cloneNode(true);
        const li = clone.querySelector(".customer-result-item");
        li.dataset.code = customer.code;
        li.querySelector(".resultName").textContent = customer.name;
        li.querySelector(".resultCode").textContent = customer.code;
        li.querySelector(".resultContact").textContent =
          customer.contact || "N/A";
        li.querySelector(".resultPoints").textContent = customer.points;
        searchResults.appendChild(clone);
      });
    }

    function onSearch() {
      const query = searchQueryInput.value.trim();
      searchResults.innerHTML = "";

      if (!query) {
        resultCount.textContent = "Enter a code, name, or contact to search.";
        return;
      }

      const matches = customers.search(query, 10);
      resultCount.textContent =
        matches.length === 10
          ? "Showing top 10 matching results:"
          : `Found ${matches.length} matching customer(s):`;

      renderResults(matches);
    }

    function onResultClick(e) {
      if (e.target.classList.contains("viewProfileBtn")) {
        const li = e.target.closest(".customer-result-item");
        if (!li) return;
        view.goto("customerProfile", { code: li.dataset.code });
      }
    }

    searchQueryInput.addEventListener("input", onSearch);
    searchBtn.addEventListener("click", onSearch);
    searchResults.addEventListener("click", onResultClick);
  });
}
