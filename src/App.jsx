import React, { useContext } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { LinkContainer } from "react-router-bootstrap";
import { Helmet } from "react-helmet-async";
import { Store } from "./Store";
import Badge from "react-bootstrap/Badge";
import CartScreen from "./screens/CartScreen";
function App() {
  const { state } = useContext(Store);
  const { cart } = state;
  return (
    <>
      <BrowserRouter>
        <div className="d-flex flex-column site-container">
          <header>
            <Helmet>
              <title>Amazona</title>
            </Helmet>
            <Navbar bg="dark" variant="dark">
              <Container>
                <Nav className="ml-auto">
                  <LinkContainer to="/">
                    <Navbar.Brand>amazona</Navbar.Brand>
                  </LinkContainer>
                  <LinkContainer to="/cart">
                    <Nav.Link>
                      <i className="fas fa-shopping-cart"></i> Cart{" "}
                      {cart.cartItems.length > 0 && (
                        <Badge pill bg="danger">
                          {cart.cartItems.reduce((a, c) => a + c.qty, 0)}
                        </Badge>
                      )}
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/signin">
                    <Nav.Link>
                      <i className="fas fa-user"></i> Sign In
                    </Nav.Link>
                  </LinkContainer>
                </Nav>
              </Container>
            </Navbar>
          </header>
          <main className="mt-3">
            <Container>
              <Routes>
                <Route path="/product/:slug" element={<ProductScreen />} />
                <Route path="/" element={<HomeScreen />} />
                <Route path="/cart" element={<CartScreen />} />
              </Routes>
            </Container>
          </main>
          <footer className="text-center">All right reserved.</footer>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
