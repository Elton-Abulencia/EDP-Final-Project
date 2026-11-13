export function registerManageProducts(view, { products }) {
  view.registerView("manageProducts", "manageProducts", (elem, data) => {
    const formHeading = elem.querySelector("#formHeading");
    const form = elem.querySelector("#productForm");
    const nameInput = elem.querySelector("#productName");
    const descInput = elem.querySelector("#description");
    const pointsInput = elem.querySelector("#points");
    const nameErr = elem.querySelector("#nameErr");
    const descErr = elem.querySelector("#descErr");
    const pointsErr = elem.querySelector("#pointsErr");
    const submitBtn = elem.querySelector("#submitBtn");
    const cancelEditBtn = elem.querySelector("#cancelEditBtn");
    const successMsg = elem.querySelector("#successMsg");

    const productListEl = elem.querySelector("#productList");
    const entryTemplate = elem.querySelector("#manageProductEntry");
    const prevPageBtn = elem.querySelector("#prevPageBtn");
    const nextPageBtn = elem.querySelector("#nextPageBtn");
    const pageIndicator = elem.querySelector("#pageIndicator");

    const ITEMS_PER_PAGE = 5;
    let currentPage = 1;
    let editingProductId = null;

    function clearErrors() {
      nameErr.textContent = "";
      descErr.textContent = "";
      pointsErr.textContent = "";
    }

    function validateName() {
      if (!nameInput.value.trim()) {
        nameErr.textContent = "Product name is required.";
        return false;
      }
      nameErr.textContent = "";
      return true;
    }

    function validateDesc() {
      if (!descInput.value.trim()) {
        descErr.textContent = "Description is required.";
        return false;
      }
      descErr.textContent = "";
      return true;
    }

    function validatePoints() {
      const val = pointsInput.value.trim();
      if (val === "" || Number(val) < 0) {
        pointsErr.textContent = "Points must be a valid non-negative number.";
        return false;
      }
      pointsErr.textContent = "";
      return true;
    }

    function enterAddMode() {
      editingProductId = null;
      formHeading.textContent = "Add New Product";
      submitBtn.textContent = "Add Product";
      cancelEditBtn.style.display = "none";
      form.reset();
      clearErrors();
    }

    function enterEditMode(product) {
      editingProductId = product.id;
      formHeading.textContent = `Edit Product: ${product.name}`;
      submitBtn.textContent = "Save Changes";
      cancelEditBtn.style.display = "inline-block";
      successMsg.textContent = "";
      clearErrors();

      nameInput.value = product.name;
      descInput.value = product.description;
      pointsInput.value = product.points;
      nameInput.focus();
    }

    function renderList() {
      const allProducts = products.products;
      const totalPages = Math.max(
        1,
        Math.ceil(allProducts.length / ITEMS_PER_PAGE),
      );

      if (currentPage > totalPages) currentPage = totalPages;

      productListEl.innerHTML = "";

      if (allProducts.length === 0) {
        const emptyLi = document.createElement("li");
        emptyLi.textContent = "No products available yet.";
        productListEl.appendChild(emptyLi);
        pageIndicator.textContent = "Page 0 of 0";
        prevPageBtn.disabled = true;
        nextPageBtn.disabled = true;
        return;
      }

      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const pageItems = allProducts.slice(start, start + ITEMS_PER_PAGE);

      pageItems.forEach((p) => {
        const clone = entryTemplate.content.cloneNode(true);
        const li = clone.querySelector(".manage-product-item");
        li.dataset.productId = p.id;
        li.querySelector(".itemName").textContent = p.name;
        li.querySelector(".itemPoints").textContent = p.points;
        li.querySelector(".itemDesc").textContent = p.description;
        productListEl.appendChild(clone);
      });

      pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
      prevPageBtn.disabled = currentPage <= 1;
      nextPageBtn.disabled = currentPage >= totalPages;
    }

    function onSubmit(e) {
      e.preventDefault();
      successMsg.textContent = "";

      const isValid = validateName() & validateDesc() & validatePoints();
      if (!isValid) return;

      const name = nameInput.value.trim();
      const description = descInput.value.trim();
      const points = Number(pointsInput.value.trim());

      if (editingProductId !== null) {
        products.updateProduct(editingProductId, { name, description, points });
        successMsg.textContent = `Product "${name}" updated!`;
        enterAddMode();
      } else {
        products.addNewProduct(name, description, points);
        successMsg.textContent = `Product "${name}" added!`;
        form.reset();
        clearErrors();
        currentPage = Math.ceil(products.products.length / ITEMS_PER_PAGE);
      }

      renderList();
    }

    function onListClick(e) {
      const li = e.target.closest(".manage-product-item");
      if (!li) return;
      const productId = Number(li.dataset.productId);

      if (e.target.classList.contains("editBtn")) {
        const product = products.getById(productId);
        if (product) enterEditMode(product);
      } else if (e.target.classList.contains("deleteBtn")) {
        const product = products.getById(productId);
        if (!product) return;
        if (confirm(`Delete product "${product.name}"?`)) {
          products.removeProduct(productId);
          if (editingProductId === productId) enterAddMode();
          renderList();
        }
      }
    }

    nameInput.addEventListener("blur", validateName);
    descInput.addEventListener("blur", validateDesc);
    pointsInput.addEventListener("blur", validatePoints);

    nameInput.addEventListener("input", () => {
      if (nameErr.textContent) validateName();
    });
    descInput.addEventListener("input", () => {
      if (descErr.textContent) validateDesc();
    });
    pointsInput.addEventListener("input", () => {
      if (pointsErr.textContent) validatePoints();
    });

    form.addEventListener("submit", onSubmit);
    cancelEditBtn.addEventListener("click", () => {
      successMsg.textContent = "";
      enterAddMode();
    });

    productListEl.addEventListener("click", onListClick);
    prevPageBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderList();
      }
    });
    nextPageBtn.addEventListener("click", () => {
      currentPage++;
      renderList();
    });

    renderList();
  });
}
