export async function showNutritionBreakdown(ingredientText) {
  const endpoint = "https://trackapi.nutritionix.com/v2/natural/nutrients";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-app-id": "b20468a5",
        "x-app-key": "eb97525d56f5c9dc47476ced6ed4fb60"
      },
      body: JSON.stringify({ query: ingredientText })
    });

    const data = await response.json();
    renderNutritionResults(data.foods);
  } catch (error) {
    console.error("Nutrition API error:", error);
    document.getElementById("nutritionResult").innerHTML = `<p>Error fetching data. Try again.</p>`;
  }
}

export function renderNutritionResults(foods) {
  const output = foods.map(food => {
    return `
      <div class="food-card fade-in">
        <h3>${food.food_name}</h3>
        <p><strong>Serving:</strong> ${food.serving_qty} ${food.serving_unit}</p>
        <p><strong>Calories:</strong> ${food.nf_calories}</p>
        <p><strong>Protein:</strong> ${food.nf_protein}g</p>
        <p><strong>Carbs:</strong> ${food.nf_total_carbohydrate}g</p>
        <p><strong>Fat:</strong> ${food.nf_total_fat}g</p>
      </div>
    `;
  }).join("");

  document.getElementById("nutritionResult").innerHTML = `
    <div class="nutrition-wrapper">
      ${output}
      <button id="closeNutrition" class="close-btn">Close Analysis</button>
    </div>
  `;
}
