import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../../store/userSlice";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import Card from "../Card";
import axios from "axios";
const UserEngagement = () => {

      const dispatch = useDispatch();
  const navigate = useNavigate();

  
  const [data, setData] = useState({
    users: null,
    sessions: null,
  });

  const getData = async (entity) => {
    if (token) {
      try {
        const response = await axios.get(
          `/${entity}/${selectedPeriod}?appId=testtest123`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Update the state with the data for the specific entity

        setData((prevData) => ({
          ...prevData,
          [entity]: response.data,
        }));
      } catch (error) {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          console.error("Unauthorized or Forbidden response, logging out.");
          dispatch(logout()); // Log the user out by dispatching the logout action
        }
      }
    } else {
      console.error("No token found, please login.");
    }
  };
  return <div></div>;
};

export default UserEngagement;
