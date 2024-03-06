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
import Periode from "./Periode";

const Start = () => {
  const userDetails = useSelector((state) => state.user.details);
  const selectedWebsite = useSelector((state) => state.website.selectedWebsite);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({
    users: null,
    sessions: null,
    events: null,
  });
  const [selectedPeriod, setSelectedPeriod] = useState("year");

  const handleChange = async (event) => {
    setSelectedPeriod(event.target.value);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state) => state.user.token);
  useEffect(() => {
    if (token) {
      ["users", "sessions", "events"].forEach((entity) => getData(entity));
    }
  }, [selectedPeriod, token]);

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
        console.log(response.data);
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

  const formattedDataUser =
    data.users?.Breakdown?.map((item) => ({
      name: `${item.SubInterval}`,
      Count: item.Count,
    })) || [];
  const formattedDataSession =
    data.sessions?.Breakdown?.map((item) => ({
      name: `${item.SubInterval}`,
      Count: item.Count,
    })) || [];
  const formattedDataEvent =
    data.events?.Breakdown?.map((item) => ({
      name: `${item.SubInterval}`,
      Count: item.Count,
    })) || [];
  const mergeDatasets = (dataSession, dataUser) => {
    console.log(dataSession);
    // Create a map to hold the merged data with SubInterval as the key
    const mergedMap = new Map();
    // Add or update event data
    dataUser.forEach(({ name, Count }) => {
      const existing = mergedMap.get(name) || {
        name,
        UserCount: 0,
        SessionCount: 0,
      };
      existing.UserCount = Count;
      mergedMap.set(name, existing);
    });
    // Add or update session data
    dataSession.forEach(({ name, Count }) => {
      const existing = mergedMap.get(name) || {
        name,
        UserCount: 0,
        SessionCount: 0,
      };
      existing.SessionCount = Count;
      mergedMap.set(name, existing);
    });

    // Convert the map to a sorted array
    return Array.from(mergedMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  };

  const mergedData = mergeDatasets(formattedDataSession, formattedDataUser);

  console.log(mergedData);
  return (
    <>
      <div className="bg-gray-100   h-5/6">
        <div className="  flex justify-between px-10 pt-4">
          <h1 className=" text-xl text-slate-800 font-bold">Overview </h1>
          <Periode
            selectedPeriod={selectedPeriod}
            handleChange={handleChange}
          />
        </div>
        {data.users ? (
          <div className=" flex gap-5 w-full justify-center mx-auto ">
            <div className="  bg-white pt-2  rounded-md border border-gray-300 w-fit pr-3 ">
              <h1 className="text-gray-700 font-semibold ml-4 ">
                Users And Sessions
              </h1>
              <LineChart
                width={564}
                height={210}
                data={mergedData}
                className="-ml-4 my-4"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: "11px" }}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: "11px" }}
                  axisLine={false}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="SessionCount"
                  stroke="#201e45"
                  strokeWidth={2}
                  activeDot={{ r: 3, stroke: "#201e45" }}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="UserCount"
                  stroke="#665BFF"
                  strokeWidth={2}
                  activeDot={{ r: 3, stroke: "#665BFF" }}
                  dot={false}
                />

                {/* Remove the second Line component if you don't have a uv dataKey or add another line for different data if needed */}
              </LineChart>
            </div>
            <div className="  bg-white pt-2  rounded-md border border-gray-300 w-fit pr-3 ">
              <h1 className="text-gray-700 font-semibold ml-4">Events</h1>
              <LineChart
                width={564}
                height={210}
                className="-ml-4 my-4"
                data={formattedDataEvent}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: "11px" }}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: "11px" }}
                  axisLine={false}
                />
                <Tooltip />

                <Legend />
                <Line
                  type="monotone"
                  dataKey="Count" // Adjusted to match the key in formattedData
                  stroke="#665BFF"
                  strokeWidth={2}
                  activeDot={{ r: 3, stroke: "#665BFF" }}
                  dot={false}
                />
              </LineChart>
            </div>
          </div>
        ) : (
          <div>Loading</div>
        )}
        {data.events && (
          <div className="flex mt-5 w-full justify-center mx-auto gap-5">
            <Card
              content={"Total users"}
              count={data.users.TotalCount}
            />
            <Card
              content={"Total sessions"}
              count={data.sessions.TotalCount}
            />
            <Card
              content={"Total events"}
              count={data.events.TotalCount}
            />
            <Card
              content={"Coversion $"}
              count={data.events.TotalCount}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Start;
