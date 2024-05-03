import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import { Header } from "./components/Header";
import { Calendar } from "./components/Calendar";
import { Categories } from "./components/Categories";
import { PageNotFound } from "./components/PageNotFound";

function App() {
    return (
        <div className="App">
            <Header />
            <Routes>
                <Route index element={<Navigate to="/calendar" />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="categories" element={<Categories />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </div>
    );
}

export default App;
