import React, { useState } from "react";
import img from "./search.png";
import img1 from "./github.png";
import zxcvbn from "zxcvbn";
import NavBar from "../NavBar";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../../store/userSlice";
import axios from "axios";
import { toast } from "react-hot-toast";
const SginUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Handle input changes for all fields
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
  const handleCheckboxChange = () => {
    setIsTermsAccepted(!isTermsAccepted);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordsMatch && passwordIsStrong && isTermsAccepted) {
      try {
        const { data } = await axios.post("/auth/signup", {
          name,
          email,
          password,
        });

        if (data.error) {
          toast.error(data.error);
        } else {
          if (data.token) {
            // Decode token to get user details
            dispatch(setCredentials({ token: data.token }));

            toast.success(
              "congratulations your account has been successfully created"
            );
            navigate("/dashboard");
          }
        }
      } catch (error) {
        console.error(error.toJSON());
      }
    }
  };
  return (
    <>
      {" "}
      <NavBar></NavBar>
      <div className="flex min-h-full flex-col justify-center px-6 py-6 lg:px-8 bg-gray-50">
        <div className="mt-10 sm:mx-auto w-2/6  bg-white rounded-lg shadow-md shadow-gray-300 ">
          <form
            className="space-y-6  p-10"
            action="#"
            method="POST"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-500"
              >
                Nom et prénom
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
                Adresse e-mail
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
                Mot de passe
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
                Confirmation du mot de passe
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
                  Les mots de passe ne correspondent pas
                </div>
              )}
            </div>

            <div className="flex gap-2 items-center">
              <label className="inline-flex  cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  name=""
                  id=""
                  checked={isTermsAccepted} // Bind checkbox state
                  onChange={handleCheckboxChange}
                />
                <div className="w-4 h-4 border border-slate-400 rounded-md peer-checked:bg-brand"></div>
              </label>
              <p className="text-slate-500 text-sm">
                J'accepte les
                <a
                  href=""
                  className="text-brand  font-semibold"
                >
                  conditions d'utilisation
                </a>{" "}
                et la{" "}
                <a
                  className="text-brand  font-semibold"
                  href=""
                >
                  politique de confidentialité
                </a>
                .
              </p>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-brand px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bratext-brand"
                disabled={!isTermsAccepted}
              >
                S'inscrire
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-600">Ou bien</span>
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
          Vous avez déjà un compte ?
          <a
            href="#"
            className="font-semibold leading-6 text-brand hover:text-indigo-400"
          >
            {" "}
            Se connecter
          </a>
        </p>
      </div>
    </>
  );
};

export default SginUp;
