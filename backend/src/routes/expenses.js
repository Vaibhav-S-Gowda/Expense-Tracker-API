const express = require("express");
const { z } = require("zod");

const authenticate = require("../middleware/auth");

const router = express.Router();

// In-memory storage for expenses
const expenses = [];

// Zod schema validates incoming expenses data
const expenseSchema = z.object({
    amount: z.number().positive(),
    category: z.string().min(1),
    description: z.string().optional().default(""),
    date: z.string().optional().default(() => new
    Date().toISOString().split("T")[0]),
});

router.use(authenticate);

router.get("/", (req, res) => {
    const userExpenses = expenses.filter((e) => e.userId === req.user.id);
    res.json(userExpenses);
});

router.post("/", (req, res) => {
    const result = expenseSchema.safeParse(req.body);
    if(!result.success) {
        return res.status(400).json({ error: result.error.issues });
    }

    const expense = {
        id: Date.now().toString(),
        userId: req.user.id,
        ...result.data,
    };
    expenses.push(expense);
    res.status(201).json(expense);
});

router.put("/:id", (req, res) => {
    const index = expenses.findIndex((e) => e.id === req.params.id && e.userId === req.user.id);
    if (index === -1) {
        return res.status(404).json({ error: "Expense not found."});
    }

    const result = expenseSchema.safeParse(req.body);
    if(!result.success) {
        return res.status(400).json({ error: result.error.issues });
    }

    expenses[index] = { ...expenses[index], ...result.data };
    res.json(expenses[index]);
});

router.delete("/:id", (req, res) => {
    const index = expenses.findIndex((e) => e.id === req.params.id && e.userId === req.user.id);
    if (index === -1) {
        return res.status(404).json({ error: "Expense not found. "});
    }

    const deleted = expenses.splice(index, 1)[0];
    res.json(deleted);
});

module.exports = router;