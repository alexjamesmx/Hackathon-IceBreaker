"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { BASE_URL } from "@/helpers/consts";
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";
import { IoCaretBackCircle } from "react-icons/io5";

export default function MatchDetail() {
  const router = useRouter();
  const [match, setMatch] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();

  const match_id = params.id;
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
            toast.error("Login expired. Please login again.");
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

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/match/${match_id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.status === 200) {
          if (response.data.match) {
            setMatch(response.data.match);
          }
        }
      } catch (error) {
        toast.error("Error in fetching match");
        console.error("An error occurred:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMatch();
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
    //year, month, day and time
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hours = d.getHours();
    const minutes = d.getMinutes();

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const goBack = () => {
    router.back();
  };

  return (
    <main>
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />
      <section className="mt-16">
        <div className="min-h-screen flex flex-col justify-start items-center my-16 w-full px-16">
          <div className="mt-16 flex items-center w-full">
            <IoCaretBackCircle
              size={64}
              onClick={goBack}
              color="orange"
              style={{ cursor: "pointer" }}
              className="hover:scale-110 transform transition duration-300 ease-in-out"
            />
            <div className="flex-1 text-center flex-row">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Match: {match.match_name}
              </h1>
            </div>
          </div>
          {/* paint the table with the scores */}

          <div className="mt-16 flex justify-center items-center  dark:bg-gray-800 p-7 rounded-lg shadow-lg w-3/4 min-w-fit">
            {isLoading ? (
              <div className="text-center text-white">Loading...</div>
            ) : (
              <table className="w-full bg-white dark:bg-gray-800 p-7 text-white">
                <thead>
                  <tr className="w-full h-16 border-gray-300 border-b py-8">
                    <th className="pl-4  text-orange-500">Player Nickname</th>
                    <th className="pl-4  text-orange-500">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {match?.players?.length > 0 ? (
                    match.players.map((player) => (
                      <tr
                        key={player.id}
                        className="h-20 text-center border-gray-300 border-b"
                      >
                        <td className="pl-4">{player.nickname}</td>
                        <td className="pl-4">
                          {dateConverter(player.created_at)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center">
                        No players found
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
  );
}
