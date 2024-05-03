import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"

export const CategoryForm = ({ categoryModified, show, save, close }) => {
    const [category, setCategory] = useState({
        Name: ""
    })

    useEffect(() => {
        if (categoryModified)
            setCategory(categoryModified)
    }, [categoryModified])

    return (
        <Modal show={show} onHide={close}>
            <Modal.Header closeButton>
                <Modal.Title>{category._id ? "Modify Category" : "Add Category"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={e => { e.preventDefault(); save(category) }}>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control autoFocus required={true} value={category.Name} onChange={e => setCategory(state => ({ ...state, Name: e.target.value }))} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={close}>
                    Close
                </Button>
                <Button variant="primary" onClick={e => save(category)} type="submit">
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    )
}