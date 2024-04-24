import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../../store/userSlice";
import AreaChart from "../charts/AreaChart";
import HorBarChart from "../charts/HorBarChart";

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
const InteractionE = () => {
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  // Define state hooks for your data
  const [data, setData] = useState({
    productv: [],
    categoryv: [],
    addcartp: [],
    addcartc: [],
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

      const endpoints = ["/productview", "/viewcate", "/addcart", "/addcate"];

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
          productv: results[0].success ? results[0].data : [],
          categoryv: results[1].success ? results[1].data : [],
          addcartp: results[2].success ? results[2].data : [],
          addcartc: results[3].success ? results[3].data : [],
        });
      } catch (error) {
        // This catch block will now only be reached if there's an issue with Promise.all itself
        console.error("Error performing concurrent data fetching:", error);
      }
    };

    getData();
  }, [token, selectedWebsite, dispatch]);

  let seriespv = [];
  let categoriepv = [];
  let seriescv = [];
  let categoriecv = [];
  let seriesap = [];
  let categorieap = [];
  let seriesac = [];
  let categorieac = [];

  if (data.addcartc.AddToCartCategoryData && data.categoryv) {
    const validPv = data.productv.CombinedProductViews.filter(
      (item) => item.productName !== null && item.TotalViews !== null
    );
    categoriepv = validPv.map((item) => item.productName);
    const seriesDatapv = validPv.map((item) => item.TotalViews);

    seriespv = [
      {
        name: "Vue",
        data: seriesDatapv,
      },
    ];
    const validCv = data.categoryv.ProductViewsByCategory.filter(
      (item) => item.productCategory !== null && item.TotalViews !== null
    );
    categoriecv = validCv.map((item) => item.productCategory);
    const seriesDatacv = validCv.map((item) => item.TotalViews);

    seriescv = [
      {
        name: "Vue",
        data: seriesDatacv,
      },
    ];
    const validap = data.addcartp.AddToCartData.filter(
      (item) => item.productName !== null && item.TotalViews !== null
    );
    categorieap = validap.map((item) => item.productName);
    const seriesDataap = validap.map((item) => item.TotalAdds);

    seriesap = [
      {
        name: "Ajouts",
        data: seriesDataap,
      },
    ];
    const validac = data.addcartc.AddToCartCategoryData.filter(
      (item) => item.productCategory !== null && item.TotalAdds !== null
    );
    categorieac = validac.map((item) => item.productCategory);
    const seriesDataac = validac.map((item) => item.TotalAdds);

    seriesac = [
      {
        name: "Ajouts",
        data: seriesDataac,
      },
    ];
  }
  console.log(data);
  return (
    <div>
      <div className="flex gap-4 w-full mt-4">
        <div className="   w-1/2 ">
          <p className="text-gray-700 text-lg font-medium mb-2">
            Les Produits Les Plus Vus
          </p>
          <HorBarChart
            categories={categoriepv}
            series={seriespv}
            width="100%"
            height="200"
          />
        </div>
        <div className="   w-1/2 ">
          <p className="text-gray-700 text-lg font-medium mb-2">
            Les Catégories Les Plus Vus
          </p>
          <HorBarChart
            categories={categoriecv}
            series={seriescv}
            width="100%"
            height="200"
          />
        </div>
      </div>
      <div className="flex gap-4 w-full mt-4">
        <div className="   w-1/2 ">
          <p className="text-gray-700 text-lg font-medium mb-2">
            Le Plus De Catégories Ajouter Au Panier
          </p>
          <HorBarChart
            categories={categorieap}
            series={seriesap}
            width="100%"
            height="200"
          />
        </div>
        <div className="   w-1/2 ">
          <p className="text-gray-700 text-lg font-medium mb-2">
            Le Plus De Category Ajouter Au Panier
          </p>
          <HorBarChart
            categories={categorieac}
            series={seriesac}
            width="100%"
            height="200"
          />
        </div>
      </div>
    </div>
  );
};

export default InteractionE;
