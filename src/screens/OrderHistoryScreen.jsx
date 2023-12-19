import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getErrorMessage } from "../util";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";

const reducer = (state, action) => {
  switch (action.type) {
    case "REQUEST":
      return { ...state, loading: true };
    case "SUCCESS":
      return { ...state, loading: false, orders: action.payload };
    case "FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function OrderHistoryScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: "",
  });
  useEffect(() => {
    if (!userInfo) {
      navigate("/signin");
    }
    const fetchData = async () => {
      try {
        dispatch({ type: "REQUEST" });
        const { data } = await axios.get(
          "http://localhost:8000/api/user/order/history",
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        dispatch({ type: "SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FAIL", payload: getErrorMessage(error) });
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>
      <h1>Order History</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.order.map((order) => (
              <tr key={order.id}>
                <td>{order.invoice_no}</td>
                <td>{order.created_at.substring(0, 10)}</td>
                <td>{order.total_price.toFixed(2)}</td>
                <td>{order.payment_status ? order.paid_at : "No"}</td>
                <td>{order.order_status ? order.delivered_at : "No"}</td>
                <td>
                  <button
                    type="button"
                    className="small"
                    onClick={() => navigate(`/order/${order.id}`)}
                  >
                    Details
                  </button>
                  <button type="button" className="small">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
