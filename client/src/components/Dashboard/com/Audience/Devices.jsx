import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../../store/userSlice";
import DoughnutChart from "../charts/DoughnutChart";
import BarChart from "../charts/BarChart";

const Devices = () => {
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const [osChartData, setOsChartData] = useState([]);
  const [deviceChartData, setDeviceChartData] = useState([]);
  const [browserChartData, setBrowserChartData] = useState([]);
  const selectedWebsite = useSelector(
    (state) => state.website.selectedWebsite.appId
  );
  useEffect(() => {
    const getData = async () => {
      if (token) {
        try {
          const response = await axios.get(
            `/devices?appId=${selectedWebsite}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = response.data.DeviceAndBrowserUsage;
          const aggregateData = (key) => {
            return data.reduce((acc, item) => {
              acc[item[key]] = (acc[item[key]] || 0) + item.UserCount;
              return acc;
            }, {});
          };

          const deviceData = aggregateData("device");
          const osData = aggregateData("os");
          const browserData = aggregateData("browser");
          const prepareChartData = (aggregatedData) => {
            return Object.entries(aggregatedData).map(([name, value]) => ({
              name,
              value,
            }));
          };

          setOsChartData(prepareChartData(osData));
          setDeviceChartData(prepareChartData(deviceData));
          setBrowserChartData(prepareChartData(browserData));
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

  // Example of using one of the chart data arrays
  const series = osChartData.map((item) => item.value);
  const labels = osChartData.map((item) => item.name);
  const seriesd = deviceChartData.map((item) => item.value);

  const labelsd = deviceChartData.map((item) => item.name);

  const seriesb = [
    {
      name: "Nombre d'utilisateurs par navigateur",
      data: browserChartData.map((item) => item.value),
    },
  ];
  const categories = browserChartData.map((item) => item.name);
  return (
    <div className="pt-4 ">
      <div className=" flex gap-4 justify-center mb-4 w-">
        <div className=" px-10 py-3 bg bg-white w-fit border border-gray-300 rounded ">
          <DoughnutChart
            series={series}
            labels={labels}
          />
        </div>
        <div className=" px-10 py-3 bg bg-white w-fit border border-gray-300 rounded ">
          <DoughnutChart
            series={seriesd}
            labels={labelsd}
          />
        </div>
      </div>
      <div className=" px-10 py-3 bg bg-white w-max border border-gray-300 rounded m-auto">
        <BarChart
          series={seriesb}
          categories={categories}
          width={700}
          height={225}
        />
      </div>
    </div>
  );
};

export default Devices;
