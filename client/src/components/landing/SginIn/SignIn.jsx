import React, { useState } from "react";
import img from "./search.png";
import img1 from "./github.png";
import NavBar from "../NavBar";
const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({ email, password });
  };
  return (
    <>
      {" "}
      <NavBar></NavBar>
      <div className="flex min-h-full flex-col justify-center px-6 py-6 lg:px-8 bg-gray-50">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm"></div>

        <div className="mt-10 sm:mx-auto w-2/6  bg-white rounded-lg shadow-md shadow-gray-300 ">
          <form
            onSubmit={handleSubmit}
            className="space-y-6  p-10"
            action="#"
            method="POST"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-500"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  value={email}
                  onChange={handleInputChange}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-bratext-brand sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-500"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  value={password}
                  onChange={handleInputChange}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-bratext-brand sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="text-sm flex items-center justify-between">
              <div className="flex gap-2">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    name=""
                    id=""
                  />
                  <div className="w-4 h-4 border border-slate-400 rounded-md peer-checked:bg-brand"></div>
                </label>
                <p className="text-slate-500 font-medium">Remember me</p>
              </div>
              <a
                href="#"
                className="font-semibold text-brand hover:text-indigo-500"
              >
                Forgot password?
              </a>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-brand px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bratext-brand"
              >
                Sign in
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-600">
                Or continue with
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <div className="flex items-center justify-between">
              <button className=" bg-white rounded-md px-8 py-2 border border-inherit text-slate-900 hover:bg-gray-100">
                <div className="flex gap-3">
                  <img
                    className="w-6"
                    src={img}
                    alt=""
                  />
                  <span> Google</span>
                </div>
              </button>
              <button className=" bg-white rounded-md px-8 py-2 border border-inherit text-slate-900 hover:bg-gray-100">
                <div className="flex gap-3">
                  <img
                    className="w-6"
                    src={img1}
                    alt=""
                  />
                  <span> Github</span>
                </div>
              </button>
            </div>
          </form>
        </div>
        <p className="mt-5 text-center text-base  text-gray-500">
          Not a member?
          <a
            href="#"
            className="font-semibold leading-6 text-brand hover:text-indigo-400"
          >
            {" "}
            Sign Up
          </a>
        </p>
      </div>
    </>
  );
};

export default SignIn;
