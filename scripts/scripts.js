/* WRITE YOUR JS HERE... YOU MAY REQUIRE MORE THAN ONE JS FILE. IF SO SAVE IT SEPARATELY IN THE SCRIPTS DIRECTORY */

const body = document.body;
const coverSection = document.getElementById("cover");
const enterAppBtn = document.getElementById("enterAppBtn");
const coverHomeBtn = document.getElementById("coverHomeBtn");
const coverAboutBtn = document.getElementById("coverAboutBtn");
const appShell = document.getElementById("appShell");
const themeBtn = document.getElementById("themeBtn");
const logoBtn = document.getElementById("logoBtn");
const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll(".page-section");
const habitsContainer = document.getElementById("habitsContainer");
const addHabitBtn = document.getElementById("addHabitBtn");
const modal = document.getElementById("habitModal");
const closeModalBtn = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const habitForm = document.getElementById("habitForm");
const dueDayInputs = document.querySelectorAll(".due-day-input");
const recommendedCards = document.querySelectorAll(".recommended-card");
const categoryPreviewContent = document.getElementById("categoryPreviewContent");
const categoryCards = document.querySelectorAll(".category-card");

let habits = JSON.parse(localStorage.getItem("habits")) || [];
let editingHabitId = null;

const categories = {
exercise: { name: "Exercise", icon: "⚡", color: "#FF6B35" },
nutrition: { name: "Nutrition", icon: "🥗", color: "#4CAF50" },
study: { name: "Study", icon: "📚", color: "#9C27B0" },
wellness: { name: "Wellness", icon: "😌", color: "#FF9800" },
sleep: { name: "Sleep", icon: "🛌", color: "#3F51B5" },
water: { name: "Hydration", icon: "💧", color: "#00BCD4" },
work: { name: "Work", icon: "💼", color: "#F44336" },
cooking: { name: "Cooking", icon: "🍳", color: "#FF5722" },
reading: { name: "Reading", icon: "📖", color: "#673AB7" },
creative: { name: "Creative", icon: "🎨", color: "#E91E63" }
};

const categoryIdeas = {
exercise: {
title: "Exercise Ideas",
text: "Try a 20-minute walk, a short HIIT session, or stretching before bed."
},
nutrition: {
title: "Nutrition Ideas",
text: "Plan a simple meal prep, try a new salad, or log your veggies for the day."
},
study: {
title: "Study Ideas",
text: "Review class notes for 15 minutes or complete one practice problem set."
},
wellness: {
title: "Wellness Ideas",
text: "Take 5 minutes to meditate, journal, or practice breathing exercises."
},
sleep: {
title: "Sleep Tips",
text: "Set a consistent bedtime and avoid screens 30 minutes before sleep."
},
water: {
title: "Hydration Tips",
text: "Keep a bottle nearby and drink a glass of water with every meal."
},
work: {
title: "Work Focus",
text: "Block 25 minutes for deep work, then take a short break."
},
cooking: {
title: "Recipe Ideas",
text: "Try an easy stir-fry, sheet-pan veggies, or a one-pot pasta."
},
reading: {
title: "Reading Suggestions",
text: "Read one chapter of a book or a short article that interests you."
},
creative: {
title: "Creative Prompts",
text: "Sketch for 10 minutes, write a short paragraph, or take a creative photo."
}
};

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
body.classList.add("dark-mode");
}

themeBtn.addEventListener("click", function () {
body.classList.toggle("dark-mode");
const theme = body.classList.contains("dark-mode") ? "dark" : "light";
localStorage.setItem("theme", theme);
});

navItems.forEach(function (item) {
item.addEventListener("click", function () {
const target = item.dataset.target;
navItems.forEach(function (nav) {
nav.classList.remove("nav-active");
});
item.classList.add("nav-active");
sections.forEach(function (section) {
if (section.id === target) {
section.classList.add("active");
} else {
section.classList.remove("active");
}
});
});
});

