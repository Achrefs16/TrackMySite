import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../../store/userSlice";
import BarChart from "../charts/BarChart";
import Card from "../Card";
import axios from "axios";
import Periode from "../Overview/Periode";
import AreaChart from "../charts/AreaChart";
const UserEngagement = () => {
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [returning, setReturning] = useState(null);
  const [newUser, setNewUser] = useState(null);
  const [TotalUser, setTotalUser] = useState(null);
  const [userLoyaltyData, setUserLoyaltyData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("year");
  const handleChange = async (event) => {
    setSelectedPeriod(event.target.value);
  };
  const selectedWebsite = useSelector(
    (state) => state.website.selectedWebsite.appId
  );
  useEffect(() => {
    const getData = async () => {
      if (token) {
        try {
          const TotalUsers = await axios.get(
            `/totalvisitor/${selectedPeriod}?appId=${selectedWebsite}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(TotalUsers.data);
          setData(TotalUsers.data);
          setTotalUser(TotalUsers.data.totalVisitors.TotalCount);
          const Newusers = await axios.get(
            `/newusers?appId=${selectedWebsite}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setNewUser(Newusers.data.NewUsers);
          const Retusers = await axios.get(
            `/returningusers?appId=${selectedWebsite}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(Retusers.data);
          setReturning(Retusers.data.ReturningUsers);

          const lousers = await axios.get(
            `/userloyalty?appId=${selectedWebsite}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const dataObject = lousers.data.UserLoyalty;
          const transformedData = Object.entries(dataObject).map(
            ([name, value]) => ({ name, value })
          );

          setUserLoyaltyData(transformedData);
        } catch (error) {
          if (
            error.response &&
            (error.response.status === 401 || error.response.status === 403)
          ) {
            console.error("Unauthorized or Forbidden response, logging out.");
            dispatch(logout());
          }
        }
      } else {
        dispatch(logout());
      }
    };
    getData();
  }, [selectedPeriod, token]);

  const formattedDataUser =
    (data &&
      data.totalVisitors?.Breakdown.map((item) => ({
        name: `${item.SubInterval}`,
        Count: item.Count,
      }))) ||
    [];
  const categories = formattedDataUser.map((item) => item.name);
  const seriesData = [
    {
      name: "User Count",
      data: formattedDataUser.map((item) => item.Count),
    },
  ];

  const seriesb = [
    {
      name: "User Count",
      data: userLoyaltyData.map((item) => item.value),
    },
  ];
  const labelsb = userLoyaltyData.map((item) => item.name);

  return (
    <>
      {data && (
        <div className="pt-4">
          <div className="  bg-white pt-2  rounded-md border border-gray-300 w-fit mx-auto pr-3 ">
            <div className="flex justify-between">
              <h1 className="text-gray-700 font-semibold ml-4">Users</h1>
              <h1 className="text-gray-700 font-semibold ml-4">{TotalUser}</h1>
              <Periode
                selectedPeriod={selectedPeriod}
                handleChange={handleChange}
              />
            </div>
            <AreaChart
              series={seriesData}
              categories={categories}
              width={800}
              height={200}
            />
          </div>

          <div className="flex gap-4  justify-center mt-4 ">
            <div className="  bg-white pt-2  rounded-md border border-gray-300 w-fit ">
              <h1 className="text-gray-700 font-semibold ml-4">
                Users Loyalty
              </h1>
              <BarChart
                series={seriesb}
                categories={labelsb}
              />
            </div>

            <div className="  ">
              <div className="mb-4">
                <Card
                  content={"New Users"}
                  count={newUser}
                />
              </div>
              <Card
                content={"Returning Users"}
                count={returning}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserEngagement;
