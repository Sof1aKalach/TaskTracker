import { Card } from "react-bootstrap"

export const Category = ({ category, click }) => {
    return (
        <Card key={category.Name} onClick={e => click(category)} className="category-card text-white bg-info" style={{ width: "200px", height: "100px" }}>
            <div className="align-self-center" style={{ display: "flex", alignItems: "center", height: "100px", fontSize: "16px" }}>
                {category.Name}
            </div>
        </Card>
    )
}