class TaskListResponse {
    taskList;
    error;

    constructor({ taskList, error }) {
        this.taskList = taskList
        this.error = error;
    }
}

module.exports = { TaskListResponse }