import { Badge, Button } from "react-bootstrap"
import { Task } from "./Task"
import { useEffect, useState } from "react"
import { addDays, format, isSameDay, isToday, startOfWeek } from "date-fns"
import { TaskForm } from "./TaskForm"
import { Notifier } from "./Notifier"

export const Calendar = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [week, setWeek] = useState({
        startDate: startOfWeek(today, { weekStartsOn: 1 })
    })
    const [tasks, setTasks] = useState([])
    const [showTaskDialog, setShowTaskDialog] = useState(false)
    const [showNotifier, setShowNotifier] = useState(false)
    const [notifierTitle, setNotiferTitle] = useState(false)
    const [notifierMessage, setNotiferMessage] = useState(false)
    const [refreshTime, setRefreshTime] = useState(new Date())
    const [taskModified, setTaskModified] = useState()

    useEffect(() => {
        const query = `from=${format(week.startDate, "yyyy-MM-dd")}&to=${format(addDays(week.startDate, 6), "yyyy-MM-dd")}`
        fetch(`${process.env.REACT_APP_API_URL}/task/get-by-period?${query}`)
            .then(r => {
                r.json().then(response => {
                    if (response.error) {
                        notify("Error", response.error)
                        setTasks([])
                    }
                    else
                        setTasks(response)
                })
            })
            .catch(error => {
                notify("Error", error)
                setTasks([])
            })
    }, [setTasks, week.startDate, refreshTime])

    const getDayData = (day) => {
        const date = addDays(week.startDate, day)
        return (
            <div key={day} className={`col-7-grid p-1 border border-1 ${isToday(date) ? "bg-info-subtle" : ""}`}>
                <div className="text-center border-bottom border-1">{format(date, "dd.MM.yyyy")}</div>
                <div className="text-center border-bottom border-1 mb-2">{format(date, "cccc")}</div>
                {
                    tasks.filter(task => isSameDay(date, task.DeadlineDate)).map(task =>
                        <Task key={task.TaskId} task={task} click={task => handleTaskEdit(task)} />
                    )
                }
            </div>
        )
    }

    const handleMoveDays = (e, days) => {
        e.preventDefault()
        setWeek(state => ({
            ...state,
            startDate: addDays(week.startDate, days)
        }))
    }

    const handleToday = (e) => {
        e.preventDefault()
        setWeek(state => ({
            ...state,
            startDate: startOfWeek(today, { weekStartsOn: 1 })
        }))
    }

    const handleAddTask = (e) => {
        e.preventDefault()

        setTaskModified({
            Name: "",
            Desciption: "",
            DeadlineDate: today,
            DeadlineTime: "08:00",
            Status: "ASSIGNED",
            Priority: "NO"
        })
        setShowTaskDialog(true)
    }

    const handleTaskEdit = (task) => {
        setTaskModified(task)
        setShowTaskDialog(true)
    }

    const notify = (title, message) => {
        setShowNotifier(true)
        setNotiferTitle(title)
        setNotiferMessage(message)
    }

    const saveTask = (task) => {
        const action = task.TaskId ? "update" : "create"
        const method = task.TaskId ? "PUT" : "POST"
        fetch(`${process.env.REACT_APP_API_URL}/task/${action}`, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...task, DeadlineDate: format(task.DeadlineDate, "yyyy-MM-dd") })
        })
            .then(r => {
                r.json().then(response => {
                    if (response.error) {
                        notify("Error", response.error)
                    }
                    else {
                        setShowTaskDialog(false)
                        notify("Info", "Task has been created successfully")
                        setRefreshTime(new Date())
                    }
                })
            })
            .catch(error => {
                notify("Error", error)
            })
    }

    return (
        <>
            <div className="row m-0 mt-3 p-0">
                <div className="col-4">
                    <Button className="mx-2" onClick={e => handleMoveDays(e, -7)}>{"<"}</Button>
                    <Button className="mx-2" onClick={e => handleToday(e)}>Today</Button>
                    <Button className="mx-2" onClick={e => handleMoveDays(e, 7)}>{">"}</Button>
                    <Button className="ms-4 btn-info" onClick={e => handleAddTask(e)}>+ Add Task</Button>
                </div>
                <h2 className="text-center col-4">Task Tracker Calendar</h2>
                <div className="col-4 text-end">
                    <span>PRIORITY: </span>
                    <Badge className="mx-2" bg="danger">HIGH</Badge>
                    <Badge className="mx-2" bg="info">LOW</Badge>
                    <Badge className="mx-2" bg="primary">NO</Badge>
                </div>
            </div>
            <div
                className="p-0 py-1 m-2 bg-info-subtle text-center"
                style={{ fontSize: "14px" }}>{format(week.startDate, "PPP")} - {format(addDays(week.startDate, 7), "PPP")}
            </div>
            <div className="task-calendar row p-0 m-2 bg-light">
                {
                    [0, 1, 2, 3, 4, 5, 6].map(day => getDayData(day))
                }
            </div>
            <TaskForm
                key={taskModified?.TaskId ?? 0}
                taskModified={taskModified}
                show={showTaskDialog}
                save={task => saveTask(task)}
                close={e => setShowTaskDialog(false)}
            />
            <Notifier
                show={showNotifier}
                close={e => setShowNotifier(false)}
                title={notifierTitle}
                message={notifierMessage}
            />
        </>
    )
}