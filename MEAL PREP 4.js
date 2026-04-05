const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());


let meals = [];
let plans = [];
let users = [];


app.get('/', (req, res) => {
    res.send("🍱 Welcome to Meal Prep API! Eat smart, live better 💪");
});


app.post('/register', (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({
            message: "Please enter a username 😊"
        });
    }

    const newUser = {
        id: users.length + 1,
        username,
        createdAt: new Date()
    };

    users.push(newUser);

    res.status(201).json({
        message: "🎉 User registered successfully!",
        user: newUser
    });
});


app.post('/meals', (req, res) => {
    const { name, calories, category } = req.body;

    if (!name || !calories) {
        return res.status(400).json({
            message: "Please add meal name and calories ⚠️"
        });
    }

    const newMeal = {
        id: meals.length + 1,
        name,
        calories,
        category: category || "General",
        createdAt: new Date()
    };

    meals.push(newMeal);

    res.status(201).json({
        message: "🍽️ Meal added successfully!",
        meal: newMeal
    });
});


app.get('/meals', (req, res) => {
    const { category, maxCalories } = req.query;

    let result = meals;

    if (category) {
        result = result.filter(m =>
            m.category.toLowerCase() === category.toLowerCase()
        );
    }

    if (maxCalories) {
        result = result.filter(m =>
            m.calories <= maxCalories
        );
    }

    res.json({
        message: "Here are your meals 🍴",
        data: result
    });
});


app.post('/plans', (req, res) => {
    const { date, mealIds } = req.body;

    if (!date || !mealIds || mealIds.length === 0) {
        return res.status(400).json({
            message: "Please provide date and meals 📅"
        });
    }

    const selectedMeals = meals.filter(m =>
        mealIds.includes(m.id)
    );

    const newPlan = {
        id: plans.length + 1,
        date,
        meals: selectedMeals
    };

    plans.push(newPlan);

    res.status(201).json({
        message: "📅 Meal plan created!",
        plan: newPlan
    });
});


app.get('/plans', (req, res) => {
    res.json({
        message: "Your meal plans 🗓️",
        data: plans
    });
});


app.get('/summary/:date', (req, res) => {
    const { date } = req.params;

    const plan = plans.find(p => p.date === date);

    if (!plan) {
        return res.status(404).json({
            message: "No plan found for this date 😢"
        });
    }

    const totalCalories = plan.meals.reduce(
        (sum, m) => sum + m.calories, 0
    );

    res.json({
        date,
        totalMeals: plan.meals.length,
        totalCalories,
        message: "💪 Here's your daily summary!"
    });
});


app.put('/meals/:id', (req, res) => {
    const meal = meals.find(m => m.id == req.params.id);

    if (!meal) {
        return res.status(404).json({
            message: "Meal not found 😢"
        });
    }

    const { name, calories, category } = req.body;

    if (name) meal.name = name;
    if (calories) meal.calories = calories;
    if (category) meal.category = category;

    res.json({
        message: "✏️ Meal updated!",
        meal
    });
});


app.delete('/meals/:id', (req, res) => {
    const index = meals.findIndex(m => m.id == req.params.id);

    if (index === -1) {
        return res.status(404).json({
            message: "Meal not found 😢"
        });
    }

    meals.splice(index, 1);

    res.json({
        message: "🗑️ Meal deleted successfully!"
    });
});


app.get('/stats', (req, res) => {
    const totalMeals = meals.length;

    const totalCalories = meals.reduce(
        (sum, m) => sum + m.calories, 0
    );

    const avgCalories = totalMeals === 0 ? 0 : totalCalories / totalMeals;

    res.json({
        totalMeals,
        averageCalories: avgCalories.toFixed(2),
        message: "📊 API stats overview"
    });
});


app.listen(PORT, () => {
    console.log(`🚀 Meal Prep API running at http://localhost:${PORT}`);
});