import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../../store/userSlice";

const Acquisition = () => {
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();

  const selectedWebsite = useSelector(
    (state) => state.website.selectedWebsite.appId
  );

  const [acquisitionData, setAcquisitionData] = useState([]);
  const Links = [{ name: "Acquisition", path: "/dashboard/acquisition" }];

  function categorizeReferrer(referrer) {
    // If referrer is null or empty, consider it a direct visit
    if (referrer === "null") {
      return "Direct";
    }

    try {
      // Attempt to construct a URL object with the referrer
      const url = new URL(referrer);
      const domain = url.hostname;

      // Define a map of known search engine domains to user-friendly names
      const searchEngines = {
        "www.google.com": "Google",
        "www.bing.com": "Bing",
        "search.yahoo.com": "Yahoo",
        "www.duckduckgo.com": "DuckDuckGo",
        "www.baidu.com": "Baidu",
        "www.yandex.com": "Yandex",
      };

      // Check if the domain is a known search engine
      if (domain in searchEngines) {
        return `${searchEngines[domain]} Search`;
      }

      // Optionally, return a cleaned-up version of the domain for other referrers
      return domain.replace("www.", "");
    } catch (e) {
      // If URL construction fails, log the error and return a fallback value
      console.error(e);
      return "Invalid or Unknown Referrer";
    }
  }

  useEffect(() => {
    const getData = async () => {
      if (token) {
        try {
          const response = await axios.get(
            `/acquisition?appId=${selectedWebsite}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = response.data;

          setAcquisitionData(data);
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

  const categorizedData = acquisitionData.map((source) => ({
    ...source,
    Referrer: categorizeReferrer(source.Referrer),
  }));

  return (
    <>
      <div className="bg-white p-2 mr-5 rounded border border-gray-300">
        <table className="w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Count
              </th>
            </tr>
          </thead>
          <tbody>
            {categorizedData &&
              categorizedData.map((item, index) => (
                <tr
                  key={item.index}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.Referrer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.SessionCount}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Acquisition;
