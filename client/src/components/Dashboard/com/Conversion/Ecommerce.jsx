import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../../store/userSlice";
import AreaChart from "../charts/AreaChart";
import HorBarChart from "../charts/HorBarChart";
// Enhanced fetch function to handle errors gracefully
async function fetchFromAPI(endpoint, token) {
  try {
    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: response.data }; // Indicate success and return data
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Additional action or error handling can be performed here
      return { success: false, error: "Unauthorized" }; // Indicate failure and error type
    }
    return { success: false, error: "Other error" }; // Handle other errors
  }
}

const Ecommerce = () => {
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  // Define state hooks for your data
  const [data, setData] = useState({
    salesp: [],
    salesc: [],
    salespdaily: [],
    salescdaily: [],
  });
  const selectedWebsite = useSelector(
    (state) => state.website.selectedWebsite.appId
  );

  useEffect(() => {
    const getData = async () => {
      if (!token) {
        console.error("No token found, please login.");
        return;
      }

      const endpoints = [
        "/salesproduct",
        "/salescate",
        "/salescated",
        "/salesproductd",
      ];

      try {
        const results = await Promise.all(
          endpoints.map((endpoint) =>
            fetchFromAPI(`${endpoint}?appId=${selectedWebsite}`, token)
          )
        );

        // Check if any request failed due to being unauthorized, and dispatch logout if so
        const unauthorized = results.some(
          (result) => result.error === "Unauthorized"
        );
        if (unauthorized) {
          console.error("Unauthorized or Forbidden response, logging out.");
          dispatch(logout());
          return;
        }

        // Assuming the order is important, update state with results or default values
        setData({
          salesp: results[0].success ? results[0].data : [],
          salesc: results[1].success ? results[1].data : [],
          salescdaily: results[2].success ? results[2].data : [],
          salespdaily: results[3].success ? results[3].data : [],
        });
      } catch (error) {
        // This catch block will now only be reached if there's an issue with Promise.all itself
        console.error("Error performing concurrent data fetching:", error);
      }
    };

    getData();
  }, [token, selectedWebsite, dispatch]);
  let series = [];
  let categories = [];
  let seriesC = [];
  let categoriesC = [];
  let categoriesss = [];
  let seriesss = [];
  let categorieCa = [];
  let seriesCa = [];
  if (data.salespdaily && data.salespdaily.DailySalesByProduct) {
    // For salespdaily by Product
    series = data.salespdaily.DailySalesByProduct.filter(
      (item) => item.ProductName && item.Count !== null
    ) // Ensure item.Count is not null
      .map((item) => ({
        name: item.ProductName,
        data: [{ x: new Date(item.SaleDate).getTime(), y: item.Count }], // Use Count instead of DailyRevenue
      }));

    // Extract unique dates for salespdaily
    categories = [
      ...new Set(
        data.salespdaily.DailySalesByProduct.map((item) =>
          new Date(item.SaleDate).toISOString()
        )
      ),
    ];

    // For salescdaily by Category
    seriesC = data.salescdaily.DailySalesByCategory.filter(
      (item) => item.ProductCategory && item.Count !== null
    ) // Ensure item.Count is not null
      .map((item) => ({
        name: item.ProductCategory + " count",
        data: [{ x: new Date(item.SaleDate).getTime(), y: item.Count }], // Use Count instead of DailyRevenue
      }));

    // Extract unique dates for salescdaily
    categoriesC = [
      ...new Set(
        data.salescdaily.DailySalesByCategory.map((item) =>
          new Date(item.SaleDate).toISOString()
        )
      ),
    ];
    const validSalesData = data.salesp.SalesByProduct.filter(
      (item) => item.ProductName !== null && item.TotalRevenue !== null
    );

    // Extract categories and series data
    categoriesss = validSalesData.map((item) => item.ProductName);
    const seriesData = validSalesData.map((item) => item.TotalRevenue);

    // The series prop expected by HorBarChart needs to be an array of objects
    seriesss = [
      {
        name: "Revenue",
        data: seriesData,
      },
    ];

    const validCa = data.salesc.SalesByCategory.filter(
      (item) => item.ProductCategory !== null && item.TotalRevenue !== null
    );
    categorieCa = validCa.map((item) => item.ProductCategory);
    const seriesDataC = validCa.map((item) => item.TotalRevenue);

    console.log(data);
    seriesCa = [
      {
        name: "Revenue",
        data: seriesDataC,
      },
    ];
  }

  return (
    <div>
      <div className="flex gap-4 w-full">
        <div className="  bg-white pt-2  rounded-md border border-gray-300 w-1/2 ">
          <AreaChart
            series={series}
            categories={categories}
            width="100%"
            height="350"
          />
        </div>
        <div className="  bg-white pt-2  rounded-md border border-gray-300 w-1/2 ">
          <AreaChart
            series={seriesC}
            categories={categoriesC}
            width="100%"
            height="350"
          />
        </div>
      </div>
      <div className="flex gap-4 w-full mt-4">
        <div className="   w-1/2 ">
          <HorBarChart
            categories={categoriesss}
            series={seriesss}
            width="100%"
            height="200"
          />
        </div>
        <div className="   w-1/2 ">
          <HorBarChart
            categories={categorieCa}
            series={seriesCa}
            width="100%"
            height="200"
          />
        </div>
      </div>
    </div>
  );
};

export default Ecommerce;
