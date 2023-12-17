import React, { useContext, useEffect, useReducer } from "react";
import CheckOutSteps from "../components/CheckOutSteps";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { getErrorMessage } from "../util";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingBox from "../components/LoadingBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "REQUEST":
      return { ...state, loading: true };
    case "SUCCESS":
      return { ...state, loading: false };
    case "FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function PlaceOrderScreen() {
  const { state, dispatch } = useContext(Store);
  const [{ loading, error }, dispatchLocal] = useReducer(reducer, {
    loading: false,
    error: "",
  });
  const { cart, userInfo } = state;
  const navigate = useNavigate();
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.qty * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = round2(
    cart.itemsPrice + cart.shippingPrice + cart.taxPrice
  );

  const palceOrderHandler = async () => {
    dispatchLocal({ type: "REQUEST" });
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/order",
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      console.log(data.order.id);
      dispatchLocal({ type: "SUCCESS" });
      dispatch({ type: "CART_CLEAR" });
      localStorage.removeItem("cartItems");
      navigate(`/order/${data.order.id}`);
    } catch (error) {
      dispatchLocal({ type: "FAIL", payload: getErrorMessage(error) });
      toast.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart, navigate]);

  return (
    <div>
      <CheckOutSteps step1 step2 step3 step4 />
      <Helmet>
        <title>Palce Order</title>
      </Helmet>
      <h1>Preview Order</h1>
      <Row>
        <Col md={8}>
          <Card className="mb - 3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {cart.shippingAddress.fullName} <br />
                <strong>Address:</strong> {cart.shippingAddress.address},
                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
                {cart.shippingAddress.country}
              </Card.Text>
              <Link to="/shipping">Edit</Link>
            </Card.Body>
          </Card>
          <Card className="mb - 3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {cart.paymentMethod}
              </Card.Text>
              <Link to="/payment">Edit</Link>
            </Card.Body>
          </Card>
          <Card className="mb - 3">
            <Card.Body>
              <Card.Title>Order Items</Card.Title>
              <Card.Text>
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item.id}>
                    <Row key={item.id}>
                      <Col md={1}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        />
                      </Col>
                      <Col>
                        <Link to={`/product/${item.id}`}>{item.name}</Link>
                      </Col>
                      <Col md={4}>
                        {item.qty} x ${item.price} = ${item.qty * item.price}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </Card.Text>
              <Link to="/cart">Edit</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <strong>Order Total</strong>
                  </Col>
                  <Col>
                    <strong>${cart.totalPrice}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              <Button
                type="button"
                className="btn-block"
                disabled={cart.cartItems.length === 0}
                onClick={palceOrderHandler}
              >
                Place Order
              </Button>
              {loading && <LoadingBox />}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
