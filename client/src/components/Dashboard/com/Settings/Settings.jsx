import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import zxcvbn from "zxcvbn";
const Settings = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // You might want to allow users to change their password as well
  // But for simplicity, let's just focus on name and email
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  useEffect(() => {
    // Fetch the current user profile from the backend and populate the fields
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }); // Adjust the endpoint as necessary
        setName(data.name);
        setEmail(data.email);
      } catch (error) {
        toast.error("Failed to fetch profile");
        console.error(error);
      }
    };
    fetchProfile();
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    else if (name === "email") setEmail(value);
    else if (name === "password") {
      setPassword(value);
      setPasswordStrength(zxcvbn(value));
    } else if (name === "confirmPassword") setConfirmPassword(value);
  };

  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;
  const passwordIsStrong = passwordStrength && passwordStrength.score >= 2;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.patch(
        "/auth/profile",
        {
          name,
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex min-h-full  h-full  px-6 py-6 lg:px-8 bg-gray-50 text-gray-800">
        <aside class="hidden py-4 md:w-1/3 lg:w-1/4 md:block ">
          <div class="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
            <h2 class="pl-3 mb-4 text-2xl font-semibold">Settings</h2>

            <a
              href="#"
              class="flex items-center px-3 py-2.5 font-bold bg-gray-100  text-brand border rounded-full"
            >
              Account Settings
            </a>

            <a
              href="#"
              class="flex items-center px-3 py-2.5 font-semibold hover:text-indigo-900 hover:border hover:rounded-full  "
            >
              Notifications
            </a>
          </div>
        </aside>

        <div className="  rounded  ml-4  w-full font-semibold  ">
          {!isEditing ? (
            <div className="space-y-6 p-10 mt-20">
              <h2 className="text-xl font-semibold text-gray-900">
                Profile Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="font-medium text-gray-600">Name:</div>
                <div>{name}</div>

                <div className="font-medium text-gray-600">Email Address:</div>
                <div>{email}</div>
              </div>
              <button
                className="mt-6 px-6 py-2 bg-brand hover:bg-brand-dark text-white font-semibold rounded-md transition duration-200 ease-in-out"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form
              className="space-y-6 p-10"
              onSubmit={handleSubmit}
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-500"
                >
                  Full Name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="name"
                    required
                    value={name}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-bratext-brand sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-500"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-bratext-brand sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-500"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={handleInputChange}
                    className={`block w-full rounded-md py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  placeholder:text-gray-400    sm:text-sm sm:leading-6`}
                  />
                </div>
                {/* Password strength feedback */}
                {password && (
                  <div
                    className={`text-sm ${
                      passwordIsStrong ? "text-green-400" : "text-sunny"
                    }`}
                  >
                    {passwordIsStrong
                      ? `Strength: ${"Strong"}`
                      : `Strength: ${"Weak"}`}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium leading-6 text-gray-500"
                >
                  Confirm Password
                </label>
                <div className="mt-2">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={handleInputChange}
                    className={`block w-full rounded-md py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 ${
                      passwordsMatch ? "ring-gray-300" : "ring-gray-300"
                    } placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                  />
                </div>
                {!passwordsMatch && confirmPassword && (
                  <div className="text-sm text-sunny">
                    Passwords do not match
                  </div>
                )}
              </div>
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-brand px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  Update Profile
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                  }}
                  className="flex w-full justify-center rounded-md bg-gray-300 mt-2 px-3 py-1.5 text-sm font-semibold leading-6  shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  Back{" "}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Settings;
