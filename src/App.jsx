import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomeScreen from "./HomeScreen";
import ProductScreen from "./ProductScreen";
function App() {
  return (
    <>
      <BrowserRouter>
        <header>
          <Link to="/">amazona</Link>
        </header>
        <main>
          <Routes>
            <Route path="/product/:slug" element={<ProductScreen />} />
            <Route path="/" element={<HomeScreen />} />
          </Routes>
        </main>
      </BrowserRouter>
    </>
  );
}

export default App;
