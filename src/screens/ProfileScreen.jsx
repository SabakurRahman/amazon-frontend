import React, { useContext, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import { Store } from "../Store";
import Button from "react-bootstrap/Button";
import { getErrorMessage } from "../util";
import axios from "axios";
import { toast } from "react-toastify";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, userInfo: action.payload };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false, error: action.payload };
    default:
      return state;
  }
};

export default function ProfileScreen() {
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setconfirm_password] = useState("");

  const { loadingUpdate, error, orders } = useReducer(reducer, {
    loadingUpdate: false,
    orders: [],
    error: "",
  });

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        "http://localhost:8000/api/user/profile",
        {
          name,
          email,
          password,
          password_confirmation,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Profile updated successfully");
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL", payload: getErrorMessage(error) });
      toast.error(getErrorMessage(error));
    }
  };
  return (
    <div className="container small-container">
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <h1 className="my-3">Profile</h1>
      <Form onSubmit={formSubmitHandler}>
        <Form.Group controlId="name">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Full Name"
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="confirm_password">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setconfirm_password(e.target.value)}
            placeholder="Enter confirm password"
          ></Form.Control>
        </Form.Group>
        <Button className="mt-2" type="submit" variant="primary">
          Update
        </Button>
      </Form>
    </div>
  );
}
