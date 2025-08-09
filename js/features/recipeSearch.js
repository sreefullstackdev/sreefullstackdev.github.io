const RAPIDAPI_KEY = '79e8b46364msh1f512c2449a6991p117c4fjsn22f5ab987245';
const RAPIDAPI_HOST = 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com';

export async function searchRecipesRapidAPI({ query, cuisine, diet, intolerances }) {
  const url = new URL(`https://${RAPIDAPI_HOST}/recipes/complexSearch`);

  if (query) url.searchParams.append('query', query);
  if (cuisine) url.searchParams.append('cuisine', cuisine);
  if (diet) url.searchParams.append('diet', diet);
  if (intolerances) url.searchParams.append('intolerances', intolerances);

  url.searchParams.append('number', '12'); 
  url.searchParams.append('addRecipeInformation', 'true'); 
  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': RAPIDAPI_KEY
      }
    });

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching recipes:', error);
    return [];
  }
}

export async function getRecipeDetails(id) {
  const url = `https://${RAPIDAPI_HOST}/recipes/${id}/information`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
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
