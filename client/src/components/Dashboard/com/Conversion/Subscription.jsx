import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../../store/userSlice";
import AreaChart from "../charts/AreaChart";
import HorBarChart from "../charts/HorBarChart";

const Subscription = () => {
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const [subscribe, setSubscribe] = useState([]);
  const [unsubscribe, setUnSubscribe] = useState([]);
  const selectedWebsite = useSelector(
    (state) => state.website.selectedWebsite.appId
  );
  useEffect(() => {
    const getData = async () => {
      if (token) {
        try {
          const response = await axios.get(
            `/subscribe?appId=${selectedWebsite}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = response.data.SubscriptionData;
          setSubscribe(data);
          const responseu = await axios.get(
            `/unsubscribe?appId=${selectedWebsite}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const datau = responseu.data.UnsubscribeData;

          setUnSubscribe(datau);
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
  console.log(unsubscribe);
  return (
    <div>
      {" "}
      <div className="bg-white p-2 mr-5 rounded border border-gray-300">
        <table className="w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subscription Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                TotalSubscriptions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                TotalRevenue
              </th>
            </tr>
          </thead>
          <tbody>
            {subscribe &&
              subscribe.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.SubscriptionPlan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.TotalSubscriptions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.TotalRevenue}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white p-2 mr-5 rounded border border-gray-300 mt-4">
        <table className="w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unsubcribe Reasons
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Unsubscribes
              </th>
            </tr>
          </thead>
          <tbody>
            {unsubscribe &&
              unsubscribe.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">{item.Reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.TotalUnsubscribes}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Subscription;
