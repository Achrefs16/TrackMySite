import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../../store/userSlice";
import HorBarChart from "../charts/HorBarChart";

const Demographic = () => {
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const [userCountsByCountry, setUserCountsByCountry] = useState([]);
  const [userCountsByCity, setUserCountsByCity] = useState([]);
  const selectedWebsite = useSelector(
    (state) => state.website.selectedWebsite.appId
  );
  console.log(userCountsByCountry);
  console.log(userCountsByCity);
  useEffect(() => {
    const getData = async () => {
      if (token) {
        try {
          const response = await axios.get(
            `/geographicdistribution?appId=${selectedWebsite}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Assume response.data.GeographicDistribution is the correct data structure
          const data = response.data.GeographicDistribution;

          // Sort and set User Counts by Country
          const countsByCountry = data.reduce((acc, { country, UserCount }) => {
            acc[country] = (acc[country] || 0) + UserCount;
            return acc;
          }, {});
          setUserCountsByCountry(
            Object.entries(countsByCountry)
              .map(([country, userCount]) => ({ country, userCount }))
              .sort((a, b) => b.userCount - a.userCount)
          );

          // Sort and set User Counts by City
          const countsByCity = data.reduce((acc, { city, UserCount }) => {
            acc[city] = (acc[city] || 0) + UserCount;
            return acc;
          }, {});
          setUserCountsByCity(
            Object.entries(countsByCity)
              .map(([city, userCount]) => ({ city, userCount }))
              .sort((a, b) => b.userCount - a.userCount)
          );
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
        console.error("No token found, please login.");
      }
    };

    getData();
  }, [token, dispatch, selectedWebsite]);
  const seriesC = [
    {
      name: "Country",
      data: userCountsByCountry.map((item) => item.userCount),
    },
  ];
  const labelsC = userCountsByCountry.map((item) => item.country);
  const seriesy = [
    {
      name: "Ville",
      data: userCountsByCity.map((item) => item.userCount),
    },
  ];
  const labelsy = userCountsByCity.map((item) => item.city);
  console.log(seriesy);
  return (
    <div className="pt-4">
      <div className="flex gap-4 justify-center px-14 text-slate-900">
        <div className="w-1/2 ">
          <h2 className="text-xl font-medium my-8">
            Nombre d'utilisateurs par pays
          </h2>
          <HorBarChart
            categories={labelsC}
            series={seriesC}
            width={500}
          />
        </div>
        <div className="w-1/2 ">
          <h2 className="text-xl font-medium my-8">
            Nombre d'utilisateur par ville
          </h2>
          <HorBarChart
            categories={labelsy}
            series={seriesy}
          />
        </div>
      </div>
    </div>
  );
};

export default Demographic;