logoBtn.addEventListener("click", function () {
appShell.classList.add("hidden");
coverSection.style.display = "flex";
coverSection.classList.add("active");
});

enterAppBtn.addEventListener("click", function () {
coverSection.classList.remove("active");
coverSection.style.display = "none";
appShell.classList.remove("hidden");
});

coverHomeBtn.addEventListener("click", function () {
enterAppBtn.click();
const homeNav = document.querySelector('.nav-item[data-target="home"]');
if (homeNav) homeNav.click();
});

coverAboutBtn.addEventListener("click", function () {
enterAppBtn.click();
const aboutNav = document.querySelector('.nav-item[data-target="about"]');
if (aboutNav) aboutNav.click();
});

recommendedCards.forEach(function (card) {
card.addEventListener("click", function () {
const habitName = card.dataset.habit;
const habitCategory = card.dataset.category;
const existingHabit = habits.find(function (h) {
return h.name === habitName;
});
if (existingHabit) {
showNotification("You already have this habit!", "info");
return;
}
const newHabit = {
id: Date.now(),
name: habitName,
category: habitCategory,
streak: 0,
completedDates: [],
dueDays: [0, 1, 2, 3, 4, 5, 6],
createdAt: new Date().toISOString()
};
habits.push(newHabit);
localStorage.setItem("habits", JSON.stringify(habits));
renderHabits();
updateProgress();
updateStats();
showNotification("Habit added successfully!", "success");
});
});

function openModal() {
modal.classList.add("active");
body.style.overflow = "hidden";
}

function closeModalFunc() {
modal.classList.remove("active");
body.style.overflow = "auto";
habitForm.reset();
dueDayInputs.forEach(function (input) {
input.checked = false;
});
editingHabitId = null;
}

addHabitBtn.addEventListener("click", function () {
editingHabitId = null;
openModal();
});

closeModalBtn.addEventListener("click", closeModalFunc);
cancelBtn.addEventListener("click", closeModalFunc);

modal.addEventListener("click", function (e) {
if (e.target === modal) {
closeModalFunc();
}
});

function startEditHabit(id) {
const habit = habits.find(function (h) {
return h.id === id;
});
if (!habit) {
return;
}
editingHabitId = id;
const habitNameInput = document.getElementById("habitName");
const habitCategorySelect = document.getElementById("habitCategory");
habitNameInput.value = habit.name;
habitCategorySelect.value = habit.category;
dueDayInputs.forEach(function (input) {
input.checked = false;
});
(habit.dueDays || []).forEach(function (day) {
dueDayInputs.forEach(function (input) {
if (parseInt(input.value, 10) === day) {
input.checked = true;
}
});
});
openModal();
}

habitForm.addEventListener("submit", function (e) {
e.preventDefault();
const habitNameInput = document.getElementById("habitName");
const habitCategorySelect = document.getElementById("habitCategory");
const habitName = habitNameInput.value.trim();
const habitCategory = habitCategorySelect.value;
const selectedDays = [];
dueDayInputs.forEach(function (input) {
if (input.checked) {
selectedDays.push(parseInt(input.value, 10));
}
});
const dueDaysValue = selectedDays.length ? selectedDays : [0, 1, 2, 3, 4, 5, 6];
if (editingHabitId !== null) {
for (let i = 0; i < habits.length; i++) {
if (habits[i].id === editingHabitId) {
habits[i].name = habitName;
habits[i].category = habitCategory;
habits[i].dueDays = dueDaysValue;
break;
}
}
showNotification("Habit updated!", "success");
} else {
const newHabit = {
id: Date.now(),
name: habitName,
category: habitCategory,
streak: 0,
completedDates: [],
dueDays: dueDaysValue,
createdAt: new Date().toISOString()
};
habits.push(newHabit);
showNotification("Habit added successfully!", "success");
}
localStorage.setItem("habits", JSON.stringify(habits));
renderHabits();
updateProgress();
updateStats();
closeModalFunc();
});

