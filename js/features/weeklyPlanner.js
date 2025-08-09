// js/features/weeklyPlanner.js

import { generateGroceryList } from './groceryList.js';

const weekSelector = document.getElementById('weekSelector');
const plannerContainer = document.getElementById('weeklyPlanner');

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const meals = ['Breakfast', 'Lunch', 'Dinner'];

function loadMealPlan(week) {
  const saved = localStorage.getItem(`mealPlan-${week}`);
  return saved ? JSON.parse(saved) : null;
}

function saveMealPlan(week) {
  const rows = document.querySelectorAll('.meal-table tr');
  const plan = {};

  rows.forEach((row, index) => {
    if (index === 0) return;
    const day = row.children[0].textContent;
    plan[day] = {
      Breakfast: row.children[1].textContent,
      Lunch: row.children[2].textContent,
      Dinner: row.children[3].textContent
    };
  });

  localStorage.setItem(`mealPlan-${week}`, JSON.stringify(plan));
  alert('✅ Meal plan saved!');
}

function renderMealPlanner(week) {
  plannerContainer.innerHTML = `<h3>Meal Plan for Week: ${week}</h3>`;
  plannerContainer.classList.remove('hidden');

  const table = document.createElement('table');
  table.className = 'meal-table';

  const headerRow = document.createElement('tr');
  headerRow.innerHTML = `<th>Day</th>${meals.map(meal => `<th>${meal}</th>`).join('')}`;
  table.appendChild(headerRow);

  const savedPlan = loadMealPlan(week);

  days.forEach(day => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${day}</td>` + meals.map(meal => {
      const value = savedPlan?.[day]?.[meal] || '';
      return `<td contenteditable="true" class="meal-cell">${value}</td>`;
    }).join('');
    table.appendChild(row);
  });

  plannerContainer.appendChild(table);

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save Meal Plan';
  saveBtn.className = 'close-btn';
  saveBtn.addEventListener('click', () => saveMealPlan(week));

  const clearBtn = document.createElement('button');
  clearBtn.textContent = 'Clear Week';
  clearBtn.className = 'close-btn';
  clearBtn.style.marginLeft = '1rem';
  clearBtn.addEventListener('click', () => {
    if (confirm(`Clear meal plan for Week ${week}?`)) {
      localStorage.removeItem(`mealPlan-${week}`);
      renderMealPlanner(week);
    }
  });

  const groceryBtn = document.createElement('button');
  groceryBtn.textContent = 'Generate Grocery List';
  groceryBtn.className = 'close-btn';
  groceryBtn.style.marginLeft = '1rem';
  groceryBtn.addEventListener('click', () => generateGroceryList(week));

  const buttonRow = document.createElement('div');
  buttonRow.style.marginTop = '1rem';
  buttonRow.appendChild(saveBtn);
  buttonRow.appendChild(clearBtn);
  buttonRow.appendChild(groceryBtn);

  plannerContainer.appendChild(buttonRow);
}

weekSelector.addEventListener('change', () => {
  const selectedWeek = weekSelector.value;
  if (!selectedWeek) return;
  renderMealPlanner(selectedWeek);
});
