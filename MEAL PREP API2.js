const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());


let meals = [
    {
        id: 1,
        name: "Grilled Chicken Bowl",
        calories: 500,
        category: "Lunch",
        ingredients: ["Chicken", "Rice", "Vegetables"],
        dateAdded: new Date()
    },
    {
        id: 2,
        name: "Healthy Veggie Salad",
        calories: 300,
        category: "Dinner",
        ingredients: ["Lettuce", "Tomato", "Cucumber"],
        dateAdded: new Date()
    }
];


app.get('/', (req, res) => {
    res.send("🍱 Welcome to Meal Prep API! Plan smarter, eat better 💪");
});


app.get('/meals', (req, res) => {
    const { category, maxCalories } = req.query;

    let filteredMeals = meals;

    if (category) {
        filteredMeals = filteredMeals.filter(m =>
            m.category.toLowerCase() === category.toLowerCase()
        );
    }

    if (maxCalories) {
        filteredMeals = filteredMeals.filter(m =>
            m.calories <= maxCalories
        );
    }

    res.json(filteredMeals);
});


app.get('/meals/:id', (req, res) => {
    const meal = meals.find(m => m.id == req.params.id);

    if (!meal) {
        return res.status(404).json({ message: "Meal not found 😢" });
    }

    res.json(meal);
});


app.post('/meals', (req, res) => {
    const { name, calories, category, ingredients } = req.body;

    if (!name || !calories) {
        return res.status(400).json({
            message: "Please provide name and calories ⚠️"
        });
    }

    const newMeal = {
        id: meals.length + 1,
        name,
        calories,
        category: category || "General",
        ingredients: ingredients || [],
        dateAdded: new Date()
    };

    meals.push(newMeal);

    res.status(201).json({
        message: "Meal added successfully 🎉",
        meal: newMeal
    });
});


app.put('/meals/:id', (req, res) => {
    const meal = meals.find(m => m.id == req.params.id);

    if (!meal) {
        return res.status(404).json({ message: "Meal not found 😢" });
    }

    const { name, calories, category, ingredients } = req.body;

    if (name) meal.name = name;
    if (calories) meal.calories = calories;
    if (category) meal.category = category;
    if (ingredients) meal.ingredients = ingredients;

    res.json({
        message: "Meal updated successfully ✏️",
        meal
    });
});


app.delete('/meals/:id', (req, res) => {
    const index = meals.findIndex(m => m.id == req.params.id);

    if (index === -1) {
        return res.status(404).json({ message: "Meal not found 😢" });
    }

    meals.splice(index, 1);

    res.json({ message: "Meal deleted successfully 🗑️" });
});


app.get('/stats', (req, res) => {
    const totalMeals = meals.length;

    const avgCalories =
        meals.reduce((sum, m) => sum + m.calories, 0) / totalMeals;

    res.json({
        totalMeals,
        averageCalories: avgCalories.toFixed(2)
    });
});


app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});