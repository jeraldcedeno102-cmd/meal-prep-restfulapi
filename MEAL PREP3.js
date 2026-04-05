const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());


let meals = [];
let plans = []; // meal plans by date


app.get('/', (req, res) => {
    res.send("🍱 Welcome! Your Meal Prep API is ready to help you eat better 💪");
});


app.post('/meals', (req, res) => {
    const { name, calories, category } = req.body;

    if (!name || !calories) {
        return res.status(400).json({
            message: "Oops! Please include meal name and calories 😊"
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
        message: "🎉 Meal created successfully!",
        meal: newMeal
    });
});


app.get('/meals', (req, res) => {
    res.json({
        message: "Here are your meals 🍽️",
        data: meals
    });
});


app.post('/plans', (req, res) => {
    const { date, mealIds } = req.body;

    if (!date || !mealIds || mealIds.length === 0) {
        return res.status(400).json({
            message: "Please provide a date and at least one meal 📅"
        });
    }

    const selectedMeals = meals.filter(m => mealIds.includes(m.id));

    const newPlan = {
        id: plans.length + 1,
        date,
        meals: selectedMeals
    };

    plans.push(newPlan);

    res.status(201).json({
        message: "📅 Meal plan created successfully!",
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
            message: "No meal plan found for this date 😢"
        });
    }

    const totalCalories = plan.meals.reduce(
        (sum, meal) => sum + meal.calories, 0
    );

    res.json({
        date,
        totalMeals: plan.meals.length,
        totalCalories,
        message: "Here’s your daily nutrition summary 💪"
    });
});


app.delete('/meals/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = meals.findIndex(m => m.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Meal not found 😢"
        });
    }

    meals.splice(index, 1);

    res.json({
        message: "Meal removed successfully 🗑️"
    });
});


app.listen(PORT, () => {
    console.log(`🚀 API running at http://localhost:${PORT}`);
});