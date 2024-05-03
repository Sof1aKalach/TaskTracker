import { format, toDate } from "date-fns";
import { useEffect, useMemo, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"

export const TaskForm = ({ taskModified, show, save, close }) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [task, setTask] = useState({
        Name: "",
        DeadlineDate: today,
        DeadlineTime: "08:00",
        Status: "ASSIGNED",
        Priority: "NO"
    })

    const [categoryList, setCategoryList] = useState([])

    useEffect(() => {
        if (show) {
            fetch(`${process.env.REACT_APP_API_URL}/category/get`)
                .then(r => {
                    r.json().then(response => {
                        if (response.error)
                            alert(response.error)
                        else {
                            setCategoryList(response)
                        }
                    })
                })
                .catch(error => {
                    alert(error)
                })
        }
    }, [show])

    useEffect(() => {
        if (taskModified)
            setTask(taskModified)
    }, [taskModified])

    useEffect(() => {
        if (!task.Category?.Name && categoryList.length > 0)
            task.Category = categoryList[0]
    }, [categoryList, task])

    const deadlineTimeList = useMemo(() => {
        let times = []
        Array(24).keys().forEach(hour => {
            Array(12).keys().forEach(minute => {
                times.push(`${("00" + hour).slice(-2)}:${("00" + minute * 5).slice(-2)}`)
            })
        })
        return times
    }, [])

    const statusList = ["ASSIGNED", "IN PROGRESS", "COMPLETED"]
    const priorityList = ["NO", "LOW", "HIGH"]

    const handleDeadlineDate = (e) => {
        e.preventDefault()

        let date = e.target.value === '' ? today : toDate(e.target.value)
        setTask(state => ({ ...state, DeadlineDate: date }))
    }

    return (
        <Modal show={show} onHide={close}>
            <Modal.Header closeButton>
                <Modal.Title>{task.TaskId ? "Modify Task" : "Add Task"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={e => { e.preventDefault(); save(task) }}>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control autoFocus required={true} value={task.Name} onChange={e => setTask(state => ({ ...state, Name: e.target.value }))} />
                        <Form.Label className="mt-3">Description</Form.Label>
                        <Form.Control value={task.Description} onChange={e => setTask(state => ({ ...state, Description: e.target.value }))} as="textarea" rows={3} />
                        <div className="row p-0 m-0">
                            <div className="col-6 ps-0">
                                <Form.Label className="mt-3">Deadline Date</Form.Label>
                                <Form.Control type="Date" required={true} value={format(task.DeadlineDate, "yyyy-MM-dd")}
                                    onChange={e => handleDeadlineDate(e)}
                                />
                            </div>
                            <div className="col-6 pe-0">
                                <Form.Label className="mt-3">Time</Form.Label>
                                <Form.Select value={task.DeadlineTime} onChange={e => setTask(state => ({ ...state, DeadlineTime: e.target.value }))}>
                                    {
                                        deadlineTimeList.map(time => <option key={time} value={time}>{time}</option>)
                                    }
                                </Form.Select>
                            </div>
                        </div>
                        <div className="row p-0 m-0">
                            <div className="col-6 ps-0">
                                <Form.Label className="mt-3">Status</Form.Label>
                                <Form.Select value={task.Status} onChange={e => setTask(state => ({ ...state, Status: e.target.value }))}>
                                    {
                                        statusList.map(status => <option key={status} value={status}>{status}</option>)
                                    }
                                </Form.Select>
                            </div>
                            <div className="col-6 pe-0">
                                <Form.Label className="mt-3">Priority</Form.Label>
                                <Form.Select value={task.Priority} onChange={e => setTask(state => ({ ...state, Priority: e.target.value }))}>
                                    {
                                        priorityList.map(priority => <option key={priority} value={priority}>{priority}</option>)
                                    }
                                </Form.Select>
                            </div>
                        </div>
                        <Form.Label className="mt-3">Category</Form.Label>
                        <Form.Select required value={task.Category} onChange={e => setTask(state => ({ ...state, Category: e.target.value }))}>
                            {
                                categoryList.map(category => <option key={category.Name} value={category}>{category.Name}</option>)
                            }
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={close}>
                    Close
                </Button>
                <Button variant="primary" onClick={e => save(task)}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    )
}