import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Rating from "./Rating";
import axios from "axios";
import { Store } from "../Store";

export default function Products(props) {
  const { product } = props;
  const { state, dispatch } = useContext(Store);
  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.id === product.id);
    const qty = existItem ? existItem.qty + 1 : 1;
    const response = await axios.get(
      `http://localhost:8000/api/products/${product.id}`
    );
    console.log(response.data.countInStoke < qty);
    if (response.data.countInStoke < qty) {
      console.log("Product is out of stock");
      alert("Sorry. Product is out of stock");
      return;
    }
    dispatch({
      type: "CART_ADD_ITEM",
      payload: {
        ...product,
        qty,
      },
    });
  };

  return (
    <Card className="product">
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="cart-img-top" alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title> {product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>${product.price}</Card.Text>
        {product.countInStoke > 0 ? (
          <Button onClick={() => addToCartHandler(product)}>Add To cart</Button>
        ) : (
          <Button varient="light" disabled>
            Out of Stock
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
