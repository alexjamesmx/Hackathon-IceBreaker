"use client";
import React, { useEffect, useState } from "react";
import "./cardGame.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
// import { getOpenAIResponse } from "@/app/api/game/route";

function CardGame() {
  const [cards, setCards] = useState([]);
  const [isScattered, setIsScattered] = useState(false);
  // const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  useEffect(() => {
    setTimeout(() => {
      setIsScattered(true);
    }, 1);
  }, []);

  const removeTopCard = () => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      const topCard = newCards.pop();
      console.log("Removing top card:", topCard);
      newCards.push(
        React.cloneElement(topCard, { className: "card is-offscreen--l" })
      );
      setTimeout(() => {
        setCards(newCards.slice(0, newCards.length - 1));
      }, 500);
      return newCards;
    });
  };

  const addNewCard = () => {
    const newCard = (
      <div className="card is-offscreen--r absolute top-0 left-0 w-full h-full bg-white shadow-md transition-all duration-500 ease-in-out">
        <header className="card-header">
          <h3>Card Title</h3>
        </header>
        <div className="card-body">Body Content</div>
      </div>
    );
    setCards((prevCards) => [...prevCards, newCard]);
    setTimeout(() => {
      setCards((prevCards) => {
        const newCards = [...prevCards];
        newCards[newCards.length - 1] = React.cloneElement(newCard, {
          className: "card",
        });
        return newCards;
      });
    }, 1);
  };

  return (
    <div className="flex flex-col items-center mt-12">
      <Navbar is_game={true} />
      <div
        className={`deck relative w-72 h-48 mt-40 ${
          isScattered ? "is-scattered" : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          removeTopCard();
        }}
      >
        {cards.map((card, index) => {
          console.log("Rendering card:", card);
          return React.cloneElement(card, { key: index });
        })}
      </div>
      <p className="body-message">Click to become more creative.</p>
      <div onClick={addNewCard} className="absolute inset-0"></div>
      <Footer />
    </div>
  );
}

export default CardGame;
