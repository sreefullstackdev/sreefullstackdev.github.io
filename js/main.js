// main.js

import { searchRecipesRapidAPI, getRecipeDetails } from './features/recipeSearch.js';
import { showNutritionBreakdown } from './features/nutritionBreakdown.js';

const resultsContainer = document.getElementById('results');
const nutritionForm = document.getElementById('nutrition-form');
const ingredientInput = document.getElementById('ingredientInput');
const nutritionResult = document.getElementById('nutritionResult');

document.getElementById('searchForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const query = document.getElementById('query').value;
  const cuisine = document.getElementById('cuisine').value;
  const diet = document.getElementById('diet').value;
  const intolerances = document.getElementById('intolerances').value;

  const recipes = await searchRecipesRapidAPI({ query, cuisine, diet, intolerances });
  displaySearchResults(recipes);
});

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
      <p>${recipe.instructions || 'No instructions available.'}</p>
      <button onclick="location.reload()">Back to Search</button>
    </div>
  `;
}

nutritionForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const userInput = ingredientInput.value.trim();
  if (!userInput) return;

  showNutritionBreakdown(userInput);
});

nutritionResult.addEventListener('click', (event) => {
  if (event.target.id === 'closeNutrition') {
    nutritionResult.innerHTML = '';
    ingredientInput.value = '';
  }
});

import './features/weeklyPlanner.js';

import { renderMealPlanner } from './features/weeklyPlanner.js';

const selectedWeek = document.getElementById('weekSelector').value;
if (selectedWeek) {
  renderMealPlanner(selectedWeek);
}

