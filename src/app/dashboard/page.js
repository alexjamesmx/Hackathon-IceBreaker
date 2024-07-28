"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../../app/globals.css";
import Navbar from "../../components/navbar";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/helpers/consts";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";

export default function Dashboard() {
  const [isMatchCreated, setIsMatchCreated] = useState(false);
  const [link, setLink] = useState("");
  const [copyText, setCopyText] = useState("Copy");
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // Redirect to the login page if token is not found
          router.push("/login");
        } else {
          const response = await axios.get(`${BASE_URL}auth/check-auth`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status !== 200) {
            // Redirect to the login page if the token is invalid
            toast.error(data.message);
            router.push("/login");
          }
          // do nothing
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };
    checkAuthentication();
  }, []);
  const validationSchema = Yup.object({
    match_name: Yup.string().required("Match Name is required"),
    secretKey: Yup.string().required("Secret Code is required"),
    description: Yup.string().required("Description is required"),
    id_game: Yup.string().required("Game is required"),
  });

  const formik = useFormik({
    initialValues: {
      match_name: "",
      secretKey: "",
      description: "",
      id_game: "",
    },
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      axios
        .post(`${BASE_URL}match/`, values, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          toast.success(response.data.message);
          setLink(response.data.match_url);
          formik.resetForm();
          setIsMatchCreated(true);
        })
        .catch((error) => {
          text = "";
          if (error.response.data.message) {
            switch (error.response.data.message) {
              case "Please fill in all fields":
                text = error.response.data.message;
                break;
              default:
                text = "Error in creating match";
            }
          } else {
            text = "Error in creating match";
          }
          toast.error(text);
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  const createAnotherMatch = () => {
    setIsMatchCreated(false);
    //remove form errors
    setLink("");
    formik.resetForm();
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
    formik.resetForm();
    setCopyText("Copied");
  };

  const games = [
    {
      id: 1,
      name: "Story Telling",
    },
    {
      id: 2,
      name: "Card Game 1",
    },
    {
      id: 3,
      name: "Card Game 2",
    },
  ];

  return (
    <main>
      <Toaster position="top-right" reverseOrder={false} />

      <Navbar />
      <section className="mt-16">
        <div className="min-h-screen flex flex-col justify-start items-center my-16">
          <h1 className="mt-16 text-4xl font-bold text-center text-gray-900 dark:text-white">
            Create a Match
          </h1>

          <form className="mt-8" onSubmit={formik.handleSubmit}>
            <div className="flex flex-col justify-center items-center">
              <input
                type="text"
                name="match_name"
                placeholder="Enter the Match Name"
                className="mt-4 p-2 w-96 border-2 border-gray-200 rounded-md"
                value={formik.values.match_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isMatchCreated}
              />
              {formik.touched.match_name &&
              formik.errors.match_name &&
              !createAnotherMatch ? (
                <div className="text-red-600">{formik.errors.match_name}</div>
              ) : null}

              <input
                type="text"
                name="secretKey"
                placeholder="Enter the Match Secret Code 🤫"
                className="mt-4 p-2 w-96 border-2 border-gray-200 rounded-md"
                value={formik.values.secretKey}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isMatchCreated}
              />
              {formik.touched.secretKey &&
              formik.errors.secretKey &&
              !createAnotherMatch ? (
                <div className="text-red-600">{formik.errors.secretKey}</div>
              ) : null}

              <input
                type="text"
                name="description"
                placeholder="Enter Game Description"
                className="mt-4 p-2 w-96 border-2 border-gray-200 rounded-md"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isMatchCreated}
              />
              {formik.touched.description &&
              formik.errors.description &&
              !createAnotherMatch ? (
                <div className="text-red-600">{formik.errors.description}</div>
              ) : null}

              <select
                name="id_game"
                className="mt-4 p-2 w-96 border-2 border-gray-200 rounded-md"
                disabled={isMatchCreated}
                onChange={formik.handleChange}
                value={formik.values.id_game}
              >
                <option value="" disabled>
                  Select Game
                </option>
                {games.map((game) => (
                  <option key={game.id} value={game.id}>
                    {game.name}
                  </option>
                ))}
              </select>
              {formik.touched.id_game &&
              formik.errors.id_game &&
              !createAnotherMatch ? (
                <div className="text-red-600">{formik.errors.id_game}</div>
              ) : null}

              {isMatchCreated ? (
                <>
                  <button
                    type="button"
                    className="mt-4 p-2 w-96 bg-orange-600 text-white rounded-md"
                    onClick={() => createAnotherMatch()}
                  >
                    Create Another Match
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  className="mt-4 p-2 w-96 bg-blue-500 text-white rounded-md"
                  disabled={formik.isSubmitting}
                >
                  Generate Url
                </button>
              )}

              {isMatchCreated ? (
                <div className="mt-4 ">
                  <p className="text-center text-xl text-green-400 font-bold">
                    !Match Created Successfully. Share the URL with your
                    friends.!
                  </p>
                  <br />
                  <div className="flex gap-3">
                    <a
                      href={link}
                      target="_blank"
                      className="underline text-blue-500 text-lg"
                    >
                      {link}
                    </a>
                    <button
                      onClick={() => copyUrl(link)}
                      className="bg-blue-500 text-white px-2 py-1 rounded-md"
                    >
                      {copyText}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
