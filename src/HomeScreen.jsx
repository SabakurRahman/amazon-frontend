import React, { useEffect, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import logger from "use-reducer-logger";

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
        dispach({ type: "FETCH_SUCCESS", payload: response.data.products });
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
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className="products">
          {products.map((product) => (
            <div className="product" key={product.slug}>
              <Link to={`/product/${product.slug}`}>
                <img src={product.image} alt={product.name} />
              </Link>
              <div className="product-info">
                <Link to={`/product/${product.slug}`}>
                  <p>{product.name}</p>
                </Link>
                <p>
                  <strong>${product.price}</strong>
                </p>
                <button>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
