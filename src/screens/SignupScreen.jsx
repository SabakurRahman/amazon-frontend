import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import axios from "axios";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getErrorMessage } from "../util";

export default function SignupScreen() {
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setconfirm_password] = useState("");
  const [name, setName] = useState("");
  const { state, dispatch } = useContext(Store);
  const navigate = useNavigate();
  useEffect(() => {
    if (state.userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, state.userInfo]);
  const formSubmitHandaller = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/user/signup",
        {
          name,
          email,
          password,
          confirm_password,
        }
      );
      console.log(data); // Check the response data
      dispatch({ type: "USER_SIGNUP", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };
  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <h1 className="my-3">Sign In</h1>
      <Form onSubmit={formSubmitHandaller}>
        <Form.Group controlId="name">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password </Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="confirm_password">
          <Form.Label>Conform Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setconfirm_password(e.target.value)}
            placeholder="Enter Conform password"
            required
          ></Form.Control>
        </Form.Group>
        <Button className="mt-2" type="submit" variant="primary">
          Sign Up
        </Button>
        <div className="my-3">
          Alredy Have An Account?{" "}
          <Link to={`/signin?redirect=${redirect}`}>Sigin-In</Link>
        </div>
      </Form>
    </Container>
  );
}
