const RAPIDAPI_KEY = '79e8b46364msh1f512c2449a6991p117c4fjsn22f5ab987245';

export async function searchRecipesRapidAPI({ query, cuisine, diet, intolerances }) {
  const url = new URL('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search');
  if (query) url.searchParams.append('query', query);
  if (cuisine) url.searchParams.append('cuisine', cuisine);
  if (diet) url.searchParams.append('diet', diet);
  if (intolerances) url.searchParams.append('intolerances', intolerances);
  url.searchParams.append('number', 10); 

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY
      }
    });

    const data = await response.json();
    return data.results; 
  } catch (error) {
    console.error('Error searching recipes:', error);
    return [];
  }
}

export async function getRecipeDetails(id) {
  const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${id}/information`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY
      }
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    return null;
  }
}
