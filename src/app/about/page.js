import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function About() {
  return (
    <div className="flex flex-col items-center mt-12">
      <Navbar />
      <h1 className="mt-8 text-4xl font-bold text-center text-gray-900 dark:text-white">About Us</h1>
      <div className="mt-8 px-4 max-w-3xl text-center">
        <p className="text-lg text-gray-700 dark:text-gray-300 text-justify">
          We specialize in creating engaging and fun icebreakers that are perfect for both online and real-life teams. Our icebreakers are designed to help you be more creative, collaborative, and connected with your team members.
        </p>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 text-justify">
          Whether you're working remotely or in the same office, our icebreakers provide a great way to break the ice, foster team spirit, and enhance communication. Our activities are easy to set up and can be tailored to fit any group size or dynamic.
        </p>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 text-justify">
          Join thousands of teams who have already discovered the benefits of our icebreakers. Start building stronger, more cohesive teams today with IcebreakerCo!
        </p>
        <img 
          src="./images/teamcollab.png" 
          alt="Team collaboration" 
          className="mt-8 w-full lg:w-2/3 h-48 lg:h-64 object-cover rounded-lg shadow-lg"
        />
      </div>
      <Footer />
    </div>
  );
}