export function registerProcessPurchase(view, { customers, products }) {
  view.registerView("processPurchase", "processPurchase", (elem, data) => {
    const codeInput = elem.querySelector("#code");
    const findCustomerButton = elem.querySelector("#findCustomer");
    const findErrorDisplay = elem.querySelector("#findError");
    const displayCustomer = elem.querySelector("#displayCustomer");
    const customerNameDisplay = elem.querySelector("#customerName");
    const customerPointsDisplay = elem.querySelector("#customerPoints");
    const purchaseWorkflow = elem.querySelector("#purchaseWorkflow");
    const productListContainer = elem.querySelector("#productList");
    const addedProductsContainer = elem.querySelector("#addedProducts");
    const productEntryTemplate = elem.querySelector("#productEntry");
    const addedProductEntryTemplate = elem.querySelector("#addedProductEntry");
    const prevProductPageBtn = elem.querySelector("#prevProductPageBtn");
    const nextProductPageBtn = elem.querySelector("#nextProductPageBtn");
    const productPageIndicator = elem.querySelector("#productPageIndicator");
    const confirmTransactionButton = elem.querySelector("#confirmTransaction");

    const allProducts = products.products;
    const ITEMS_PER_PAGE = 5;
    let currentPage = 1;

    let customer = null;
    const cart = new Map();

    function updateButtonState() {
      const hasCustomer = customer !== null;
      const hasItems = cart.size > 0;
      confirmTransactionButton.disabled = !(hasCustomer && hasItems);
    }

    function renderProductCatalog() {
      const totalPages = Math.max(
        1,
        Math.ceil(allProducts.length / ITEMS_PER_PAGE),
      );
      if (currentPage > totalPages) currentPage = totalPages;

      productListContainer.innerHTML = "";

      if (allProducts.length === 0) {
        const emptyLi = document.createElement("li");
        emptyLi.textContent = "No products available.";
        productListContainer.appendChild(emptyLi);
        productPageIndicator.textContent = "Page 0 of 0";
        prevProductPageBtn.disabled = true;
        nextProductPageBtn.disabled = true;
        return;
      }

      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const pageItems = allProducts.slice(start, start + ITEMS_PER_PAGE);

      pageItems.forEach((p) => {
        const clone = productEntryTemplate.content.cloneNode(true);
        const item = clone.querySelector(".product-item");
        item.dataset.productId = p.id;
        item.querySelector(".productName").textContent = p.name;
        item.querySelector(".points").textContent = p.points;
        productListContainer.appendChild(clone);
      });

      productPageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
      prevProductPageBtn.disabled = currentPage <= 1;
      nextProductPageBtn.disabled = currentPage >= totalPages;
    }

    function resetCustomerDisplay() {
      customerNameDisplay.textContent = "";
      customerPointsDisplay.textContent = "";
      displayCustomer.style.display = "none";
    }

    function renderCart() {
      addedProductsContainer.innerHTML = "";

      if (cart.size === 0) {
        const emptyLi = document.createElement("li");
        emptyLi.textContent = "No products added yet.";
        addedProductsContainer.appendChild(emptyLi);
        updateButtonState();
        return;
      }

      for (const [productId, item] of cart.entries()) {
        const clone = addedProductEntryTemplate.content.cloneNode(true);
        const li = clone.querySelector(".added-product-item");
        li.dataset.productId = productId;
        li.querySelector(".productName").textContent = item.product.name;
        li.querySelector(".points").textContent =
          item.product.points * item.quantity;
        li.querySelector(".quantity").textContent = item.quantity;
        addedProductsContainer.appendChild(clone);
      }
      updateButtonState();
    }

    codeInput.addEventListener("input", () => {
      if (customer) {
        customer = null;
        resetCustomerDisplay();
        findErrorDisplay.textContent = "";
        cart.clear();
        renderCart();
        purchaseWorkflow.style.display = "none";
        updateButtonState();
      }
    });

    function onFindCustomer() {
      const code = codeInput.value.trim();
      if (!code) {
        findErrorDisplay.textContent = "Please enter a customer code.";
        customer = null;
        resetCustomerDisplay();
        purchaseWorkflow.style.display = "none";
        updateButtonState();
        return;
      }

      customer = customers.getFromCode(code);
      if (!customer) {
        findErrorDisplay.textContent = "User not found!";
        resetCustomerDisplay();
        purchaseWorkflow.style.display = "none";
        customer = null;
        updateButtonState();
        return;
      }

      findErrorDisplay.textContent = "";
      customerNameDisplay.textContent = customer.name;
      customerPointsDisplay.textContent = customer.points;
      displayCustomer.style.display = "block";

      currentPage = 1;
      renderProductCatalog();
      purchaseWorkflow.style.display = "block";
      renderCart();
    }

    function onAddProduct(e) {
      if (e.target.classList.contains("addProduct")) {
        const productId = Number(
          e.target.closest(".product-item").dataset.productId,
        );
        const p = allProducts.find((prod) => prod.id === productId);
        if (!p) return;

        if (cart.has(productId)) {
          cart.get(productId).quantity += 1;
        } else {
          cart.set(productId, { product: p, quantity: 1 });
        }
        renderCart();
      }
    }

    function onModifyCart(e) {
      const li = e.target.closest(".added-product-item");
      if (!li) return;
      const productId = Number(li.dataset.productId);
      const cartItem = cart.get(productId);
      if (!cartItem) return;

      if (e.target.classList.contains("increaseProduct")) {
        cartItem.quantity += 1;
      } else if (e.target.classList.contains("decreaseProduct")) {
        cartItem.quantity -= 1;
        if (cartItem.quantity <= 0) {
          cart.delete(productId);
        }
      } else if (e.target.classList.contains("removeProduct")) {
        cart.delete(productId);
      }
      renderCart();
    }

    function confirmTransaction() {
      if (!customer || cart.size === 0) return;

      const productIds = [];
      const itemSummaries = [];

      for (const [productId, item] of cart.entries()) {
        itemSummaries.push(`${item.product.name} (x${item.quantity})`);
        for (let i = 0; i < item.quantity; i++) {
          productIds.push(productId);
        }
      }

      const totalPointsEarned = products.calculatePointsEarned(productIds);
      if (totalPointsEarned === false) {
        alert("Error calculating points.");
        return;
      }

      customer.updatePoints((p) => p + totalPointsEarned);
      customer.addHistory(
        "Purchase",
        `Earned ${totalPointsEarned} pts — ${itemSummaries.join(", ")}`,
      );

      alert(
        `Transaction confirmed! Added ${totalPointsEarned} points to ${customer.name}.`,
      );

      cart.clear();
      renderCart();
      codeInput.value = "";
      resetCustomerDisplay();
      purchaseWorkflow.style.display = "none";
      customer = null;
      updateButtonState();
    }

    prevProductPageBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderProductCatalog();
      }
    });

    nextProductPageBtn.addEventListener("click", () => {
      currentPage++;
      renderProductCatalog();
    });

    findCustomerButton.addEventListener("click", onFindCustomer);
    productListContainer.addEventListener("click", onAddProduct);
    addedProductsContainer.addEventListener("click", onModifyCart);
    confirmTransactionButton.addEventListener("click", confirmTransaction);

    renderProductCatalog();

    if (data && data.code) {
      codeInput.value = data.code;
      onFindCustomer();
    }
  });
}
