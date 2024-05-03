const express = require("express");
const { TaskListResponse } = require("../data-transfer-layer/task-response");
const { categoryDAO } = require("../data-access-layer/category.dao");

const router = express.Router();

router.get("/get", async (req, res) => {
    try {
        const categories = await categoryDAO.getAll()
        res.json(categories);
    } catch (error) {
        res.send(new TaskListResponse({ error: "Failed to get categories" }))
    }
});

router.post("/create", async (req, res) => {
    const { Name } = req.body
    try {
        // check for category name
        if (!Name || Name == "") {
            res.send(new TaskListResponse({ error: "Category name is required" }))
            return;
        }

        // check for unique category name
        const existingCategory = await categoryDAO.getByName(Name)
        if (existingCategory) {
            res.send(new TaskListResponse({ error: "Category already exists" }))
            return;
        }

        // create category
        const newCategory = await categoryDAO.create({ Name: Name })
        res.send(newCategory);
    } catch (error) {
        res.send(new TaskListResponse({ error: "Failed to create a category" }))
    }
});

router.put("/update", async (req, res) => {
    const { _id, Name } = req.body
    try {
        // not existing category
        if (!_id) {
            res.send(new TaskListResponse({ error: "Category not exists" }))
            return;
        }
        // check for category name
        if (!Name || Name == "") {
            res.send(new TaskListResponse({ error: "Category name is required" }))
            return;
        }
        // check for unique category name
        const existingCategory = await categoryDAO.getByName(Name)
        if (existingCategory && existingCategory._id !== _id) {
            res.send(new TaskListResponse({ error: "Category already exists" }))
            return;
        }

        // create category
        const newCategory = await categoryDAO.update(req.body)
        res.send(newCategory);
    } catch (error) {
        res.send(new TaskListResponse({ error: "Failed to update the category" }))
    }
});

module.exports = router;