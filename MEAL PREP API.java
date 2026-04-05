const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let meals = [
    { id: 1, name: "Grilled Chicken", calories: 500 },
    { id: 2, name: "Veggie Salad", calories: 300 }
];

app.get('/', (req, res) => {
    res.send("🍱 Meal Prep API is running!");
});


app.get('/meals', (req, res) => {
    res.json(meals);
});


app.get('/meals/:id', (req, res) => {
    const meal = meals.find(m => m.id == req.params.id);
    if (!meal) {
        return res.status(404).json({ message: "Meal not found" });
    }
    res.json(meal);
});


app.post('/meals', (req, res) => {
    const { name, calories } = req.body;

    if (!name || !calories) {
        return res.status(400).json({
            message: "Please provide name and calories"
        });
    }

    const newMeal = {
        id: meals.length + 1,
        name,
        calories
    };

    meals.push(newMeal);
    res.status(201).json(newMeal);
});


app.put('/meals/:id', (req, res) => {
    const meal = meals.find(m => m.id == req.params.id);

    if (!meal) {
        return res.status(404).json({ message: "Meal not found" });
    }

    const { name, calories } = req.body;

    if (name) meal.name = name;
    if (calories) meal.calories = calories;

    res.json(meal);
});

app.delete('/meals/:id', (req, res) => {
    const index = meals.findIndex(m => m.id == req.params.id);

    if (index === -1) {
        return res.status(404).json({ message: "Meal not found" });
    }

    meals.splice(index, 1);
    res.json({ message: "Meal deleted successfully" });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    {
  "name": "meal-prep-api",
  "version": "1.0.0",
  "description": "All-in-one Meal Prep API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
});