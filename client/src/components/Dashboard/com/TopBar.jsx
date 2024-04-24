import React, { useEffect, useState } from "react";
import NotificationModal from "./NotificationModal";
import { Link } from "react-router-dom";
import img from "../../landing/img/logog.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SelectModal from "./SelectModal";
import { IoIosArrowDown } from "react-icons/io";
import { useSelector } from "react-redux";
import { IoNotificationsOutline } from "react-icons/io5";
import ModalProfile from "./ModalProfile";

const TopBar = () => {
  const token = useSelector((state) => state.user.token);
  const [websites, setWebsites] = useState();
  const selectedWebsite = useSelector((state) => state.website.selectedWebsite);

  const handleCloseModal = () => setIsOpen(false);
  const [isOpen, setIsOpen] = useState(false);
  const userDetails = useSelector((state) => state.user.details);
  const handleClosePModal = () => setIsOpen(false);
  const [isPOpen, setIsPOpen] = useState(false);
  const [notifications, setNotifications] = useState();
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Function to toggle notification modal
  const toggleNotifications = async () => {
    setIsNotificationOpen(!isNotificationOpen);
  };
  const updateNotificationStatus = async () => {
    const newNotificationIds = notifications
      .filter((n) => n.status === "new")
      .map((n) => n.notification_id);
    if (newNotificationIds.length > 0) {
      await axios.post(
        "/notifications/update-status",
        { notificationIds: newNotificationIds },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Refresh notifications to reflect the new status
      getData();
    }
  };

  const getData = async () => {
    const response = await axios.get(
      `/notifications/?appId=${selectedWebsite.appId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = response.data;

    setNotifications(data);
    const newNotificationExists = data.some(
      (notification) => notification.status === "new"
    );
    setHasNewNotifications(newNotificationExists);
  };

  const getWebsites = async () => {
    if (token) {
      try {
        const response = await axios.get("/websites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWebsites(response.data.websites);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.error("No token found, please login.");
    }
  };
  useEffect(() => {
    getWebsites();
    getData();
    const interval = setInterval(() => {
      getData();
    }, 30000); // 30000 milliseconds = 30 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [selectedWebsite]);

  const letter = userDetails.name.charAt(0);
  return (
    <div className=" h-12 bg-white border-b border-gray-300 flex items-center justify-between pl-5 pr-28">
      <div className="flex">
        <div className="flex items-center gap-1  pr-7 h-4/6 border-r border-gray-300">
          <img
            src={img}
            className="w-4"
            alt=""
          />
          <Link
            to="/"
            className="text-brand text-xl font-bold cursor-pointer "
          >
            {" "}
            TrackMySite
          </Link>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="  ml-4 text-slate-800 h-4/6 text-lg font-semibold px-4 hover:text-slate-600"
        >
          {websites && selectedWebsite
            ? selectedWebsite.name
            : "Select Website"}{" "}
          <IoIosArrowDown className="inline text-lg font-bold" />
        </button>
        <SelectModal
          isOpen={isOpen}
          onClose={handleCloseModal}
          websites={websites}
          getWebsites={getWebsites}
        />
      </div>
      <div className="flex items-center gap-6 ">
        <div
          className="relative"
          onClick={toggleNotifications}
        >
          <IoNotificationsOutline className="text-2xl text-slate-800 cursor-pointer" />
          {hasNewNotifications && (
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-alert"></span>
          )}
        </div>
        <NotificationModal
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
          notifications={notifications || []}
          onUpdateNotifications={updateNotificationStatus}
        />
        <h1
          onClick={() => setIsPOpen((prev) => !prev)}
          className="text-lg rounded-full border cursor-pointer border-gray-300 bg-gray-500  text-white px-2 "
        >
          {letter}
        </h1>
        <ModalProfile
          isOpen={isPOpen}
          onClose={handleClosePModal}
        />
      </div>
    </div>
  );
};

export default TopBar;
