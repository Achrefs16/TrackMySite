import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../../store/userSlice";
import AreaChart from "../charts/AreaChart";
import HorBarChart from "../charts/HorBarChart";

const Segmentation = () => {
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const [subscribecontry, setSubscribecontry] = useState([]);
  const [subscribe, setSubscribe] = useState([]);
  const [purchasecontry, setPurchasecontry] = useState([]);
  const [purchase, setPurchase] = useState([]);
  const selectedWebsite = useSelector(
    (state) => state.website.selectedWebsite.appId
  );
  useEffect(() => {
    const getData = async () => {
      if (token) {
        try {
          const response = await axios.get(
            `/purchasersbylocation?appId=${selectedWebsite}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = response.data;

          const responseu = await axios.get(
            `/purchasersbycity?appId=${selectedWebsite}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const datau = responseu.data;
          const responssubc = await axios.get(
            `/countrysubscriber?appId=${selectedWebsite}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const datasubc = responssubc.data;
          const responssub = await axios.get(
            `/citysubscriber?appId=${selectedWebsite}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const dataSub = responssub.data;

          setPurchasecontry(data);

          setPurchase(datau);

          setSubscribecontry(datasubc);

          setSubscribe(dataSub);
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
  const categories = purchasecontry.map((item) => item.country);
  const seriesData = [
    {
      name: "Acheteurs",
      data: purchasecontry.map((item) => item.NumberOfPurchasers),
    },
  ];
  const categoriescity = purchase.map((item) => item.city);
  const seriesDatacity = [
    {
      name: "Acheteurs",
      data: purchase.map((item) => item.NumberOfPurchasers),
    },
  ];
  return (
    <div>
      <div className="flex gap-4">
        <div className="w-1/2">
          <HorBarChart
            categories={categoriescity}
            series={seriesDatacity}
            height={250}
            title={"Acheteurs par ville"}
          />
        </div>
        <div className="w-1/2">
          <HorBarChart
            categories={categories}
            series={seriesData}
            height={250}
            title={"Acheteurs par pays"}
          />
        </div>
      </div>
      <div className="flex gap-4 mt-4">
        <div className="w-1/2">
          <table className="w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan d'abonnement{" "}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ville
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
              </tr>
            </thead>
            <tbody>
              {subscribe.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.SubscriptionPlan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.city}</td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.NumberOfSubscribers}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-1/2">
          <table className="w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan d'abonnement{" "}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pays
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ville
                </th>
              </tr>
            </thead>
            <tbody>
              {subscribecontry.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.SubscriptionPlan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.country}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.NumberOfSubscribers}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Segmentation;
