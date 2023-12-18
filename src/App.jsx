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
import SigninScreen from "./screens/SigninScreen";
import NavDropdown from "react-bootstrap/NavDropdown";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShippingAddressScreen from "./screens/ShippingAddressScreen";
import SignupScreen from "./screens/SignupScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";

function App() {
  const { state, dispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const logoutHandler = () => {
    dispatch({ type: "USER_LOGOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");

    console.log("logout");
  };
  return (
    <>
      <BrowserRouter>
        <div className="d-flex flex-column site-container">
          <ToastContainer position="bottom-center" limit={1} />
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
                  {userInfo ? (
                    <NavDropdown title={userInfo.user.name} id="username">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Item onClick={logoutHandler}>
                        Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                  ) : (
                    <LinkContainer to="/signin">
                      <Nav.Link>
                        <i className="fas fa-user"></i> Sign In
                      </Nav.Link>
                    </LinkContainer>
                  )}
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
                <Route path="/shipping" element={<ShippingAddressScreen />} />
                <Route path="/signin" element={<SigninScreen />} />
                <Route path="/signup" element={<SignupScreen />} />
                <Route path="/placeorder" element={<PlaceOrderScreen />} />
                <Route path="/order/:id" element={<OrderScreen />} />
                <Route
                  path="/payment"
                  element={<PaymentMethodScreen />}
                ></Route>
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
