// AppRouter.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Home from "./Pages/Home/Home";
import Configuration from "./Pages/Configuration/Configuration";
import Code from "./Pages/Code/Code";
import Accounts from "./Pages/Accounts/Accounts";
import Verify from "./Pages/Verify/Verify";
import Newpass from "./Pages/Newpass/Newpass";
import Stats from "./Pages/Stats/Stats";

function AppRouter() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />  
                <Route path="/login" element={<Login />} />  
                <Route path="/configuration" element={<Configuration />} />
                <Route path="/code" element={<Code />} />
                <Route path="/configuration" element={<Configuration />} />  
                <Route path="/accounts" element={<Accounts />} />  
                <Route path="/verify" element={<Verify />} />  
                <Route path="/newpass" element={<Newpass />} />  
                <Route path="/stats" element={<Stats />} />  
            </Routes>
        </Router>
    );
}

export default AppRouter;