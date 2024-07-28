"use client";
import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import "@/app/globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import axios from "axios";
import { BASE_URL } from "@/helpers/consts";
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string().required("Required"),
});

export default function Login() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);
      // send with token
      axios
        .post(`${BASE_URL}/auth/login`, values)
        .then((response) => {
          console.log(response.data);
          const token = response.data.token;
          localStorage.setItem("token", token);

          router.push("/dashboard");
        })
        .catch((error) => {
          console.error(error);
          if (error.response.data.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("There was an error");
          }
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  const goToRegister = (e) => {
    e.preventDefault();
    router.push("/register");
  };

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
            router.push("/login");
          } else {
            router.push("/dashboard");
          }
        }
      } catch (error) {
        console.error("An error occurred:", error);
        toast.error("There was an error");
      }
    };
    checkAuthentication();
  }, []);

  return (
    <main>
      <Toaster position="top-right" reverseOrder={false} />

      <Navbar />
      <section className="flex items-center justify-center min-h-screen">
        <div className="min-h-96 min-w-fit w-96 h-4/5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <form className="p-5" onSubmit={formik.handleSubmit}>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Login
            </h5>
            <div className="mb-3">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-400"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-600">{formik.errors.email}</div>
              ) : null}
            </div>
            <div className="mb-3">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-400"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-600">{formik.errors.password}</div>
              ) : null}
            </div>
            <div className="mt-16">
              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                disabled={formik.isSubmitting}
              >
                Login
              </button>
            </div>
            <div className="mt-3">
              <a
                href="#"
                className="text-blue-700 hover:underline"
                onClick={goToRegister}
              >
                Dont have an account? Register
              </a>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
}
