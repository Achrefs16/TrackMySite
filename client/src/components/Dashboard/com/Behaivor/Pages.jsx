import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../../store/userSlice";

import HorBarChart from "../charts/HorBarChart";

const Pages = () => {
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const selectedWebsite = useSelector(
    (state) => state.website.selectedWebsite.appId
  );
  const [pageViewData, setpageViewData] = useState([]);
  const [pageEngData, setpageEngData] = useState(null);
  useEffect(() => {
    const getData = async () => {
      if (token) {
        try {
          const response = await axios.get(
            `/pagesviews?appId=${selectedWebsite}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = response.data.PageViews;

          const prepareChartData = (data) => {
            return data.map((item) => ({
              name: item.pageUrl, // Use 'pageUrl' as 'name'
              value: item.PageViews, // Use 'PageViews' as 'value'
            }));
          };

          const responseEng = await axios.get(
            `/pageengagement?appId=${selectedWebsite}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const dataEng = responseEng.data.PageEngagementMetrics;

          setpageViewData(prepareChartData(data));
          setpageEngData(dataEng);
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

  const categories = pageViewData.map((item) => item.name);

  const series = [
    {
      name: "Page view",
      data: pageViewData.map((item) => item.value),
    },
  ];
  return (
    <div className="  flex gap-4">
      <div className="w-2/4 rounded-md border  bg-white border-gray-300 mb-10 py-4 px-4 ">
        <table className="leading-normal  w-full">
          <thead className=" text-gray-600">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider rounded-tl-lg">
                Page Name
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Avg Time Spent
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Avg Scroll Depth
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {pageEngData
              ? pageEngData.map((item, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-gray-100 ${
                      index === pageEngData.length - 1
                        ? "rounded-bl-lg rounded-br-lg"
                        : ""
                    }`}
                  >
                    <td className="px-5 py-2.5 border-t border-gray-300  text-sm">
                      {item.PageName}
                    </td>
                    <td className="px-5 py-2.5 border-t border-gray-300  text-sm">
                      {item.AvgTimeSpent}
                    </td>
                    <td className="px-5 py-2.5 border-t border-gray-300  text-sm">
                      {item.AvgScrollDepth}
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
      <div className="w-1/2">
        <HorBarChart
          series={series}
          categories={categories}
          width="100%"
          height={326}
          title={"Page view"}
        />
      </div>
    </div>
  );
};

export default Pages;
