import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../../store/userSlice";
import Card from "../Card";
import axios from "axios";
import Periode from "./Periode";
import AreaChart from "../charts/AreaChart";

const Start = () => {
  const userDetails = useSelector((state) => state.user.details);
  const selectedWebsite = useSelector(
    (state) => state.website.selectedWebsite.appId
  );
  const [isOpen, setIsOpen] = useState(false);
  const [conversion, setConversion] = useState("");
  const [data, setData] = useState({
    users: null,
    sessions: null,
    events: null,
  });
  const [render, setRender] = useState(false);
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
      getConversion();
    }
  }, [selectedPeriod, token]);

  const getData = async (entity) => {
    if (token) {
      try {
        const response = await axios.get(
          `/${entity}/${selectedPeriod}?appId=${selectedWebsite}`,
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
        setRender(true);
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
  const getConversion = async () => {
    if (token) {
      try {
        const response = await axios.get(
          `/conversion?appId=${selectedWebsite}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setConversion(response.data.Conversion.TotalRevenue);
        setRender(true);
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

  const categories = formattedDataEvent.map((item) => item.name);
  const seriesData = [
    {
      name: "User Count",
      data: formattedDataEvent.map((item) => item.Count),
    },
  ];
  const categoriesU = formattedDataUser.map((item) => item.name);
  const seriesDataU = [
    {
      name: "User Count",
      data: formattedDataUser.map((item) => item.Count),
    },
    {
      name: "User Count",
      data: formattedDataSession.map((item) => item.Count),
    },
  ];
  return (
    <>
      <div className="bg-gray-100   h-5/6">
        <div className="  flex justify-between px-10 pt-4">
          <h1 className=" text-xl text-slate-800 font-bold">Aperçu général</h1>
          <Periode
            selectedPeriod={selectedPeriod}
            handleChange={handleChange}
          />
        </div>
        {render ? (
          <div className=" flex gap-5 w-full justify-center mx-auto ">
            <div className="  bg-white pt-2  rounded-md border border-gray-300 w-fit pr-3 ">
              <h1 className="text-gray-700 font-semibold ml-4 ">
                utilisateurs et sessions
              </h1>
              <AreaChart
                series={seriesDataU}
                categories={categoriesU}
                width={564}
                height={200}
              />
            </div>
            <div className="  bg-white pt-2  rounded-md border border-gray-300 w-fit pr-3 ">
              <h1 className="text-gray-700 font-semibold ml-4">Evénements</h1>
              <AreaChart
                series={seriesData}
                categories={categories}
                width={564}
                height={200}
              />
            </div>
          </div>
        ) : (
          <div>Chargement</div>
        )}
        {data.events && (
          <div className="flex mt-5 w-full justify-center mx-auto gap-5">
            <Card
              content={"Nombre d'utilisateurs"}
              count={data.users.TotalCount}
            />
            <Card
              content={"Nombre des sessions"}
              count={data.sessions.TotalCount}
            />
            <Card
              content={"Total des évènements"}
              count={data.events.TotalCount}
            />
            {conversion && (
              <Card
                content={"Revenu $"}
                count={conversion}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Start;
