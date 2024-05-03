const express = require("express");
const { toDate, isDate, isMonday, isSunday } = require("date-fns");
const { TaskListResponse } = require("../data-transfer-layer/task-response");
const { taskDAO } = require("../data-access-layer/task.dao");
const { categoryDAO } = require("../data-access-layer/category.dao");

const router = express.Router();

router.get("/get-by-period", async (req, res) => {
    const { from, to } = req.query;
    try {
        const weekStart = toDate(from)
        const weekEnd = toDate(to)

        // if provided [from] or [to] date is not valid date
        if (!isDate(weekStart) && !isDate(weekEnd)) {
            res.send(new TaskListResponse({ error: "Invalid period" }))
            return;
        }

        // if provided [from] and [to] dates are valid week start and end
        if (!isMonday(weekStart) || !isSunday(weekEnd)) {
            res.send(new TaskListResponse({ error: "Period must be from Monday to Sunday" }))
            return;
        }

        const tasks = await taskDAO.getForWeek(weekStart, weekEnd)
        res.json(tasks);
    } catch (error) {
        res.send(new TaskListResponse({ error: "Failed to get tasks for given period" }))
    }
});

router.post("/create", async (req, res) => {
    try {
        if(!req.body.Name || req.body.Name === "")
        {
            res.send(new TaskListResponse({ error: "Name is mandatory" }))
            return;
        }
        if(!req.body.DeadlineDate || req.body.DeadlineDate === "")
        {
            res.send(new TaskListResponse({ error: "Deadline date is mandatory" }))
            return;
        }
        if(!req.body.DeadlineTime && req.body.DeadlineTime === "")
        {
            res.send(new TaskListResponse({ error: "Deadline time is mandatory" }))
            return;
        }
        if(!["ASSIGNED", "IN PROGRESS", "COMPLETED"].includes(req.body.Status))
        {
            res.send(new TaskListResponse({ error: "Invalid status" }))
            return;
        }
        if(!["NO", "LOW", "HIGH"].includes(req.body.Priority))
        {
            res.send(new TaskListResponse({ error: "Invalid priority" }))
            return;
        }

        const category = await categoryDAO.getByName(req.body.Category?.Name)
        if (!category) {
            res.send(new TaskListResponse({ error: "Category not found" }))
            return;
        }

        const task = await taskDAO.create({ ...req.body, Category: category })
        res.send(task);
    } catch (error) {
        res.send(new TaskListResponse({ error: "Failed to create a task" }))
    }
});

router.put("/update", async (req, res) => {
    try {
        const task = await taskDAO.update(req.body)
        res.send(task);
    } catch (error) {
        res.send(new TaskListResponse({ error: "Failed to update the task" }))
    }
});

module.exports = router;