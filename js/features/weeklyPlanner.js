import { fetchMealOptions, fetchNutritionData, calculateTotalNutrition } from './nutritionService.js';

const plannerContainer = document.getElementById('weeklyPlanner');
const weekSelector = document.getElementById('weekSelector');

export async function renderMealPlanner(week) {
  const mealOptions = await fetchMealOptions();

  plannerContainer.innerHTML = `
    <h2>Meal Plan for Week: ${week}</h2>
    <table id="mealPlannerTable">
      <thead>
        <tr>
          <th>Day</th>
          <th>Breakfast</th>
          <th>Lunch</th>
          <th>Dinner</th>
          <th>Total Nutrition Intake</th>
        </tr>
      </thead>
      <tbody>
        ${generatePlannerRows(mealOptions)}
      </tbody>
    </table>
  `;

  attachDropdownListeners();
}

function generatePlannerRows(mealOptions) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days.map(day => `
    <tr data-day="${day}">
      <td>${day}</td>
      <td>${createDropdown(`${day}-breakfast`, mealOptions)}</td>
      <td>${createDropdown(`${day}-lunch`, mealOptions)}</td>
      <td>${createDropdown(`${day}-dinner`, mealOptions)}</td>
      <td class="nutrition-summary" id="${day}-summary">—</td>
    </tr>
  `).join('');
}

function createDropdown(id, options) {
  const optionTags = options.map(meal => `<option value="${meal}">${meal}</option>`).join('');
  return `<select id="${id}" class="meal-dropdown"><option value="">-- Select --</option>${optionTags}</select>`;
}

function attachDropdownListeners() {
  const dropdowns = document.querySelectorAll('.meal-dropdown');
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener('change', async () => {
      const row = dropdown.closest('tr');
      const day = row.getAttribute('data-day');

      const breakfast = document.getElementById(`${day}-breakfast`).value;
      const lunch = document.getElementById(`${day}-lunch`).value;
      const dinner = document.getElementById(`${day}-dinner`).value;

      const selectedMeals = [breakfast, lunch, dinner].filter(Boolean);
      const nutritionData = await fetchNutritionData(selectedMeals);
      const totals = calculateTotalNutrition(nutritionData);

      updateNutritionSummary(day, totals);
    });
  });
}

function updateNutritionSummary(day, totals) {
  const summaryCell = document.getElementById(`${day}-summary`);
  summaryCell.innerHTML = `
    <strong>Calories:</strong> ${totals.calories.toFixed(0)} kcal<br>
    <strong>Protein:</strong> ${totals.protein.toFixed(1)} g<br>
    <strong>Carbs:</strong> ${totals.carbs.toFixed(1)} g<br>
    <strong>Fat:</strong> ${totals.fat.toFixed(1)} g
  `;
}

weekSelector.addEventListener('change', (e) => {
  const selectedWeek = e.target.value;
  renderMealPlanner(selectedWeek);
});
