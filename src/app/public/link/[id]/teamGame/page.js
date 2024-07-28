"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const TeamGame = () => {
  const [names, setNames] = useState([]);
  const [started, setStarted] = useState(false);
  const [currentMember, setCurrentMember] = useState(0);
  const [timer, setTimer] = useState(30);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    // Simulate fetching names
    const simulatedNames = [
      "Alice",
      "Bob",
      "Charlie",
      "David",
      "Eve",
      "Frank",
      "Grace",
      "Clau",
    ];
    setNames(simulatedNames);
  }, []);

  useEffect(() => {
    let countdown;
    if (showImage && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(countdown);
      nextMember();
    }
    return () => clearInterval(countdown);
  }, [showImage, timer]);

  const startGame = () => {
    setStarted(true);
    setShowImage(true);
  };

  const nextMember = () => {
    if (currentMember < names.length - 1) {
      setCurrentMember(currentMember + 1);
      setTimer(30);
    } else {
      setShowImage(false);
      alert("Game Over!");
    }
  };

  const getRandomImage = () => {
    const randomId = Math.floor(Math.random() * 1000); // Generate a random number for the image ID
    return `https://picsum.photos/200/300?random=${randomId}`;
  };

  return (
    <div>
      <Navbar is_game={true} />
      <div className="flex flex-col items-center p-4">
        <h1 className="text-2xl font-bold mb-4">Team Game</h1>
        {!started ? (
          <>
            <div className="mt-8 mb-4 grid grid-cols-2 gap-4 w-full max-w-4xl">
              <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-2 text-white">
                  Instructions
                </h2>
                <p className="text-white">
                  Press "Start" to begin the game. A random image will appear,
                  and each participant will take turns creating a story based on
                  the image within 5 seconds. The game continues until everyone
                  has had a turn. Have fun!.
                </p>
                <button
                  onClick={startGame}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-4"
                >
                  Start
                </button>
              </div>
              <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-2 text-white">
                  Participants:
                </h2>
                <ul className="text-white">
                  {names.map((name, idx) => (
                    <li key={idx} className="list-disc list-inside">
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        ) : showImage ? (
          <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl font-bold mb-4">Storytelling Time!</h2>
            <img src={getRandomImage()} alt="Random" className="mb-4" />
            <p>
              {names[currentMember]}, you have {timer} seconds left.
            </p>
          </div>
        ) : (
          <div>Good job</div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default dynamic(() => Promise.resolve(TeamGame), { ssr: false });
