document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const recipesContainer = document.getElementById('recipes-container');
    const recipeContent = document.getElementById('recipe-content');

    const showLoading = () => {
        recipesContainer.innerHTML = `
            <div class="loading" style="grid-column: 1 / -1;">
                <div class="spinner"></div>
                <p>Searching for recipes...</p>
            </div>
        `;
    };

    const showError = (message) => {
        recipesContainer.innerHTML = `
            <div class="error-message" style="grid-column: 1 / -1;">
                <p>${message}</p>
            </div>
        `;
    };

    const fetchRecipes = async (query) => {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data.meals || [];
        } catch (error) {
            throw new Error('Failed to fetch recipes. Please check your connection and try again.');
        }
    };

    const fetchRecipeDetails = async (id) => {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data.meals ? data.meals[0] : null;
        } catch (error) {
            throw new Error('Failed to load recipe details.');
        }
    };

    const displayRecipes = (recipes) => {
        recipesContainer.innerHTML = '';
        
        if (!recipes || recipes.length === 0) {
            recipesContainer.innerHTML = '<p style="text-align: center; font-size: 1.2rem; color: #ff6b6b; grid-column: 1 / -1;">No recipes found. Try another search.</p>';
            return;
        }

        recipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'recipe-card';
            recipeCard.setAttribute('role', 'button');
            recipeCard.setAttribute('tabindex', '0');
            recipeCard.setAttribute('aria-label', `View recipe for ${recipe.strMeal}`);
            
            recipeCard.innerHTML = `
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="recipe-image" loading="lazy">
                <div class="recipe-info">
                    <h3 class="recipe-title">${recipe.strMeal}</h3>
                    <p class="recipe-category">${recipe.strCategory}</p>
                    <div class="recipe-details">
                        <div class="recipe-detail">
                            <span>📍 ${recipe.strArea}</span>
                        </div>
                    </div>
                </div>
            `;
            
            const clickHandler = () => showRecipeDetails(recipe.idMeal);
            recipeCard.addEventListener('click', clickHandler);
            recipeCard.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    clickHandler();
                }
            });
            
            recipesContainer.appendChild(recipeCard);
        });
    };

    const parseInstructions = (instructions) => {
        if (!instructions) return [];
        
        const steps = instructions.split(/\d+\.|\n|(?<=[.!?])\s+(?=[A-Z])/);
        
        return steps
            .map(step => step.trim())
            .filter(step => step.length > 0 && !step.match(/^\s*$/));
    };

    const showRecipeDetails = async (recipeId) => {
        try {
            recipesContainer.innerHTML = `
                <div class="loading" style="grid-column: 1 / -1;">
                    <div class="spinner"></div>
                    <p>Loading recipe details...</p>
                </div>
            `;
            
            const recipe = await fetchRecipeDetails(recipeId);
            
            if (!recipe) {
                showError('Recipe not found');
                return;
            }

            const ingredients = [];
            for (let i = 1; i <= 20; i++) {
                const ingredient = recipe[`strIngredient${i}`];
                const measure = recipe[`strMeasure${i}`];
                if (ingredient && ingredient.trim() !== '') {
                    ingredients.push({
                        ingredient: ingredient.trim(),
                        measure: measure ? measure.trim() : ''
                    });
                } else {
                    break;
                }
            }

            const instructions = parseInstructions(recipe.strInstructions);
            
            recipeContent.innerHTML = `
                <div class="recipe-header">
                    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" loading="lazy">
                    <h2 class="recipe-title-full">${recipe.strMeal}</h2>
                    <p class="recipe-category-full">${recipe.strCategory} | ${recipe.strArea}</p>
                    ${recipe.strTags ? `<p class="recipe-category-full">Tags: ${recipe.strTags.split(',').join(', ')}</p>` : ''}
                </div>
                
                ${recipe.strYoutube ? `
                <div class="recipe-video" style="margin: 20px 0; text-align: center;">
                    <a href="${recipe.strYoutube}" target="_blank" style="display: inline-block; padding: 12px 25px; background: #ff0000; color: white; text-decoration: none; border-radius: 50px; font-weight: bold;">
                        📺 Watch Video Tutorial
                    </a>
                </div>
                ` : ''}
                
                <div class="recipe-ingredients">
                    <h2>Ingredients</h2>
                    <div class="ingredients-list">
                        ${ingredients.map(ing => `
                            <div class="ingredient-item">
                                <i>🥄</i>
                                <span>${ing.measure} ${ing.ingredient}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="recipe-instructions">
                    <h2>Instructions</h2>
                    <div class="instructions-list">
                        ${instructions.map((step, index) => `
                            <div class="instruction-step">
                                <div class="step-number">${index + 1}</div>
                                <div class="step-content">${step}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <button class="back-button" id="back-to-recipes">← Back to Recipes</button>
            `;
            
            document.getElementById('back-to-recipes').addEventListener('click', goBack);
            
            recipesContainer.style.display = 'none';
            recipeContent.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
        } catch (error) {
            showError(error.message);
        }
    };

    const goBack = () => {
        recipeContent.style.display = 'none';
        recipesContainer.style.display = 'grid';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    searchButton.addEventListener('click', async () => {
        const query = searchInput.value.trim();
        if (query) {
            searchButton.disabled = true;
            searchButton.textContent = 'Searching...';
            
            try {
                showLoading();
                const recipes = await fetchRecipes(query);
                displayRecipes(recipes);
            } catch (error) {
                showError(error.message);
            } finally {
                searchButton.disabled = false;
                searchButton.textContent = 'Search';
            }
        } else {
            showError('Please enter a search term');
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });

    const loadFeaturedRecipes = async () => {
        try {
            showLoading();
            const featured = await fetchRecipes('chicken');
            displayRecipes(featured.slice(0, 12));
        } catch (error) {
            showError(error.message);
        }
    };

    loadFeaturedRecipes();
});