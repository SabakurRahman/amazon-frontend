import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import logger from "use-reducer-logger";
import Products from "../components/Products";

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
        products: action.payload,
        error: "",
      };
    case "FETCH_ERROR":
      return {
        loading: false,
        products: [],
        error: "Something went wrong!",
      };
    default:
      return state;
  }
};

export default function HomeScreen() {
  //   const [products, setProducts] = useState([]);

  const [{ loading, error, products }, dispach] = useReducer(logger(reducer), {
    loading: true,
    products: [],
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      dispach({ type: "FETCH_REQUEST" });
      try {
        const response = await axios.get("http://localhost:8000/api/products");
        dispach({ type: "FETCH_SUCCESS", payload: response.data });
      } catch (error) {
        dispach({ type: "FETCH_ERROR" });
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  console.log(products);

  return (
    <>
      <h1>Feature Product</h1>

      <div className="products">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <Row>
            {products.map((product) => (
              <Col sm={6} md={4} lg={3} key={product.slug}>
                <Products product={product} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </>
  );
}
