import { searchRecipesRapidAPI, getRecipeDetails } from './features/recipeSearch.js';
import { showNutritionBreakdown } from './features/nutritionBreakdown.js';
import { renderMealPlanner } from './features/weeklyPlanner.js';

// DOM Elements
const resultsContainer = document.getElementById('results');
const nutritionForm = document.getElementById('nutrition-form');
const ingredientInput = document.getElementById('ingredientInput');
const nutritionResult = document.getElementById('nutritionResult');
const searchForm = document.getElementById('searchForm');
const weekSelector = document.getElementById('weekSelector');

// Handle Recipe Search
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(searchForm);
  const query = formData.get('query');
  const cuisine = formData.get('cuisine');
  const diet = formData.get('diet');

  const intoleranceSelect = document.getElementById('intolerances');
  const selectedIntolerances = Array.from(intoleranceSelect.selectedOptions).map(opt => opt.value);
  const intolerances = selectedIntolerances.join(',');

  const recipes = await searchRecipesRapidAPI({ query, cuisine, diet, intolerances });
  displaySearchResults(recipes);
});

// Display Search Results
function displaySearchResults(recipes) {
  resultsContainer.innerHTML = '';

  if (!recipes || recipes.length === 0) {
    resultsContainer.innerHTML = '<p>No recipes found.</p>';
    return;
  }

  recipes.forEach(recipe => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.innerHTML = `
      <h3>${recipe.title}</h3>
      <img src="https://spoonacular.com/recipeImages/${recipe.id}-312x231.jpg" alt="${recipe.title}" />
      <p><strong>Ready in:</strong> ${recipe.readyInMinutes} mins</p>
      <button data-id="${recipe.id}" class="view-recipe-btn">View Recipe</button>
    `;
    resultsContainer.appendChild(card);
  });

  document.querySelectorAll('.view-recipe-btn').forEach(button => {
    button.addEventListener('click', async () => {
      const id = button.getAttribute('data-id');
      const recipe = await getRecipeDetails(id);
      displayRecipeDetails(recipe);
    });
  });
}

// Display Recipe Details
function displayRecipeDetails(recipe) {
  if (!recipe) {
    resultsContainer.innerHTML = '<p>Error loading recipe details.</p>';
    return;
  }

  resultsContainer.innerHTML = `
    <div class="recipe-details">
      <h2>${recipe.title}</h2>
      <img src="${recipe.image}" alt="${recipe.title}" />
      <p><strong>Ready in:</strong> ${recipe.readyInMinutes} mins</p>
      <p><strong>Servings:</strong> ${recipe.servings}</p>
      <h3>Ingredients:</h3>
      <ul>
        ${recipe.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join('')}
      </ul>
      <h3>Instructions:</h3>
      <p>${recipe.instructions?.trim() || 'No instructions available.'}</p>
      <button id="backToSearch">Back to Search</button>
    </div>
  `;

  document.getElementById('backToSearch').addEventListener('click', () => {
    location.reload();
  });
}

// Nutrition Breakdown
nutritionForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const userInput = ingredientInput.value.trim();
  if (!userInput) return;

  showNutritionBreakdown(userInput);
});

// Clear Nutrition Result
nutritionResult.addEventListener('click', (event) => {
  if (event.target.id === 'closeNutrition') {
    nutritionResult.innerHTML = '';
    ingredientInput.value = '';
  }
});

// Weekly Meal Planner
weekSelector.addEventListener('change', () => {
  const selectedWeek = weekSelector.value;
  if (selectedWeek) {
    renderMealPlanner(selectedWeek);
  }
});

if (weekSelector.value) {
  renderMealPlanner(weekSelector.value);
}

// 🔐 Authentication Modal Logic
const signInBtn = document.getElementById('signInBtn');
const signUpBtn = document.getElementById('signUpBtn');
const modalContainer = document.getElementById('modal-container');

function createModal(type) {
  modalContainer.innerHTML = '';
  modalContainer.style.display = 'flex';
  modalContainer.setAttribute('aria-hidden', 'false');

  const modal = document.createElement('div');
  modal.className = 'modal';

  const title = document.createElement('h2');
  title.textContent = type === 'signin' ? 'Sign In' : 'Sign Up';

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.placeholder = 'Email';
  emailInput.required = true;

  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.placeholder = 'Password';
  passwordInput.required = true;

  const submitBtn = document.createElement('button');
  submitBtn.textContent = type === 'signin' ? 'Login' : 'Register';

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  closeBtn.className = 'close-btn';
  closeBtn.onclick = () => {
    modalContainer.style.display = 'none';
    modalContainer.setAttribute('aria-hidden', 'true');
  };

  modal.append(title, emailInput, passwordInput, submitBtn, closeBtn);
  modalContainer.appendChild(modal);
}

signInBtn?.addEventListener('click', () => createModal('signin'));
signUpBtn?.addEventListener('click', () => createModal('signup'));
