import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../../store/userSlice";
import HorBarChart from "../charts/HorBarChart";
const Interaction = () => {
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const selectedWebsite = useSelector(
    (state) => state.website.selectedWebsite.appId
  );

  const [eventData, setEventData] = useState([]);
  const [eventsData, setEvents] = useState([]);
  const [event, setEvent] = useState([]);
  const events = [
    "file-download",
    "video-play",
    "form-submit",
    "click",
    "query-search",
    "clipboard-copy",
    "visibility",
    "custom-event",
  ];
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    if (!token) {
      console.error("No token found, please login.");
      return;
    }

    try {
      const requests = events.map(async (event) => {
        const response = await axios.get(
          `/event/${event}?appId=${selectedWebsite}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        return response.data;
      });

      const eventDataArray = await Promise.all(requests);

      // Flatten the eventDataArray and filter out invalid items

      const flatEventData = eventDataArray
        .flat()
        .filter((eventData) => eventData && eventData.Count !== undefined);
      flatEventData.sort((a, b) => b.Count - a.Count);
      setEvents(flatEventData);
      // Create an object to store the aggregated event data
      const aggregatedEventData = {};

      // Iterate over the flatEventData to sum up the counts of the same events
      flatEventData.forEach((eventDataItem) => {
        if (aggregatedEventData[eventDataItem.event]) {
          aggregatedEventData[eventDataItem.event].Count += eventDataItem.Count;
        } else {
          aggregatedEventData[eventDataItem.event] = eventDataItem;
        }
      });

      // Convert the aggregatedEventData object back to an array
      const aggregatedEventDataArray = Object.values(aggregatedEventData);

      console.log(aggregatedEventDataArray);
      setEventData(aggregatedEventDataArray);

      const res = await axios.get(`/avgeevent?appId=${selectedWebsite}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEvent(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        console.error("Unauthorized or Forbidden response, logging out.");
        dispatch(logout());
      }
    }
  };

  // Ensure selectedWebsite is also included in dependencies if it's used inside getData function.
  eventData && console.log(eventData);
  const categories = eventData
    .filter((item) => item.event !== null) // Filter out null values
    .map((item) => item.event);

  const series = [
    {
      name: "Nombre",
      data: eventData.map((item) => item.Count),
    },
  ];
  const categoriess = event.map((item) => item.PageUrl);

  // Preparing series data
  const seriess = [
    {
      name: "Nombre moyen Événement",
      data: event.map((item) => item.AvgEvents),
    },
  ];
  console.log(categories);
  return (
    <div>
      <div className="flex gap-4">
        <HorBarChart
          series={series}
          categories={categories}
          width={525}
          height={300}
        />
        <HorBarChart
          series={seriess}
          categories={categoriess}
          width={525}
          height={275}
          title={"Nombre moyen d'événements par page "}
        />
      </div>
      <div className="my-4 bg-white p-4 border border-gray-300 rounded-md">
        <h2 className="text-lg font-semibold mb-4">événements par page</h2>
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th className="p-3 font-bold text-left">événement</th>
              <th className="p-3 font-bold text-left">page</th>
              <th className="p-3 font-bold text-left">Occurrences</th>
            </tr>
          </thead>
          <tbody>
            {eventsData &&
              eventsData.map((eventDataItem, Index) => (
                <tr key={`${Index}`}>
                  {/* Rendering event data */}
                  <td className="p-3">{eventDataItem.event}</td>
                  <td className="p-3">{eventDataItem.pageUrl}</td>
                  <td className="p-3">{eventDataItem.Count}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Interaction;