function renderHabits() {
if (!habits || habits.length === 0) {
habitsContainer.innerHTML = `
<div class="empty-state">
<h2 class="empty-title">No habits yet</h2>
<button class="btn-primary" id="emptyStateBtn" type="button">
Create Your First Habit
</button>
</div>
`;
const emptyStateBtn = document.getElementById("emptyStateBtn");
if (emptyStateBtn) {
emptyStateBtn.addEventListener("click", function () {
editingHabitId = null;
openModal();
});
}
return;
}
habitsContainer.innerHTML = "";
for (let i = 0; i < habits.length; i++) {
const habit = habits[i];
const categoryData = categories[habit.category] || {
name: "Habit",
icon: "✅",
color: "#4CAF50"
};
const isCompleted = isCompletedToday(habit);
const daysShort = ["S", "M", "T", "W", "T", "F", "S"];
const dueLabel = (habit.dueDays || [])
.slice()
.sort()
.map(function (d) {
return daysShort[d];
})
.join(" ");
const card = document.createElement("article");
card.className = "habit-card";
if (isCompleted) {
card.classList.add("habit-completed");
}
card.dataset.id = habit.id;
card.innerHTML = `
<div class="habit-icon" style="border-color: ${categoryData.color};">
${categoryData.icon}
</div>
<div class="habit-info">
<h3 class="habit-name">${habit.name}</h3>
<div class="habit-meta">
<span class="habit-category">${categoryData.name}</span>
${habit.streak > 0 ? `<span class="habit-streak">${habit.streak} day streak</span>` : ""}
</div>
${dueLabel ? `<div class="habit-due-days">Due: ${dueLabel}</div>` : ""}
</div>
<button
class="habit-check ${isCompleted ? "checked" : ""}"
data-habit-id="${habit.id}"
type="button"
aria-label="Mark habit complete"
>
${isCompleted ? "✔" : "○"}
</button>
<button
class="habit-edit"
data-habit-id="${habit.id}"
type="button"
aria-label="Edit habit"
>
✎
</button>
<button
class="habit-delete"
data-habit-id="${habit.id}"
type="button"
aria-label="Delete habit"
>
✕
</button>
`;
habitsContainer.appendChild(card);
}
const checkButtons = document.querySelectorAll(".habit-check");
checkButtons.forEach(function (button) {
button.addEventListener("click", function () {
const habitId = parseInt(button.dataset.habitId, 10);
toggleHabit(habitId);
});
});
const editButtons = document.querySelectorAll(".habit-edit");
editButtons.forEach(function (button) {
button.addEventListener("click", function () {
const habitId = parseInt(button.dataset.habitId, 10);
startEditHabit(habitId);
});
});
const deleteButtons = document.querySelectorAll(".habit-delete");
deleteButtons.forEach(function (button) {
button.addEventListener("click", function () {
const habitId = parseInt(button.dataset.habitId, 10);
deleteHabit(habitId);
});
});
}

function isCompletedToday(habit) {
const today = new Date().toDateString();
return habit.completedDates.includes(today);
}

function toggleHabit(id) {
let habit = null;
for (let i = 0; i < habits.length; i++) {
if (habits[i].id === id) {
habit = habits[i];
break;
}
}
if (!habit) {
return;
}
const today = new Date().toDateString();
if (isCompletedToday(habit)) {
habit.completedDates = habit.completedDates.filter(function (date) {
return date !== today;
});
habit.streak = Math.max(0, habit.streak - 1);
showNotification("Habit unmarked.", "info");
} else {
habit.completedDates.push(today);
habit.streak += 1;
showNotification("Great job! Keep it up!", "success");
}
localStorage.setItem("habits", JSON.stringify(habits));
renderHabits();
updateProgress();
updateStats();
}

function deleteHabit(id) {
const confirmDelete = window.confirm("Are you sure you want to delete this habit?");
if (!confirmDelete) {
return;
}
habits = habits.filter(function (h) {
return h.id !== id;
});
localStorage.setItem("habits", JSON.stringify(habits));
renderHabits();
updateProgress();
updateStats();
showNotification("Habit deleted.", "error");
}

