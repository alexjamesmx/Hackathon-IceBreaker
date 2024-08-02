"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../app/globals.css";
import Navbar from "../components/navbar";
import Card from "@/components/card";
import Footer from "@/components/footer";
// import fetchResponse from "./api/game/route"; // Adjusted import

const prompt =
  "Give me a creative question like 'How would you hide a giraffe from the government?'";

const cardData = [
  {
    id: 1,
    title: "About Us",
    description:
      "Team focused on creating fun and engaging icebreakers for your team. Break the ice and get to know each other better!",
    image: "./images/zoomcall2.png",
    buttonText: "Learn More",
    gameUrl: "/about",
  },
  {
    id: 2,
    title: "Pricing",
    description: "Ready to boost team collaboration with a fun challenge?",
    image: "./images/icebreakercard.png",
    buttonText: "View Pricing",
    gameUrl: "/pricing",
  },
];

export default function Home() {
  const [question, setQuestion] = useState("");
  const router = useRouter(); // Use useRouter to get router object

  const goToLogin = () => {
    router.push("/register"); // Redirect to /login
  };

  useEffect(() => {
    // fetchResponse(setQuestion, prompt);
  }, []);

  return (
    <main>
      <Navbar />
      <section className="mg-5">
        <div className="flex flex-col justify-center items-center my-8">
          <img
            src="https://svgshare.com/i/18hF.svg"
            alt="The ice breaker company logo"
            className="w-80 h-80 md:w-96 md:h-96 lg:w-112 lg:h-112"
          />
          <p className="mt-4 text-center text-lg text-white">
            Turning Awkward Silences into Laughs Since 2024
          </p>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={goToLogin} // Call the function on click
          >
            Get Started
          </button>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto p-4 sm:grid sm:grid-cols-1 sm:justify-center sm:items-center md:grid-cols-3 lg:flex lg:justify-center lg:items-center gap-4">
        {cardData.map((card) => (
          <Card
            key={card.id}
            title={card.title}
            description={card.description}
            image={card.image}
            buttonText={card.buttonText}
            gameUrl={card.gameUrl}
          />
        ))}
      </div>
      {/* <div className="flex justify-center items-center mt-8">
        <div className="bg-gray-100 p-4 rounded shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">Creative Question</h2>
          <p className="text-lg">{question}</p>
        </div>
      </div> */}
      <Footer />
    </main>
  );
}
