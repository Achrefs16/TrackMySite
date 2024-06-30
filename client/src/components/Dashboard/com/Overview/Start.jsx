import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../../store/userSlice";
import Card from "../Card";
import axios from "axios";
import Periode from "./Periode";
import AreaChart from "../charts/AreaChart";
import Bar from "../Bar";

const Start = () => {
  const selectedWebsite = useSelector((state) => state.website.selectedWebsite);
  const [conversion, setConversion] = useState("");
  const [data, setData] = useState({
    users: null,
    sessions: null,
    events: null,
  });
  const [render, setRender] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const handleChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    if (token && selectedWebsite) {
      ["users", "sessions", "events"].forEach((entity) => getData(entity));
      getConversion();
    }
  }, [selectedPeriod, token, selectedWebsite]);

  const getData = async (entity) => {
    if (token && selectedWebsite) {
      try {
        const response = await axios.get(
          `/${entity}/${selectedPeriod}?appId=${selectedWebsite.appId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData((prevData) => ({
          ...prevData,
          [entity]: response.data,
        }));
      } catch (error) {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          console.error("Unauthorized or Forbidden response, logging out.");
          dispatch(logout());
        }
      }
    } else {
      console.error("No token or selected website found, please login.");
    }
  };

  const getConversion = async () => {
    if (token && selectedWebsite) {
      try {
        const response = await axios.get(
          `/conversion/${selectedPeriod}?appId=${selectedWebsite.appId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setConversion(response.data.TotalRevenue);
        setRender(true);
      } catch (error) {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          console.error("Unauthorized or Forbidden response, logging out.");
          dispatch(logout());
        }
      }
    } else {
      console.error("No token or selected website found, please login.");
    }
  };

  const formattedDataUser =
    data.users?.Breakdown?.map((item) => ({
      name: `${item.SubInterval}`,
      Count: item.Count,
    })) || [];

  const formattedDataSession =
    data.sessions?.Breakdown?.map((item) => ({
      name: `${item.SubInterval}`,
      Count: item.Count,
    })) || [];

  const formattedDataEvent =
    data.events?.Breakdown?.map((item) => ({
      name: `${item.SubInterval}`,
      Count: item.Count,
    })) || [];

  const categories = formattedDataEvent.map((item) => item.name);
  const seriesData = [
    {
      name: "Evénements",
      data: formattedDataEvent.map((item) => item.Count),
    },
  ];

  const categoriesU = formattedDataUser.map((item) => item.name);
  const seriesDataU = [
    {
      name: "Utilisateurs",
      data: formattedDataUser.map((item) => item.Count),
    },
    {
      name: "Sessions",
      data: formattedDataSession.map((item) => item.Count),
    },
  ];

  const Links = [{ name: "Aperçu général", path: "/dashboard/overview" }];
  const Websitedata = useSelector((state) => state.website.Websitedata);

  return (
    <>
      <Bar Links={Links} />
      {!selectedWebsite ? (
        <div className="bg-gray-100 h-5/6 flex justify-center pt-40">
          <p className="w-3/4 text-4xl font-bold text-gray-600">
            Sélectionnez un site Web pour afficher ses données.
          </p>
        </div>
      ) : Websitedata === 0 ? (
        <div className="bg-gray-100 h-5/6 flex justify-center pt-40">
          <p className="w-3/4 text-4xl font-bold text-gray-600">
            Intégrez le code de suivi pour visualiser les données d'analyse de
            votre site web.
          </p>
        </div>
      ) : (
        <div className="bg-gray-100 h-5/6">
          <div className="flex justify-between px-10 pt-4">
            <h1 className="text-xl text-slate-800 font-bold">Aperçu général</h1>
            <Periode
              selectedPeriod={selectedPeriod}
              handleChange={handleChange}
            />
          </div>
          {render ? (
            <div className="flex gap-5 w-full justify-center mx-auto">
              <div className="bg-white pt-2 rounded-md border border-gray-300 w-fit pr-3">
                <h1 className="text-gray-700 font-semibold ml-4">
                  Utilisateurs et sessions
                </h1>
                <AreaChart
                  series={seriesDataU}
                  categories={categoriesU}
                  width={564}
                  height={200}
                />
              </div>
              <div className="bg-white pt-2 rounded-md border border-gray-300 w-fit pr-3">
                <h1 className="text-gray-700 font-semibold ml-4">Evénements</h1>
                <AreaChart
                  series={seriesData}
                  categories={categories}
                  width={564}
                  height={200}
                />
              </div>
            </div>
          ) : (
            <div>Chargement</div>
          )}
          {data.events && data.sessions && data.users ? (
            <div className="flex mt-5 w-full justify-center mx-auto gap-5">
              <Card
                content={"Nombre d'utilisateurs"}
                count={data.users.TotalCount}
              />
              <Card
                content={"Nombre des sessions"}
                count={data.sessions.TotalCount}
              />
              <Card
                content={"Total des évènements"}
                count={data.events.TotalCount}
              />
              {conversion && (
                <Card
                  content={"Revenu $"}
                  count={conversion.toFixed(2)}
                />
              )}
            </div>
          ) : (
            <p>Wait</p>
          )}
        </div>
      )}
    </>
  );
};

export default Start;