function updateProgress() {
const progressNumber = document.getElementById("progressNumber");
const progressPercentage = document.getElementById("progressPercentage");
const progressFill = document.getElementById("progressFill");
const progressSummary = document.getElementById("progressSummary");
if (!habits || habits.length === 0) {
progressNumber.textContent = "0";
progressPercentage.textContent = "0%";
if (progressFill) {
progressFill.style.strokeDashoffset = 314;
}
progressSummary.textContent = "Add habits to start tracking.";
return;
}
let completed = 0;
for (let i = 0; i < habits.length; i++) {
if (isCompletedToday(habits[i])) {
completed += 1;
}
}
const total = habits.length;
const percentage = Math.round((completed / total) * 100);
const dashOffset = 314 - (314 * percentage) / 100;
progressNumber.textContent = String(percentage);
progressPercentage.textContent = percentage + "%";
if (progressFill) {
progressFill.style.strokeDashoffset = dashOffset;
}
progressSummary.textContent = completed + " of " + total + " habits completed today.";
}

function updateStats() {
const totalHabits = document.getElementById("totalHabits");
const longestStreak = document.getElementById("longestStreak");
const completedToday = document.getElementById("completedToday");
const totalCompletions = document.getElementById("totalCompletions");
if (totalHabits) {
totalHabits.textContent = String(habits.length);
}
let maxStreak = 0;
let completedCount = 0;
let totalCount = 0;
for (let i = 0; i < habits.length; i++) {
if (habits[i].streak > maxStreak) {
maxStreak = habits[i].streak;
}
if (isCompletedToday(habits[i])) {
completedCount += 1;
}
totalCount += habits[i].completedDates.length;
}
if (longestStreak) {
longestStreak.textContent = String(maxStreak);
}
if (completedToday) {
completedToday.textContent = String(completedCount);
}
if (totalCompletions) {
totalCompletions.textContent = String(totalCount);
}
}

categoryCards.forEach(function (card) {
card.addEventListener("mouseenter", function () {
const nameElement = card.querySelector(".category-name");
if (!nameElement) {
return;
}
const key = nameElement.textContent.trim().toLowerCase();
let ideaKey = null;
if (key === "exercise") ideaKey = "exercise";
else if (key === "nutrition") ideaKey = "nutrition";
else if (key === "study") ideaKey = "study";
else if (key === "wellness") ideaKey = "wellness";
else if (key === "sleep") ideaKey = "sleep";
else if (key === "hydration") ideaKey = "water";
else if (key === "work") ideaKey = "work";
else if (key === "cooking") ideaKey = "cooking";
else if (key === "reading") ideaKey = "reading";
else if (key === "creative") ideaKey = "creative";
if (!ideaKey || !categoryIdeas[ideaKey]) {
return;
}
const idea = categoryIdeas[ideaKey];
categoryPreviewContent.innerHTML = `
<div>
<div class="category-preview-title">${idea.title}</div>
<div class="category-preview-text">${idea.text}</div>
</div>
`;
});
card.addEventListener("mouseleave", function () {
categoryPreviewContent.innerHTML = `
<p class="category-preview-placeholder">
Hover a category to see ideas, recipes, or book recommendations.
</p>
`;
});
});

function showNotification(message, type) {
const notification = document.createElement("div");
notification.className = "notification notification-" + type;
const icons = {
success: "✓",
error: "!",
info: "i"
};
notification.innerHTML = `
<span class="notification-icon">${icons[type]}</span>
<span class="notification-text">${message}</span>
`;
document.body.appendChild(notification);
setTimeout(function () {
notification.classList.add("show");
}, 10);
setTimeout(function () {
notification.classList.remove("show");
setTimeout(function () {
notification.remove();
}, 300);
}, 3000);
}

renderHabits();
updateProgress();
updateStats();