import { CategoryForm } from "./CategoryForm"
import { useEffect, useState } from "react"
import { Notifier } from "./Notifier"
import { Category } from "./Category"

export const Categories = () => {
    const [categories, setCategories] = useState([])
    const [showCategoryDialog, setShowCategoryDialog] = useState(false)
    const [showNotifier, setShowNotifier] = useState(false)
    const [notifierTitle, setNotiferTitle] = useState(false)
    const [notifierMessage, setNotiferMessage] = useState(false)
    const [refreshTime, setRefreshTime] = useState(new Date())
    const [categoryModified, setCategoryModified] = useState()

    const handleAddCategory = (e) => {
        e.preventDefault()

        setShowCategoryDialog(true)
        setCategoryModified({ Name: "" })
    }

    const handleCategoryEdit = (task) => {
        setCategoryModified(task)
        setShowCategoryDialog(true)
    }

    const notify = (title, message) => {
        setShowNotifier(true)
        setNotiferTitle(title)
        setNotiferMessage(message)
    }

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/category/get`)
            .then(r => {
                r.json().then(response => {
                    if (response.error) {
                        notify("Error", response.error)
                        setCategories([])
                    }
                    else
                        setCategories(response)
                })
            })
            .catch(error => {
                notify("Error", error)
                setCategories([])
            })
    }, [refreshTime])

    const saveCategory = (category) => {
        const action = category._id ? "update" : "create"
        const method = category._id ? "PUT" : "POST"
        fetch(`${process.env.REACT_APP_API_URL}/category/${action}`, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...category })
        })
            .then(r => {
                r.json().then(response => {
                    if (response.error) {
                        notify("Error", response.error)
                    }
                    else {
                        setShowCategoryDialog(false)
                        notify("Info", "Category has been created successfully")
                        setRefreshTime(new Date())
                    }
                })
            })
            .catch(error => {
                notify("Error", error)
            })
    }

    return (
        <div className="flex row p-0 m-3 gap-2 text-center">
            {
                categories.map(category =>
                    <Category key={category._id} category={category} click={category => handleCategoryEdit(category)} />
                )
            }

            <div className="card category-add" onClick={e => handleAddCategory(e)}></div>
            <CategoryForm
                key={categoryModified?._id ?? 0}
                categoryModified={categoryModified}
                show={showCategoryDialog}
                save={category => saveCategory(category)}
                close={e => setShowCategoryDialog(false)}
            />
            <Notifier
                show={showNotifier}
                close={e => setShowNotifier(false)}
                title={notifierTitle}
                message={notifierMessage}
            />
        </div>
    )
}