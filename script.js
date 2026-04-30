let data;
let currentCategoryKey;

const tabs = document.getElementById("tabs");
const title = document.getElementById("title");
const categoryTitle = document.getElementById("categoryTitle");
const count = document.getElementById("count");
const progressFill = document.getElementById("progressFill");
const rewards = document.getElementById("rewards");
const taskList = document.getElementById("taskList");

const modal = document.getElementById("modal");
const rewardImage = document.getElementById("rewardImage");
const downloadReward = document.getElementById("downloadReward");
const closeModal = document.getElementById("closeModal");

fetch("tasks.json?v=2026_05")
  .then(response => response.json())
  .then(json => {
    data = json;
    title.textContent = data.title;

    const keys = Object.keys(data.categories);
    currentCategoryKey = keys[0];

    renderTabs();
    renderCategory();
  });

function storageKey(categoryKey) {
  return `supa_quests_${data.season}_${categoryKey}`;
}

function getChecked(categoryKey) {
  const saved = localStorage.getItem(storageKey(categoryKey));
  return saved ? JSON.parse(saved) : [];
}

function saveChecked(categoryKey, checked) {
  localStorage.setItem(storageKey(categoryKey), JSON.stringify(checked));
}

function renderTabs() {
  tabs.innerHTML = "";

  Object.entries(data.categories).forEach(([key, category]) => {
    const button = document.createElement("button");
    button.className = "tab";
    button.textContent = category.label;

    if (key === currentCategoryKey) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      currentCategoryKey = key;
      renderTabs();
      renderCategory();
    });

    tabs.appendChild(button);
  });
}

function renderCategory() {
  const category = data.categories[currentCategoryKey];
  const checked = getChecked(currentCategoryKey);

  categoryTitle.textContent = category.label;
  taskList.innerHTML = "";

  category.tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = checked.includes(index);

    if (checkbox.checked) {
      li.classList.add("done");
    }

    checkbox.addEventListener("change", () => {
      const updated = getChecked(currentCategoryKey);

      if (checkbox.checked && !updated.includes(index)) {
        updated.push(index);
      }

      if (!checkbox.checked) {
        const position = updated.indexOf(index);
        if (position !== -1) updated.splice(position, 1);
      }

      saveChecked(currentCategoryKey, updated);
      renderCategory();
    });

    const label = document.createElement("span");
    label.textContent = task;

    li.appendChild(checkbox);
    li.appendChild(label);
    taskList.appendChild(li);
  });

  renderProgress();
  renderRewards();
}

function renderProgress() {
  const category = data.categories[currentCategoryKey];
  const checkedCount = getChecked(currentCategoryKey).length;
  const total = category.tasks.length;
  const percent = total ? (checkedCount / total) * 100 : 0;

  count.textContent = `${checkedCount} / ${total}`;
  progressFill.style.width = `${percent}%`;
}

function renderRewards() {
  const category = data.categories[currentCategoryKey];
  const checkedCount = getChecked(currentCategoryKey).length;

  rewards.innerHTML = "";

  Object.entries(category.rewards).forEach(([threshold, reward]) => {
    const button = document.createElement("button");
    button.className = "reward";
    button.textContent = reward.emoji;
    button.title = `${threshold} défis`;

    if (checkedCount >= Number(threshold)) {
      button.classList.add("unlocked");
      button.addEventListener("click", () => {
        openReward(reward.image);
      });
    }

    rewards.appendChild(button);
  });
}

function openReward(imagePath) {
  rewardImage.src = imagePath;
  downloadReward.href = imagePath;
  downloadReward.download = imagePath.split("/").pop();
  modal.classList.remove("hidden");
}

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

modal.addEventListener("click", event => {
  if (event.target === modal) {
    modal.classList.add("hidden");
  }
});
