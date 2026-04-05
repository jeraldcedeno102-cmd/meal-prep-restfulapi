const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());


let meals = [];
let plans = [];
let users = [];


app.get('/', (req, res) => {
    res.send("🍱 Welcome to MealMate API! Your smart partner for healthier meals 💪✨");
});


app.post('/register', (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({
            message: "Hey there! Please enter a username 😊"
        });
    }

    const newUser = {
        id: users.length + 1,
        username,
        joinedAt: new Date()
    };

    users.push(newUser);

    res.status(201).json({
        message: `🎉 Welcome ${username}! Your journey starts now!`,
        user: newUser
    });
});


app.post('/meals', (req, res) => {
    const { name, calories, category, mood } = req.body;

    if (!name || !calories) {
        return res.status(400).json({
            message: "Oops! Don't forget the meal name and calories 😄"
        });
    }

    const newMeal = {
        id: meals.length + 1,
        name,
        calories,
        category: category || "General",
        mood: mood || "Neutral 😐",
        createdAt: new Date()
    };

    meals.push(newMeal);

    res.status(201).json({
        message: `🍽️ "${name}" added! Looks delicious!`,
        meal: newMeal
    });
});


app.get('/meals', (req, res) => {
    const { category, maxCalories, mood } = req.query;

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

    if (mood) {
        result = result.filter(m =>
            m.mood.toLowerCase().includes(mood.toLowerCase())
        );
    }

    res.json({
        message: "Here’s what’s on your menu today 🍴",
        total: result.length,
        data: result
    });
});


app.post('/plans', (req, res) => {
    const { date, mealIds } = req.body;

    if (!date || !mealIds || mealIds.length === 0) {
        return res.status(400).json({
            message: "Please pick a date and at least one meal 📅"
        });
    }

    const selectedMeals = meals.filter(m =>
        mealIds.includes(m.id)
    );

    const newPlan = {
        id: plans.length + 1,
        date,
        meals: selectedMeals,
        createdAt: new Date()
    };

    plans.push(newPlan);

    res.status(201).json({
        message: "📅 Your meal plan is ready! Stay consistent 💪",
        plan: newPlan
    });
});


app.get('/plans', (req, res) => {
    res.json({
        message: "Here are your meal plans 🗓️",
        total: plans.length,
        data: plans
    });
});


app.get('/summary/:date', (req, res) => {
    const { date } = req.params;

    const plan = plans.find(p => p.date === date);

    if (!plan) {
        return res.status(404).json({
            message: "No meals planned for this day 😢"
        });
    }

    const totalCalories = plan.meals.reduce(
        (sum, m) => sum + m.calories, 0
    );

    res.json({
        date,
        mealsCount: plan.meals.length,
        totalCalories,
        message: "🔥 You're doing great! Keep it up!"
    });
});


app.put('/meals/:id', (req, res) => {
    const meal = meals.find(m => m.id == req.params.id);

    if (!meal) {
        return res.status(404).json({
            message: "Meal not found 😢"
        });
    }

    const { name, calories, category, mood } = req.body;

    if (name) meal.name = name;
    if (calories) meal.calories = calories;
    if (category) meal.category = category;
    if (mood) meal.mood = mood;

    res.json({
        message: "✨ Meal updated successfully!",
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

    const deleted = meals.splice(index, 1);

    res.json({
        message: `🗑️ "${deleted[0].name}" removed from your list`,
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
        message: "📊 Here's your progress overview!"
    });
});


app.listen(PORT, () => {
    console.log(`🚀 MealMate API is running at http://localhost:${PORT}`);
});