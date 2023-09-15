import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./modules/common/Components/Header/Header";
import Boards from "./modules/boards/Components/Boards/Boards";
import BoardDetails from "./modules/boardsDetails/Components/BoardDetails";

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path="/" element={<Navigate to="/boards" />}></Route>
                    <Route path="/boards" element={<Boards />}></Route>
                    <Route path="/boards/:id" element={<BoardDetails />}></Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
