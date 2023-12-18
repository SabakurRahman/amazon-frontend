import React, { useContext, useEffect, useReducer } from "react";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getErrorMessage } from "../util";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Store } from "../Store";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "REQUEST":
      return { ...state, loading: true, error: "" };
    case "SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function OrderScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const param = useParams();
  const { id } = param;
  console.log(id);
  const [{ loading, error, order }, dispatchs] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });

  const payOrderHandler = async () => {
    const response = await axios.post(
      `http://localhost:8000/api/create-payment`,
      {
        headers: {
          "Content-Type": "application/json",
          // Add other headers as needed
        },
        body: JSON.stringify({
          amount: 100, // Replace with the actual amount
          name: "John Doe", // Replace with the actual customer name
        }),
      }
    );

    const data = await response.json();
    console.log(data);
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatchs({ type: "REQUEST" });
        const { data } = await axios.get(
          `http://localhost:8000/api/order/${id}`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        dispatchs({ type: "SUCCESS", payload: data });
      } catch (err) {
        dispatchs({
          type: "FAIL",
          payload: getErrorMessage(err),
        });
      }
    };
    if (!userInfo) {
      navigate("/signin");
    }
    if (!order.id || (order.id && order.id !== id)) {
      fetchOrder();
    }
  }, [userInfo, id, navigate]);

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Order</title>
      </Helmet>
      <h1>Invoice:{order.order.invoice_no}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name:</strong>
                {order.order.order_address.name}
                <br />
                <strong>Address:</strong>
                {order.order.order_address.address},
                {order.order.order_address.city},
                {order.order.order_address.post_code},
                {order.order.order_address.country},
              </p>
              {order.order.order_status == 1 ? (
                <MessageBox variant="success">
                  Delivered at {order.order.delivered_at}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Delivered</MessageBox>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment</h2>
              <p>
                <strong>Method:</strong>
                {order.order.payment_method}
              </p>
              {order.order.payment_status == 1 ? (
                <MessageBox variant="success">
                  Paid at {order?.order.paid_at}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Paid</MessageBox>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.order.order_items.length === 0 ? (
                <MessageBox>Order is empty</MessageBox>
              ) : (
                <ListGroup variant="flush">
                  {order.order.order_items.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.product_image}
                            alt={item.product_name}
                            fluid
                            rounded
                          ></Image>
                        </Col>
                        <Col>
                          <Link
                            to={`/product/${item.slug}`}
                            style={{ textDecoration: "none" }}
                          >
                            {item.product_name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.product_quantity} x ${item.product_price} = $
                          {item.product_quantity * item.product_price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>${order.order.total_price}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${order.order.shipping_price}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${order.order.tax_price}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>
                    <strong>${order.order.total_price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <MessageBox variant="danger">{error}</MessageBox>}
              </ListGroup.Item>
              <ListGroup.Item>
                {loading && <LoadingBox></LoadingBox>}
              </ListGroup.Item>
              {!order.order.payment_status ? (
                <Button
                  type="button"
                  className="btn-block"
                  onClick={payOrderHandler}
                >
                  Pay Now
                </Button>
              ) : (
                ""
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
