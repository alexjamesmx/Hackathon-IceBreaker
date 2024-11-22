"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/helpers/consts";

export default function Navbar({ is_game }) {
  const router = useRouter();
  const pathname = usePathname(); // Get the current pathname
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const goToLogin = (e) => {
    e.preventDefault();
    router.push("/login");
  };

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    router.push("/login");
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsAuthenticated(false);
        } else {
          const response = await axios.get(`${BASE_URL}auth/check-auth`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status !== 200) {
            console.error(response.data.message);
            setIsAuthenticated(false);
          } else {
            if (pathname === "/") {
              setIsAuthenticated(false);
            } else {
              setIsAuthenticated(true);
            }
          }
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };
    checkAuthentication();
  }, [pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-white border-gray-200 dark:bg-gray-900 z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="./R.png" className="h-8" alt="Icebreaker logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            The Icebreaker Co
          </span>
        </a>
        {!is_game && (
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {isAuthenticated ? (
                <>
                  <li className="content-center">
                    <a
                      href="/dashboard"
                      className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500 "
                      aria-current="page"
                    >
                      Home
                    </a>
                  </li>
                  <li className="content-center">
                    <a
                      href="/matches"
                      className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                      aria-current="page"
                    >
                      Matches
                    </a>
                  </li>

                  <li>
                    <button
                      type="button"
                      onClick={logout}
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="content-center">
                    <a
                      href="#"
                      className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                      aria-current="page"
                    >
                      Home
                    </a>
                  </li>
                  <li className="content-center">
                    <a
                      href="/about"
                      className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                    >
                      About
                    </a>
                  </li>
                  <li className="content-center">
                    <a
                      href="/pricing"
                      className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={goToLogin}
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Login
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
