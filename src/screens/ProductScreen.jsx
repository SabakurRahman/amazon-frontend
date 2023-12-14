import React, { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Rating from "../components/Rating";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import { Helmet } from "react-helmet-async";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return {
        ...state,
        loading: true,
      };
    case "FETCH_SUCCESS":
      return {
        loading: false,
        product: action.payload,
        error: "",
      };
    case "FETCH_ERROR":
      return {
        loading: false,
        product: [],
        error: "Something went wrong!",
      };
    default:
      return state;
  }
};

export default function ProductScreen() {
  const param = useParams();
  const { slug } = param;

  const [{ loading, error, product }, dispach] = useReducer(reducer, {
    loading: true,
    product: [],
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      dispach({ type: "FETCH_REQUEST" });
      try {
        const response = await axios.get(
          `http://localhost:8000/api/product/slug/${slug}`
        );
        dispach({ type: "FETCH_SUCCESS", payload: response.data });
      } catch (error) {
        dispach({ type: "FETCH_ERROR" });
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [slug]);

  return loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img
            className="img-large"
            src={product.image}
            alt={product.name}
          ></img>
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
            <ListGroup.Item>Description: {product.description}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong>${product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      <strong>
                        {product.countInStoke > 0 ? (
                          <Badge bg="success">In Stock</Badge>
                        ) : (
                          <Badge bg="danger">Out Of Stock</Badge>
                        )}
                      </strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStoke > 0 && (
                  <ListGroup.Item>
                    <button
                      className="btn btn-primary btn-block"
                      disabled={product.countInStock === 0}
                    >
                      Add To Cart
                    </button>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
