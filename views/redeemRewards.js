export function registerRedeemRewards(view, { customers, rewards }) {
  view.registerView("redeemRewards", "redeemRewards", (elem, data) => {
    const codeInput = elem.querySelector("#code");
    const findCustomerButton = elem.querySelector("#findCustomer");
    const findErrorDisplay = elem.querySelector("#findError");
    const displayCustomer = elem.querySelector("#displayCustomer");
    const customerNameDisplay = elem.querySelector("#customerName");
    const customerPointsDisplay = elem.querySelector("#customerPoints");
    const redeemWorkflow = elem.querySelector("#redeemWorkflow");
    const rewardListContainer = elem.querySelector("#rewardList");
    const addedRewardsContainer = elem.querySelector("#addedRewards");
    const rewardEntryTemplate = elem.querySelector("#rewardEntry");
    const addedRewardEntryTemplate = elem.querySelector("#addedRewardEntry");
    const prevRewardPageBtn = elem.querySelector("#prevRewardPageBtn");
    const nextRewardPageBtn = elem.querySelector("#nextRewardPageBtn");
    const rewardPageIndicator = elem.querySelector("#rewardPageIndicator");
    const confirmRedemptionButton = elem.querySelector("#confirmRedemption");

    const ITEMS_PER_PAGE = 5;
    let currentPage = 1;

    let customer = null;
    const cart = new Map();

    function updateButtonState() {
      const hasCustomer = customer !== null;
      const hasItems = cart.size > 0;
      confirmRedemptionButton.disabled = !(hasCustomer && hasItems);
    }

    function renderRewardCatalog() {
      rewardListContainer.innerHTML = "";
      if (!customer) return;

      const currentCartCost = rewards.calculatePointsCost(
        Array.from(cart.entries()).flatMap(([id, item]) =>
          Array(item.quantity).fill(id),
        ),
      );
      const remainingPoints = customer.points - currentCartCost;
      const availableRewards = rewards.getAvailableRewards(remainingPoints);

      if (availableRewards.length === 0) {
        const emptyLi = document.createElement("li");
        emptyLi.textContent = "No available rewards for current points.";
        rewardListContainer.appendChild(emptyLi);
        rewardPageIndicator.textContent = "Page 0 of 0";
        prevRewardPageBtn.disabled = true;
        nextRewardPageBtn.disabled = true;
        return;
      }

      const totalPages = Math.max(
        1,
        Math.ceil(availableRewards.length / ITEMS_PER_PAGE),
      );
      if (currentPage > totalPages) currentPage = totalPages;

      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const pageItems = availableRewards.slice(start, start + ITEMS_PER_PAGE);

      pageItems.forEach((r) => {
        const clone = rewardEntryTemplate.content.cloneNode(true);
        const item = clone.querySelector(".reward-item");
        item.dataset.rewardId = r.id;
        item.querySelector(".rewardName").textContent = r.name;
        item.querySelector(".points").textContent = r.points;
        rewardListContainer.appendChild(clone);
      });

      rewardPageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
      prevRewardPageBtn.disabled = currentPage <= 1;
      nextRewardPageBtn.disabled = currentPage >= totalPages;
    }

    function resetCustomerDisplay() {
      customerNameDisplay.textContent = "";
      customerPointsDisplay.textContent = "";
      displayCustomer.style.display = "none";
    }

    function renderCart() {
      addedRewardsContainer.innerHTML = "";

      if (cart.size === 0) {
        const emptyLi = document.createElement("li");
        emptyLi.textContent = "No rewards added yet.";
        addedRewardsContainer.appendChild(emptyLi);
        updateButtonState();
        renderRewardCatalog();
        return;
      }

      for (const [rewardId, item] of cart.entries()) {
        const clone = addedRewardEntryTemplate.content.cloneNode(true);
        const li = clone.querySelector(".added-reward-item");
        li.dataset.rewardId = rewardId;
        li.querySelector(".rewardName").textContent = item.reward.name;
        li.querySelector(".points").textContent =
          item.reward.points * item.quantity;
        li.querySelector(".quantity").textContent = item.quantity;
        addedRewardsContainer.appendChild(clone);
      }
      updateButtonState();
      renderRewardCatalog();
    }

    codeInput.addEventListener("input", () => {
      if (customer) {
        customer = null;
        resetCustomerDisplay();
        findErrorDisplay.textContent = "";
        cart.clear();
        renderCart();
        redeemWorkflow.style.display = "none";
        updateButtonState();
      }
    });

    function onFindCustomer() {
      const code = codeInput.value.trim();
      if (!code) {
        findErrorDisplay.textContent = "Please enter a customer code.";
        customer = null;
        resetCustomerDisplay();
        redeemWorkflow.style.display = "none";
        updateButtonState();
        return;
      }

      customer = customers.getFromCode(code);
      if (!customer) {
        findErrorDisplay.textContent = "User not found!";
        resetCustomerDisplay();
        redeemWorkflow.style.display = "none";
        customer = null;
        updateButtonState();
        return;
      }

      findErrorDisplay.textContent = "";
      customerNameDisplay.textContent = customer.name;
      customerPointsDisplay.textContent = customer.points;
      displayCustomer.style.display = "block";

      currentPage = 1;
      redeemWorkflow.style.display = "block";
      renderCart();
    }

    function onAddReward(e) {
      if (e.target.classList.contains("addReward")) {
        const rewardId = Number(
          e.target.closest(".reward-item").dataset.rewardId,
        );
        const allRewards = rewards.getAvailableRewards(customer.points);
        const r = allRewards.find((rew) => rew.id === rewardId);
        if (!r) return;

        const currentCartCost = rewards.calculatePointsCost(
          Array.from(cart.entries()).flatMap(([id, item]) =>
            Array(item.quantity).fill(id),
          ),
        );

        if (currentCartCost + r.points > customer.points) {
          alert("Not enough points for this reward.");
          return;
        }

        if (cart.has(rewardId)) {
          cart.get(rewardId).quantity += 1;
        } else {
          cart.set(rewardId, { reward: r, quantity: 1 });
        }
        renderCart();
      }
    }

    function onModifyCart(e) {
      const li = e.target.closest(".added-reward-item");
      if (!li) return;
      const rewardId = Number(li.dataset.rewardId);
      const cartItem = cart.get(rewardId);
      if (!cartItem) return;

      if (e.target.classList.contains("increaseReward")) {
        const currentCartCost = rewards.calculatePointsCost(
          Array.from(cart.entries()).flatMap(([id, item]) =>
            Array(id === rewardId ? item.quantity + 1 : item.quantity).fill(id),
          ),
        );
        if (currentCartCost > customer.points) {
          alert("Not enough points to increase quantity.");
          return;
        }
        cartItem.quantity += 1;
      } else if (e.target.classList.contains("decreaseReward")) {
        cartItem.quantity -= 1;
        if (cartItem.quantity <= 0) {
          cart.delete(rewardId);
        }
      } else if (e.target.classList.contains("removeReward")) {
        cart.delete(rewardId);
      }
      renderCart();
    }

    function confirmRedemption() {
      if (!customer || cart.size === 0) return;

      const rewardIds = [];
      const itemSummaries = [];

      for (const [rewardId, item] of cart.entries()) {
        itemSummaries.push(`${item.reward.name} (x${item.quantity})`);
        for (let i = 0; i < item.quantity; i++) {
          rewardIds.push(rewardId);
        }
      }

      const totalPointsCost = rewards.calculatePointsCost(rewardIds);
      if (totalPointsCost === false) {
        alert("Error calculating points cost.");
        return;
      }

      if (totalPointsCost > customer.points) {
        alert("Customer does not have enough points.");
        return;
      }

      customer.updatePoints((p) => p - totalPointsCost);
      customer.addHistory(
        "Reward Redeemed",
        `Spent ${totalPointsCost} pts — ${itemSummaries.join(", ")}`,
      );

      alert(
        `Redemption confirmed! Deducted ${totalPointsCost} points from ${customer.name}.`,
      );

      cart.clear();
      customerPointsDisplay.textContent = customer.points;
      renderCart();
      codeInput.value = "";
      resetCustomerDisplay();
      redeemWorkflow.style.display = "none";
      customer = null;
      updateButtonState();
    }

    prevRewardPageBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderRewardCatalog();
      }
    });

    nextRewardPageBtn.addEventListener("click", () => {
      currentPage++;
      renderRewardCatalog();
    });

    findCustomerButton.addEventListener("click", onFindCustomer);
    rewardListContainer.addEventListener("click", onAddReward);
    addedRewardsContainer.addEventListener("click", onModifyCart);
    confirmRedemptionButton.addEventListener("click", confirmRedemption);

    if (data && data.code) {
      codeInput.value = data.code;
      onFindCustomer();
    }
  });
}
