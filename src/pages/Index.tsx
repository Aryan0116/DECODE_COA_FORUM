import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
export default function DecodeCOAForum() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [animatedElements, setAnimatedElements] = useState([]);
  
  // Generate animated background elements
  useEffect(() => {
    const elements = Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: Math.random() * 200 + 50,
      height: Math.random() * 200 + 50,
      delay: Math.random() * 5,
      duration: Math.random() * 20 + 10
    }));
    
    setAnimatedElements(elements);
    setIsLoaded(true);
  }, []);
  
  // Handle logo rotation
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);
    
    return () => clearInterval(rotationInterval);
  }, []);

  const fadeInClass = isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8";

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-blue-100 to-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {animatedElements.map((el) => (
            <div
              key={el.id}
              className="absolute rounded-full bg-blue-200 opacity-20 animate-pulse"
              style={{
                left: el.left,
                top: el.top,
                width: el.width,
                height: el.height,
                animationDelay: `${el.delay}s`,
                animationDuration: `${el.duration}s`
              }}
            />
          ))}
        </div>

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="flex flex-col items-center space-y-8 text-center">
            {/* Rotating Logo */}
            <div className="w-32 h-32 mb-4 transition-transform duration-300 transform hover:scale-110">
              <img 
                src="https://github.com/Aryan0116/DECODE-CO-A/blob/main/favicon.png?raw=true" 
                alt="DECODE CO-A Logo" 
                className="w-full h-full object-contain transition-transform duration-300"
                style={{ transform: `rotate(${rotation}deg)` }}
              />
            </div>

            <div className={`space-y-4 transition-all duration-700 ${fadeInClass}`}>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Welcome to DECODE CO-A
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                Your collaborative learning platform. Ask questions, share knowledge, and grow together.
              </p>
            </div>
            
            <div className={`space-x-4 transition-all duration-700 delay-300 ${fadeInClass}`}>
              <Link to="/forum">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                Explore the Forum
              </button>
              </Link>
              <Link to="/register">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105">
                Sign Up
              </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <div className="transition-all duration-500 transform hover:-translate-y-2 hover:shadow-xl">
              <div className="p-1 rounded-lg border-2 border-blue-100 hover:border-blue-300 transition-all duration-300">
                <div className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="rounded-full bg-blue-100 p-3 transition-transform duration-300 transform hover:scale-110">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-blue-600"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <path d="M12 17h.01" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Ask Questions</h3>
                  <p className="text-gray-500">
                    Stuck on a problem? Ask the community and get answers from peers and teachers.
                  </p>
                </div>
              </div>
            </div>

            <div className="transition-all duration-500 transform hover:-translate-y-2 hover:shadow-xl">
              <div className="p-1 rounded-lg border-2 border-green-100 hover:border-green-300 transition-all duration-300">
                <div className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="rounded-full bg-green-100 p-3 transition-transform duration-300 transform hover:scale-110">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-green-600"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Join Discussions</h3>
                  <p className="text-gray-500">
                    Participate in engaging discussions, share your insights, and learn from others.
                  </p>
                </div>
              </div>
            </div>

            <div className="transition-all duration-500 transform hover:-translate-y-2 hover:shadow-xl">
              <div className="p-1 rounded-lg border-2 border-amber-100 hover:border-amber-300 transition-all duration-300">
                <div className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="rounded-full bg-amber-100 p-3 transition-transform duration-300 transform hover:scale-110">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-amber-600"
                    >
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Stay Updated</h3>
                  <p className="text-gray-500">
                    Receive announcements from teachers and stay informed about important updates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Join Our Learning Community
                </h2>
                <p className="max-w-[600px] text-gray-600 md:text-xl">
                  DECODE CO-A is more than just a forum—it's a collaborative learning environment 
                  where students and teachers come together to share knowledge, ask questions, 
                  and support each other.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                  Get Started
                </button>
              </div>
            </div>

            <div className="mx-auto aspect-video overflow-hidden rounded-xl shadow-xl transition-transform duration-300 transform hover:scale-103">
              <img
                alt="Students collaborating"
                className="h-full w-full object-cover"
                height="310"
                src="https://github.com/Aryan0116/DECODE-CO-A/blob/main/home.png?raw=true"
                width="550"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button
      <div className={`fixed bottom-8 right-8 z-50 transition-all duration-1000 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
        <button 
          className="rounded-full w-16 h-16 bg-blue-600 hover:bg-blue-700 shadow-lg flex items-center justify-center text-white transition-transform duration-300 hover:scale-110"
          aria-label="Chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div> */}
    </div>
  );
}