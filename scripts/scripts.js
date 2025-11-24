/* WRITE YOUR JS HERE... YOU MAY REQUIRE MORE THAN ONE JS FILE. IF SO SAVE IT SEPARATELY IN THE SCRIPTS DIRECTORY */


const themeBtn = document.getElementById('themeBtn');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.classList.add('dark-mode');
}

themeBtn.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
});

const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.page-section');

navItems.forEach(item => {
  item.addEventListener('click', () => {
    const target = item.dataset.target;
    
    navItems.forEach(nav => nav.classList.remove('nav-active'));
    item.classList.add('nav-active');
    
    sections.forEach(section => {
      if (section.id === target) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });
  });
});

let habits = JSON.parse(localStorage.getItem('habits')) || [];

const habitsContainer = document.getElementById('habitsContainer');
const addHabitBtn = document.getElementById('addHabitBtn');
const modal = document.getElementById('habitModal');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const habitForm = document.getElementById('habitForm');

const categories = {
  exercise: { icon: '💪', color: '#2563EB', name: 'Exercise' },
  nutrition: { icon: '🍎', color: '#10B981', name: 'Nutrition' },
  study: { icon: '📚', color: '#7C3AED', name: 'Study' },
  wellness: { icon: '🧘', color: '#F59E0B', name: 'Wellness' },
  sleep: { icon: '🌙', color: '#6366F1', name: 'Sleep' },
  water: { icon: '💧', color: '#06B6D4', name: 'Hydration' },
  work: { icon: '💼', color: '#EF4444', name: 'Work' },
  cooking: { icon: '🍳', color: '#F97316', name: 'Cooking' },
  reading: { icon: '📖', color: '#8B5CF6', name: 'Reading' },
  creative: { icon: '🎨', color: '#EC4899', name: 'Creative' }
};

addHabitBtn.addEventListener('click', () => {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
});

closeModal.addEventListener('click', closeModalFunc);
cancelBtn.addEventListener('click', closeModalFunc);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModalFunc();
});

function closeModalFunc() {
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
  habitForm.reset();
}

habitForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const habitName = document.getElementById('habitName').value;
  const habitCategory = document.getElementById('habitCategory').value;
  
  const newHabit = {
    id: Date.now(),
    name: habitName,
    category: habitCategory,
    streak: 0,
    completedDates: [],
    createdAt: new Date().toISOString()
  };
  
  habits.push(newHabit);
  localStorage.setItem('habits', JSON.stringify(habits));
  
  renderHabits();
  closeModalFunc();
  showNotification('Habit added successfully! 🎉', 'success');
});

function renderHabits() {
  if (habits.length === 0) {
    habitsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎯</div>
        <h2 class="empty-title">No habits yet</h2>
        <p class="empty-text">Start building your momentum by adding your first habit</p>
        <button class="btn-primary" onclick="document.getElementById('addHabitBtn').click()">
          Create Your First Habit
        </button>
      </div>
    `;
    updateProgress();
    return;
  }
  
  habitsContainer.innerHTML = habits.map(habit => {
    const categoryData = categories[habit.category];
    const isCompleted = isCompletedToday(habit);
    
    return `
      <article class="habit-card ${isCompleted ? 'habit-completed' : ''}" data-id="${habit.id}">
        <div class="habit-icon" style="background: ${categoryData.color}15; color: ${categoryData.color};">
          ${categoryData.icon}
        </div>
        <div class="habit-info">
          <h3 class="habit-name">${habit.name}</h3>
          <div class="habit-meta">
            <span class="habit-category">${categoryData.name}</span>
            ${habit.streak > 0 ? `
              <div class="habit-streak">
                <span class="streak-icon">🔥</span>
                <span class="streak-text">${habit.streak} day streak</span>
              </div>
            ` : ''}
          </div>
        </div>
        <button class="habit-check ${isCompleted ? 'checked' : ''}" onclick="toggleHabit(${habit.id})" aria-label="Mark habit complete">
          <svg width="28" height="28" viewBox="0 0 28 28">
            <circle cx="14" cy="14" r="13" stroke="currentColor" stroke-width="2" fill="none"/>
            ${isCompleted ? '<path d="M8 14l4 4 8-8" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' : ''}
          </svg>
        </button>
        <button class="habit-delete" onclick="deleteHabit(${habit.id})" aria-label="Delete habit">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
          </svg>
        </button>
      </article>
    `;
  }).join('');
  
  updateProgress();
  updateStats();
}

function isCompletedToday(habit) {
  const today = new Date().toDateString();
  return habit.completedDates.includes(today);
}

function toggleHabit(id) {
  const habit = habits.find(h => h.id === id);
  const today = new Date().toDateString();
  
  if (isCompletedToday(habit)) {
    habit.completedDates = habit.completedDates.filter(date => date !== today);
    habit.streak = Math.max(0, habit.streak - 1);
    showNotification('Habit unmarked', 'info');
  } else {
    habit.completedDates.push(today);
    habit.streak++;
    showNotification('Great job! Keep it up! 💪', 'success');
  }
  
  localStorage.setItem('habits', JSON.stringify(habits));
  renderHabits();
}

function deleteHabit(id) {
  if (confirm('Are you sure you want to delete this habit?')) {
    habits = habits.filter(h => h.id !== id);
    localStorage.setItem('habits', JSON.stringify(habits));
    renderHabits();
    showNotification('Habit deleted', 'error');
  }
}

function updateProgress() {
  const progressNumber = document.getElementById('progressNumber');
  const progressPercentage = document.getElementById('progressPercentage');
  const progressFill = document.getElementById('progressFill');
  const progressSummary = document.getElementById('progressSummary');
  
  if (habits.length === 0) {
    progressNumber.textContent = '0%';
    progressPercentage.textContent = '0%';
    progressFill.style.strokeDashoffset = '314';
    progressSummary.textContent = 'Add habits to start tracking';
    return;
  }
  
  const completed = habits.filter(isCompletedToday).length;
  const total = habits.length;
  const percentage = Math.round((completed / total) * 100);
  const dashOffset = 314 - (314 * percentage / 100);
  
  progressNumber.textContent = `${percentage}%`;
  progressPercentage.textContent = `${percentage}%`;
  progressFill.style.strokeDashoffset = dashOffset;
  progressSummary.textContent = `${completed} of ${total} habits completed today`;
}

function updateStats() {
  const totalHabits = document.getElementById('totalHabits');
  const longestStreak = document.getElementById('longestStreak');
  const completedToday = document.getElementById('completedToday');
  const totalCompletions = document.getElementById('totalCompletions');
  
  if (totalHabits) {
    totalHabits.textContent = habits.length;
    longestStreak.textContent = Math.max(...habits.map(h => h.streak), 0);
    completedToday.textContent = habits.filter(isCompletedToday).length;
    totalCompletions.textContent = habits.reduce((sum, h) => sum + h.completedDates.length, 0);
  }
}

function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  };
  
  notification.innerHTML = `
    <span class="notification-icon">${icons[type]}</span>
    <span class="notification-text">${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => notification.classList.add('show'), 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}


renderHabits();

window.toggleHabit = toggleHabit;
window.deleteHabit = deleteHabit;