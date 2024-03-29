import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../../store/userSlice";
import HorBarChart from "../charts/HorBarChart";
import Joutable from "./Joutable";
const Journeys = () => {
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const selectedWebsite = useSelector(
    (state) => state.website.selectedWebsite.appId
  );

  const [journeys, setjourneys] = useState([]);
  useEffect(() => {
    const getData = async () => {
      if (token) {
        try {
          const responseJou = await axios.get(
            `/userjourneys?appId=${selectedWebsite}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const responseJourney = responseJou.data.UserJourneys;

          setjourneys(responseJourney);

          // setEntrypage(prepareChartData(data));
          // setpageEngData(dataEng);
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
  }, [token]);

  return (
    <div>
      <Joutable journeys={journeys} />
    </div>
  );
};

export default Journeys;
