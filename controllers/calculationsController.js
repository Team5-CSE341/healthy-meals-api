const { getDb } = require('../db/connection');
const { ObjectId } = require('mongodb');

// GET User Calories (TDEE)
// Endpoint: GET /users/:id/calories
const getUserCalories = async (req, res) => {
  //#swagger.tags = ['Calculations']
  //#swagger.summary = 'Calculate user daily calorie needs'
  //#swagger.parameters['id'] = { in: 'path', description: 'User ID', required: true, type: 'string' }
  /* #swagger.responses[200] = {
      description: 'Calculated calories',
      schema: {
        "User id": 'any',
        "Basal metabolic rate": 0,
        "Activity level": 'any',
        "Total daily energy expenditure": 0,
        "User goal": 'any',
        "Daily calories needed": 0
      }
  } */

  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID' });

    const db = getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Mifflin-St Jeor Formula
    const bmrMan = (10 * user.weight) + (6.25 * user.height) - (5 * user.age) + 5;
    const bmrWoman = (10 * user.weight) + (6.25 * user.height) - (5 * user.age) - 161;

    const bmr = user.sex === 'woman' ? bmrWoman : bmrMan;

    // Activity Multiplier
    const activityMultipliers = {
      "sedentary": 1.2,
      "lightly active": 1.375,
      "moderately active": 1.55,
      "very active": 1.725,
      "extra active": 1.9
    };

    const activityMultiplier = activityMultipliers[user.activity_level] || 1.2; // Default to sedentary if not specified
    const tdee = bmr * activityMultiplier;

    const goalMultipliers = {
      "lose fat": 0.85, // Reduce calories by 15%
      "maintain weight": 1.0, // No change
      "gain muscle": 1.15 // Increase calories by 15%
    };

    const goalMultiplier = goalMultipliers[user.goal] || 1.0; // Default to maintain weight if not specified
    const dailyCaloriesGoal = tdee * goalMultiplier;

    res.status(200).json({
      "User id": id,
      "Basal metabolic rate": Math.round(bmr),
      "Activity level": user.activity_level,
      "Total daily energy expenditure": Math.round(tdee),
      "User goal": user.goal,
      "Daily calories needed": Math.round(dailyCaloriesGoal)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET Recipe Nutrition and Cost
// Endpoint: GET /recipes/:id/calculate
const calculateRecipeDetails = async (req, res) => {
  //#swagger.tags = ['Calculations']
  //#swagger.summary = 'Calculate calories and cost for a recipe'
  //#swagger.parameters['id'] = { in: 'path', description: 'Recipe ID', required: true, type: 'string' }
  /* #swagger.responses[200] = {
      description: 'Calculated recipe data',
      schema: {
        recipe_title: 'any',
        total_calories: 0,
        total_cost: 0,
        calories_per_portion: 0,
        cost_per_portion: 0
      }
  } */

  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID' });

    const db = getDb();
    
    // Aggregation to join recipe with ingredients data
    const recipeData = await db.collection('recipes').aggregate([
      { $match: { _id: new ObjectId(id) } },
      { $unwind: '$ingredients' },
      {
        $lookup: {
          from: 'ingredients',
          let: { searchId: { $toObjectId: '$ingredients.ingredient_id' } },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$searchId'] } } }
          ],
          as: 'ingDetails'
        }
      },
      { $unwind: '$ingDetails' },
      {
        $group: {
          _id: '$_id',
          title: { $first: '$title' },
          portions: { $first: '$portions' },
          totalCalories: { $sum: { $multiply: ['$ingredients.quantity', '$ingDetails.calories_per_unit'] } },
          totalCost: { $sum: { $multiply: ['$ingredients.quantity', '$ingDetails.cost_per_unit'] } }
        }
      }
    ]).toArray();

    if (recipeData.length === 0) return res.status(404).json({ message: 'Recipe not found' });

    const recipe = recipeData[0];
    res.status(200).json({
      "Recipe title": recipe.title,
      "Total calories": Number(recipe.totalCalories.toFixed(2)),
      "Total cost": Number(recipe.totalCost.toFixed(2)),
      "Portions": recipe.portions,
      "Calories per portion": Number((recipe.totalCalories / recipe.portions).toFixed(2)),
      "Cost per portion": Number((recipe.totalCost / recipe.portions).toFixed(2))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET Recommended Recipes
// Endpoint: GET /recipes/recommended/:userId
const getRecommendedRecipes = async (req, res) => {
  //#swagger.tags = ['Calculations']
  //#swagger.summary = 'Recommend recipes based on user needs'
  //#swagger.parameters['userId'] = { in: 'path', description: 'User ID', required: true, type: 'string' }
  //#swagger.parameters['type'] = { in: 'query', description: 'Filter by meal type (e.g., lunch, dinner)', required: false, type: 'string' }
  /* #swagger.responses[200] = {
      description: 'List of recommended recipes',
      schema: [{
        _id: 'any',
        type: 'breakfast | lunch | dinner | snack',
        title: 'any',
        "Calories per portion": 0,
        "Target calories per meal": 0
      }]
  } */

  try {
    const userId = req.params.userId;
    const mealType = req.query.type; // Optional query parameter to filter by meal type
    const db = getDb();

    // 1. Calculate user calories
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const bmrMan = (10 * user.weight) + (6.25 * user.height) - (5 * user.age) + 5;
    const bmrWoman = (10 * user.weight) + (6.25 * user.height) - (5 * user.age) - 161;
    const bmr = user.sex === 'woman' ? bmrWoman : bmrMan;

    const activityMultipliers = { "sedentary": 1.2, "lightly active": 1.375, "moderately active": 1.55, "very active": 1.725, "extra active": 1.9 };
    const activityMultiplier = activityMultipliers[user.activity_level] || 1.2; // Default to sedentary if not specified
    const tdee = bmr * activityMultiplier;

    const goalMultipliers = { "lose fat": 0.85, "maintain weight": 1.0, "gain muscle": 1.15 };
    const dailyCaloriesGoal = tdee * (goalMultipliers[user.goal] || 1.0);
    
    // Target: Calories per meal (assuming 3 meals a day)
    const targetCaloriesPerMeal = dailyCaloriesGoal / 3;

    // 2. Build the aggregation pipeline dynamically
    const pipeline = [];

    // If a type was provided in the query, filter the database immediately
    if (mealType) {
        pipeline.push({ $match: { type: mealType } });
    }

    // Add the rest of the required stages to calculate calories
    pipeline.push(
        { $unwind: '$ingredients' },
        {
            $lookup: {
            from: 'ingredients',
            let: { searchId: { $toObjectId: '$ingredients.ingredient_id' } },
            pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$searchId'] } } }],
            as: 'ingDetails'
            }
        },
        { $unwind: '$ingDetails' },
        {
            $group: {
            _id: '$_id',
            type: { $first: '$type' }, 
            title: { $first: '$title' },
            portions: { $first: '$portions' },
            totalCalories: { $sum: { $multiply: ['$ingredients.quantity', '$ingDetails.calories_per_unit'] } }
            }
        },
        {
            $project: {
            type: 1, 
            title: 1,
            "Calories per portion": { $divide: ['$totalCalories', '$portions'] }
            }
        }
    );

    // Execute the pipeline
    const recipes = await db.collection('recipes').aggregate(pipeline).toArray();

    // 3. Filter recipes based on the user's specific goal
    let recommended = [];

    if (user.goal === 'lose fat' && mealType !== 'snack') {
      recommended = recipes.filter(recipe => recipe["Calories per portion"] <= targetCaloriesPerMeal);
    } else if (user.goal === 'maintain weight' && mealType !== 'snack') {
      recommended = recipes.filter(recipe => recipe["Calories per portion"] >= targetCaloriesPerMeal * 0.9 && recipe["Calories per portion"] <= targetCaloriesPerMeal * 1.1);
    } else if (user.goal === 'gain muscle' && mealType !== 'snack') {
      recommended = recipes.filter(recipe => recipe["Calories per portion"] >= targetCaloriesPerMeal);
    } else if (mealType === 'snack') {
        if (user.goal === 'lose fat') {
            recommended = recipes.filter(recipe => recipe["Calories per portion"] <= targetCaloriesPerMeal * 0.2);
        } else if (user.goal === 'maintain weight') {
            recommended = recipes.filter(recipe => recipe["Calories per portion"] > targetCaloriesPerMeal * 0.2 && recipe["Calories per portion"] < targetCaloriesPerMeal * 0.3);
        } else if (user.goal === 'gain muscle') {
            recommended = recipes.filter(recipe => recipe["Calories per portion"] >= targetCaloriesPerMeal * 0.3);
        }
    } else {
        recommended = recipes; // If no specific goal, return all recipes of the specified type
    }

    res.status(200).json(recommended.map(recipe => ({
        ...recipe,
        "Target calories per meal": Math.round(targetCaloriesPerMeal)
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getUserCalories,
  calculateRecipeDetails,
  getRecommendedRecipes
};