export function registerManageRewards(view, { rewards }) {
  view.registerView("manageRewards", "manageRewards", (elem, data) => {
    const formHeading = elem.querySelector("#formHeading");
    const form = elem.querySelector("#rewardForm");
    const nameInput = elem.querySelector("#rewardName");
    const descInput = elem.querySelector("#description");
    const pointsInput = elem.querySelector("#points");
    const nameErr = elem.querySelector("#nameErr");
    const descErr = elem.querySelector("#descErr");
    const pointsErr = elem.querySelector("#pointsErr");
    const submitBtn = elem.querySelector("#submitBtn");
    const cancelEditBtn = elem.querySelector("#cancelEditBtn");
    const successMsg = elem.querySelector("#successMsg");

    const rewardListEl = elem.querySelector("#rewardList");
    const entryTemplate = elem.querySelector("#manageRewardEntry");
    const prevPageBtn = elem.querySelector("#prevPageBtn");
    const nextPageBtn = elem.querySelector("#nextPageBtn");
    const pageIndicator = elem.querySelector("#pageIndicator");

    const ITEMS_PER_PAGE = 5;
    let currentPage = 1;
    let editingRewardId = null;

    function clearErrors() {
      nameErr.textContent = "";
      descErr.textContent = "";
      pointsErr.textContent = "";
    }

    function validateName() {
      if (!nameInput.value.trim()) {
        nameErr.textContent = "Reward name is required.";
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
      editingRewardId = null;
      formHeading.textContent = "Add New Reward";
      submitBtn.textContent = "Add Reward";
      cancelEditBtn.style.display = "none";
      form.reset();
      clearErrors();
    }

    function enterEditMode(reward) {
      editingRewardId = reward.id;
      formHeading.textContent = `Edit Reward: ${reward.name}`;
      submitBtn.textContent = "Save Changes";
      cancelEditBtn.style.display = "inline-block";
      successMsg.textContent = "";
      clearErrors();

      nameInput.value = reward.name;
      descInput.value = reward.description;
      pointsInput.value = reward.points;
      nameInput.focus();
    }

    function renderList() {
      const allRewards = rewards.rewards;
      const totalPages = Math.max(
        1,
        Math.ceil(allRewards.length / ITEMS_PER_PAGE),
      );

      if (currentPage > totalPages) currentPage = totalPages;

      rewardListEl.innerHTML = "";

      if (allRewards.length === 0) {
        const emptyLi = document.createElement("li");
        emptyLi.textContent = "No rewards available yet.";
        rewardListEl.appendChild(emptyLi);
        pageIndicator.textContent = "Page 0 of 0";
        prevPageBtn.disabled = true;
        nextPageBtn.disabled = true;
        return;
      }

      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const pageItems = allRewards.slice(start, start + ITEMS_PER_PAGE);

      pageItems.forEach((r) => {
        const clone = entryTemplate.content.cloneNode(true);
        const li = clone.querySelector(".manage-reward-item");
        li.dataset.rewardId = r.id;
        li.querySelector(".itemName").textContent = r.name;
        li.querySelector(".itemPoints").textContent = r.points;
        li.querySelector(".itemDesc").textContent = r.description;
        rewardListEl.appendChild(clone);
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

      if (editingRewardId !== null) {
        rewards.updateReward(editingRewardId, { name, description, points });
        successMsg.textContent = `Reward "${name}" updated!`;
        enterAddMode();
      } else {
        rewards.addNewReward(name, description, points);
        successMsg.textContent = `Reward "${name}" added!`;
        form.reset();
        clearErrors();
        currentPage = Math.ceil(rewards.rewards.length / ITEMS_PER_PAGE);
      }

      renderList();
    }

    function onListClick(e) {
      const li = e.target.closest(".manage-reward-item");
      if (!li) return;
      const rewardId = Number(li.dataset.rewardId);

      if (e.target.classList.contains("editBtn")) {
        const reward = rewards.getById(rewardId);
        if (reward) enterEditMode(reward);
      } else if (e.target.classList.contains("deleteBtn")) {
        const reward = rewards.getById(rewardId);
        if (!reward) return;
        if (confirm(`Delete reward "${reward.name}"?`)) {
          rewards.removeReward(rewardId);
          if (editingRewardId === rewardId) enterAddMode();
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

    rewardListEl.addEventListener("click", onListClick);
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
