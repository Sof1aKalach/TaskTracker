const { addDays, compareAsc } = require('date-fns');
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const schema = new Schema({
    TaskId: Number,
    Name: String,
    Description: String,
    Status: String,
    DeadlineDate: Date,
    DeadlineTime: String,
    Priority: String,
    Category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
})

class TaskDAO {
    model = null

    createSchema = () => {
        schema.plugin(AutoIncrement, { inc_field: "TaskId" })
        this.model = mongoose.model("Task", schema)
    }

    getByTaskId = async (taskId) => {
        return await this.bookingModel.findOne({ TaskId: taskId }).populate("Category");
    }

    getForWeek = async (weekStart, weekEnd) => {
        const allTasks = await this.model.find({}).populate("Category")
        const weekTasks = allTasks.filter(task => task.DeadlineDate >= weekStart && task.DeadlineDate < addDays(weekEnd, 1))

        // sort by date, time, priority (HIGH, LOW, NO)
        weekTasks.sort((a, b) => {
            const dateComparision = compareAsc(a.DeadlineDate, b.DeadlineDate)
            if (dateComparision === 0) {
                const atime = parseInt(a.DeadlineTime.replace(":", ""))
                const btime = parseInt(b.DeadlineTime.replace(":", ""))
                if (atime > btime) return 1
                if (atime < btime) return -1
                if (atime === btime) {
                    if (a.Priority === b.Priority) return 0
                    if (a.Priority == "HIGH") return -1
                    if (b.Priority == "HIGH") return 1
                    if (a.Priority == "LOW") return -1
                    if (b.Priority == "LOW") return 1
                    return 0
                }
            }
            else
                return dateComparision
        })
        return weekTasks;
    }

    update = async (task) => {
        return await this.model.findOneAndUpdate({ _id: task._id }, { ...task }, { new: true }).populate("Category");
    }

    create = async (task) => {
        return await this.model.create(task)
    }
}

module.exports = { taskDAO: new TaskDAO() }