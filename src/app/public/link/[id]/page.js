"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { BASE_URL } from "@/helpers/consts";
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";
import Card from "@/components/card";
import Loader from "@/components/loader";
import { useFormik } from "formik";
import * as Yup from "yup";

const PublicLinkGame = () => {
  const router = useRouter();
  const params = useParams();
  const matchUniqueLink = params.id;
  const [game, setGame] = useState({});
  const [match, setMatch] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [nickname, setNickname] = useState("");

  const games = [
    {
      id: 1,
      nombre: "Story Telling",
      description:
        "A game where players tell a story based on the image sequences. The story can be as long as the player wants, but it must be related to the sequence.",
      imagen: "/images/icebreakercard.png",
      gameUrl: "teamGame",
    },
    {
      id: 2,
      nombre: "Card Game 1",
      description:
        "Card Game 1 is a game where players pick a card and perform the action written on the card. The player with the most points at the end of the game wins.",
      imagen: "/images/stackofcards.png",
      gameUrl: "cardGame",
    },
  ];

  useEffect(() => {
    const getGame = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/match/link/${matchUniqueLink}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          if (response.data.match) {
            let match = response.data.match;
            const game = games.find((game) => game.id === match.id_game);
            setGame(game);
            setMatch(match);
          }
        }
      } catch (error) {
        let text = "An error occurred";
        console.error("An error occurred:", error);
        if (error.response.data.message) {
          text = error.response.data.message;
        }
        toast.error(text);
      } finally {
        setIsLoading(false);
      }
    };
    getGame();
  }, [matchUniqueLink]);

  const formik = useFormik({
    initialValues: {
      nickname: "",
      secret_key: "",
    },
    validationSchema: Yup.object({
      nickname: Yup.string()
        .min(3, "Nickname must be at least 3 characters long")
        .required("Nickname is required"),
      secret_key: Yup.string().required("Secret key is required"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);

      // send nickname to the server
      values.match_id = match.id;

      if (match.secret_key !== values.secret_key) {
        toast.error("Secret key is incorrect");
        setSubmitting(false);
        formik.setErrors({ secret_key: "Secret key is incorrect" });
        return;
      }

      axios
        .post(`${BASE_URL}/match/link/${matchUniqueLink}/join`, values)
        .then((response) => {
          if (response.status === 200) {
            setNickname(values.nickname);
          }
        })
        .catch((error) => {
          let text = "An error occurred";
          console.error("An error occurred:", error);
          if (error.response.data.message) {
            text = error.response.data.message;
          }
          toast.error(text);
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  return (
    <main>
      <Toaster position="top-right" reverseOrder={false} />
      {isLoading && <Loader />}
      <Navbar is_game={true} />
      <section className="mg-5">
        <div className="flex flex-col justify-center items-center my-8">
          <img
            src="./R.png"
            alt="The ice breaker company logo"
            className="w-80 h-80 md:w-96 md:h-96 lg:w-112 lg:h-112"
          />
          <p className="mt-4 text-center text-lg text-white">
            Get Ready to Play!
          </p>
        </div>
      </section>
      {nickname === "" ? (
        <div className="flex justify-center items-center min-h-64 flex-col min-w-fit">
          <div className="flex justify-center items-center flex-col gap-6">
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                id="nickname"
                name="nickname"
                placeholder="Enter your nickname"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nickname}
                className="border-2 border-gray-300 p-2 rounded-lg"
              />
              {formik.touched.nickname && formik.errors.nickname ? (
                <div className="text-red-500">{formik.errors.nickname}</div>
              ) : null}

              <input
                type="text"
                id="secret_key"
                name="secret_key"
                placeholder="Enter the secret"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.secret_key}
                className="border-2 border-gray-300 p-2 rounded-lg"
              />
              {formik.touched.secret_key && formik.errors.secret_key ? (
                <div className="text-red-500">{formik.errors.secret_key}</div>
              ) : null}
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Join Game
              </button>
            </form>
          </div>
        </div>
      ) : (
        <>
          <div className="max-w-screen-xl mx-auto p-4 sm:grid sm:grid-cols-1 sm:justify-center sm:items-center md:grid-cols-3 lg:flex lg:justify-center lg:items-center gap-4">
            <Card
              title={game.nombre}
              description={game.description}
              gameUrl={`${match.match_url}/${game.gameUrl}`}
              image={game.imagen}
            />
          </div>
        </>
      )}
      <Footer />
    </main>
  );
};

export default PublicLinkGame;
