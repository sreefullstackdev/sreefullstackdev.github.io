const API_KEY = 'b20468a5eb97525d56f5c9dc47476ced6ed4fb60';
const API_HOST = 'https://trackapi.nutritionix.com/v2/natural/nutrients';

export async function fetchMealOptions() {
  return [
    'Oatmeal', 'Grilled Chicken', 'Salad', 'Pasta', 'Stir Fry', 'Smoothie', 'Quinoa Bowl', 'Veggie Wrap', 'Tofu Curry', 'Fruit Bowl', 'Chapathi', 'Poori', 'Masala Dosa', 'Upma', 
    'Roti', 'Palak Paneer', 'Rice', 'Rice and Dal', 'Rice and Chicken', 'Rice and Palak Paneer', 'Rice and Mutton Curry', 'Garlic Naan', 'Paneer Paratha'];
}


export async function fetchNutritionData(meals) {
  const results = [];

  for (const meal of meals) {
    const response = await fetch("https://trackapi.nutritionix.com/v2/natural/nutrients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-app-id": "b20468a5",
        "x-app-key": "eb97525d56f5c9dc47476ced6ed4fb60"
      },
      body: JSON.stringify({ query: meal })
    });

    const data = await response.json();
    const food = data.foods?.[0];

    if (food) {
      results.push({
        name: meal,
        calories: food.nf_calories || 0,
        protein: food.nf_protein || 0,
        carbs: food.nf_total_carbohydrate || 0,
        fat: food.nf_total_fat || 0
      });
    }
  }

  return results;
}

export function calculateTotalNutrition(mealData) {
  return mealData.reduce((totals, meal) => {
    totals.calories += meal.calories;
    totals.protein += meal.protein;
    totals.carbs += meal.carbs;
    totals.fat += meal.fat;
    return totals;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
}
