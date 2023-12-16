import React, { useContext } from "react";
import { Store } from "../Store";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MessageBox from "../components/MessageBox";
import ListGroup from "react-bootstrap/ListGroup";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import axios from "axios";

export default function CartScreen() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const updateCartHandaler = async (item, qty) => {
    console.log(qty);
    const response = await axios.get(
      `http://localhost:8000/api/products/${item.id}`
    );
    if (response.data.countInStoke <= 0) {
      window.alert("Sorry, Product is out of stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...item, qty } });
  };

  const removeItemHandaler = (item) => {
    console.log(item);
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };
  const navigate = useNavigate();

  const checkoutHandler = () => {
    navigate("/signin?redirect=shipping");
  };

  return (
    <div>
      <Helmet>Cart</Helmet>
      <h1> Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cart.cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty ! <Link to="/">Go to Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cart.cartItems.map((item) => (
                <ListGroup.Item key={item.id}>
                  <Row>
                    <Col md={4}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail"
                      />
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        variant="light"
                        onClick={() => updateCartHandaler(item, item.qty - 1)}
                        disabled={item.qty === 1}
                      >
                        <i className="fas fa-minus-circle"></i>
                      </Button>{" "}
                      <span>{item.qty}</span>
                      <Button
                        onClick={() => updateCartHandaler(item, item.qty + 1)}
                        variant="light"
                        disabled={item.qty === item.countInStoke}
                      >
                        <i className="fa fa-plus-circle"></i>
                      </Button>{" "}
                    </Col>
                    <Col md={3}>${item.price}</Col>
                    <Col md={2}>
                      <Button onClick={() => removeItemHandaler(item)}>
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <h3>
                  subtotal ({cart.cartItems.reduce((a, c) => a + c.qty, 0)}{" "}
                  items) : $
                  {cart.cartItems.reduce((a, c) => a + c.price * c.qty, 0)}
                </h3>
              </ListGroup>
              <ListGroup.Item>
                <div className="d-grid">
                  <Button
                    type="button"
                    onClick={checkoutHandler}
                    variant="primary"
                    disabled={cart.cartItems.length === 0}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </ListGroup.Item>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
