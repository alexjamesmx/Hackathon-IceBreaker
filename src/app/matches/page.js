"use client";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";
import { FaExternalLinkAlt, FaTrash } from "react-icons/fa";
import Navbar from "../../components/navbar";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/helpers/consts";
import axios from "axios";
import "../../app/globals.css";
import Loader from "@/components/Loader";

export default function Matches() {
  const router = useRouter();
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isNavReady, setIsNavReady] = useState(false);

  const handleNavReady = () => {
    setIsNavReady(true);
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
        } else {
          const response = await axios.get(`${BASE_URL}auth/check-auth`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status !== 200) {
            toast.error(response.data.message);
            router.push("/login");
          }
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };
    checkAuthentication();
  }, []);

  useEffect(() => {
    const getMatches = async () => {
      try {
        const response = await axios.get(`${BASE_URL}match/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.matches) {
          setMatches(response.data.matches);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getMatches();
  }, []);

  const statusConverter = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "playing":
        return "Playing";
      case "completed":
        return "Completed";
      default:
        return "Unknown";
    }
  };

  const dateConverter = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hours = d.getHours();
    const minutes = d.getMinutes();

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  return (
    <>
      <main>
        <Toaster position="top-right" reverseOrder={false} />
        <Navbar onReady={handleNavReady} />
        <section className="mt-16">
          <div className="min-h-screen flex flex-col justify-start items-center my-16">
            <h1 className="mt-16 text-4xl font-bold text-center text-gray-900 dark:text-white">
              Matches
            </h1>
            <div className="mt-16 flex justify-center items-center dark:bg-gray-800 p-7 rounded-lg shadow-lg w-3/4 min-w-fit overflow-x-auto">
              {isLoading ? (
                <div className="text-center text-white">Loading...</div>
              ) : (
                <table className="w-full min-w-full bg-white dark:bg-gray-800 p-7 text-white">
                  <thead>
                    <tr className="w-full h-16 border-gray-300 border-b py-8">
                      <th className="pl-4 text-orange-500">Match Name</th>
                      <th className="pl-12 text-orange-500">Description</th>
                      <th className="pl-12 text-orange-500">Secret Key</th>
                      <th className="pl-12 text-orange-500">Link</th>
                      <th className="pl-12 text-orange-500">Date Created</th>
                      <th className="pl-12 text-orange-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches.length > 0 ? (
                      matches.map((match) => (
                        <tr
                          key={match.id}
                          className="h-20 text-center border-gray-300 border-b"
                        >
                          <td className="pl-4">{match.match_name}</td>
                          <td className="pl-12">{match.description}</td>
                          <td className="pl-12">{match.secret_key}</td>
                          <td className="pl-12">{match.match_url}</td>
                          <td className="pl-12">
                            {dateConverter(match.created_at)}
                          </td>
                          <td className="pl-12">
                            <button
                              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                              onClick={() =>
                                router.push(`/matches/${match.id}`)
                              }
                            >
                              <FaExternalLinkAlt />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No matches found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
