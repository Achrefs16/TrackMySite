import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../../store/userSlice";
import HorBarChart from "../charts/HorBarChart";
import ApexChart from "../charts/ApexChart";
const Session = () => {
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const selectedWebsite = useSelector(
    (state) => state.website.selectedWebsite.appId
  );
  const [session, setSession] = useState(0);

  const [bounce, setbounce] = useState([]);
  const [entrypage, setEntrypage] = useState([]);
  const [lastpage, setLastpage] = useState([]);
  useEffect(() => {
    const getData = async () => {
      if (token) {
        try {
          const response = await axios.get(
            `/avgssession?appId=${selectedWebsite}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setSession(response.data.AvgSessionDuration);

          const resbounce = await axios.get(
            `/bouncerate?appId=${selectedWebsite}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setbounce(resbounce.data);

          const resp = await axios.get(`/lastpage?appId=${selectedWebsite}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const responseEn = await axios.get(
            `/entrypage?appId=${selectedWebsite}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const lastpage = resp.data.LastPageSessionCounts;
          const entrypage = responseEn.data.EntryPageSessionCounts;
          setEntrypage(entrypage);
          setLastpage(lastpage);
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

  const categories = entrypage.map((item) => item.EntryPage);

  // Preparing series data
  const series = [
    {
      name: "Nombre de sessions",
      data: entrypage.map((item) => item.SessionCount),
    },
  ];
  const categoriesl = lastpage.map((item) => item.LastPage);

  // Preparing series data
  const seriesl = [
    {
      name: "Nombre de sessions",
      data: lastpage.map((item) => item.SessionCount),
    },
  ];
  return (
    <div>
      <div className=" mb-4 w-fit bg-white rounded border border-gray-300 px-4 py-4 font-semibold  text-gray-500">
        <p>Durée moyenne de la session</p>
        <p className="text-center font-bold text-4xl my-6 text-slate-800">
          {session} Min
        </p>
      </div>
      <div className="flex gap-4 mb-4">
        <HorBarChart
          categories={categories}
          series={series}
          width={525}
          height={250}
          title={"Première page de la session"}
        />
        <HorBarChart
          categories={categoriesl}
          series={seriesl}
          width={525}
          height={250}
          title={"Dernière page de la session"}
        />
      </div>

      <div className="bg-white p-2 rounded border border-gray-300">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Page d'entrée
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Taux de rebond
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {bounce &&
              bounce.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.EntryPage}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.BounceRate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.SinglePageSessions || "0"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.TotalSessions}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Session;
