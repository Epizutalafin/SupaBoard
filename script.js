let data;
let currentCategoryKey;

/* =========================
   DOM
========================= */

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

const faqBtn = document.getElementById("faqBtn");
const faqModal = document.getElementById("faqModal");
const faqClose = document.getElementById("faqClose");
const faqText = document.getElementById("faqText");

/* =========================
   Init
========================= */

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

/* =========================
   Storage
========================= */

function storageKey(categoryKey) {
  return `supa_quests_${data.season}_${categoryKey}`;
}

function getChecked(categoryKey) {
  const saved = localStorage.getItem(storageKey(categoryKey));
  return saved ? JSON.parse(saved) : [];
}

function saveChecked(categoryKey, checked) {
  localStorage.setItem(
    storageKey(categoryKey),
    JSON.stringify(checked)
  );
}

/* =========================
   Tabs
========================= */

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

/* =========================
   Category
========================= */

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

      if (checkbox.checked) {
        if (!updated.includes(index)) {
          updated.push(index);
        }
      } else {
        const position = updated.indexOf(index);

        if (position !== -1) {
          updated.splice(position, 1);
        }
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

/* =========================
   Progress
========================= */

function renderProgress() {
  const category = data.categories[currentCategoryKey];
  const checkedCount = getChecked(currentCategoryKey).length;
  const total = category.tasks.length;

  const percent = total
    ? (checkedCount / total) * 100
    : 0;

  count.textContent = `${checkedCount} / ${total}`;
  progressFill.style.width = `${percent}%`;
}

/* =========================
   Rewards
========================= */

function renderRewards() {
  const category = data.categories[currentCategoryKey];
  const checkedCount = getChecked(currentCategoryKey).length;

  rewards.innerHTML = "";

  Object.entries(category.rewards).forEach(([threshold, reward]) => {
    const button = document.createElement("button");

    button.className = "reward";
    button.title = `${threshold} défis`;

    if (reward.icon) {
      const icon = document.createElement("img");

      icon.src = reward.icon;
      icon.alt = reward.emoji || "Récompense";

      button.appendChild(icon);
    } else {
      button.textContent = reward.emoji;
    }

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
  downloadReward.download =
    imagePath.split("/").pop();

  modal.classList.remove("hidden");
}

/* =========================
   FAQ
========================= */

function openFaq() {
  fetch("faq.html")
    .then(response => response.text())
    .then(text => {
      faqText.innerHTML = text;
      faqModal.classList.remove("hidden");
    });
}

/* =========================
   Events
========================= */

faqBtn.addEventListener("click", openFaq);

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

modal.addEventListener("click", event => {
  if (event.target === modal) {
    modal.classList.add("hidden");
  }
});

faqClose.addEventListener("click", () => {
  faqModal.classList.add("hidden");
});

faqModal.addEventListener("click", event => {
  if (event.target === faqModal) {
    faqModal.classList.add("hidden");
  }
  });

   const OATH_VERSION = "v1";

window.addEventListener("DOMContentLoaded", () => {

  const overlay = document.getElementById("quest-oath-overlay");
  const button = document.getElementById("accept-oath");

  if (!overlay || !button) return;

  const hasAccepted =
    localStorage.getItem("supaquest_oath");

  if (hasAccepted !== OATH_VERSION) {
    overlay.classList.remove("hidden");
  }

  button.addEventListener("click", () => {

    localStorage.setItem(
      "supaquest_oath",
      OATH_VERSION
    );

    overlay.classList.add("hidden");
  });

});
