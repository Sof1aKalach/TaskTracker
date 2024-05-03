import { Card } from "react-bootstrap"

export const Task = ({ task, click }) => {
    let styleClass = ""
    switch (task.Priority) {
        case "HIGH":
            styleClass = "text-white bg-danger"
            break;
        case "LOW":
            styleClass = "text-white bg-info"
            break;
        default:
            styleClass = "text-white bg-primary"
            break;
    }

    if(task.Status === "COMPLETED")
        styleClass = "bg-light"
    
    return (
        <Card className={`task-card mb-2 ${styleClass}`} onClick={e => click(task)}>
            <Card.Body className="p-1" style={{ fontSize: "11px" }} title={task.Description}>
                <div className="flex justify-content-between">
                    <span className="">{task.DeadlineTime}</span>
                    <span className="float-end">{task.Status}</span>
                </div>
                <div className="border-top border-1 py-1 text-center" style={{ fontSize: "12px" }}>{task.Name}</div>
                <div className="border-top border-1 pt-1 fst-italic">{task.Category?.Name}</div>
            </Card.Body>
        </Card>
    )
}