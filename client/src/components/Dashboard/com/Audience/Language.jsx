import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../../store/userSlice";

import HorBarChart from "../charts/HorBarChart";
const Language = () => {
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const [languagesData, setLanguagesData] = useState([]);
  const selectedWebsite = useSelector(
    (state) => state.website.selectedWebsite.appId
  );
  useEffect(() => {
    const getData = async () => {
      if (token) {
        try {
          const response = await axios.get(
            `/language?appId=${selectedWebsite}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = response.data.Languages;
          const prepareChartData = data.map((item) => ({
            name: item.language, // Assuming `language` is the correct key.
            UserCount: item.UserCount,
          }));
          setLanguagesData(prepareChartData);
        } catch (error) {
          console.error("Error fetching languages data:", error);
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
  }, [token, selectedWebsite]);

  // Data preparation for HorBarChart
  const categories = languagesData.map((item) => item.name);
  const seriesData = [
    {
      name: "Nombre d'utilisateurs",
      data: languagesData.map((item) => item.UserCount),
    },
  ];
  return (
    <div className="w-fit m-10">
      {languagesData && (
        <HorBarChart
          categories={categories}
          series={seriesData}
          width={500}
          title={"Nombre d'utilisateurs par langue"}
        />
      )}
    </div>
  );
};

export default Language;
