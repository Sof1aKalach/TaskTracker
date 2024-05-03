import { Nav, Navbar } from "react-bootstrap"
import { useLocation } from "react-router-dom"

export const Header = () => {
    const location = useLocation()
    return (
        <Navbar className="bg-primary m-0 p-0" variant="dark">
            <Nav className="w-100 justify-content-center fs-4">
                <Nav.Link active={location.pathname.startsWith("/calendar")} href="/calendar">Calendar</Nav.Link>
                <Nav.Link active={location.pathname.startsWith("/categories")} href="/categories">Categories</Nav.Link>
            </Nav>
        </Navbar>
    )
}