import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/components/theme/ThemeProvider'; // Import the theme context

export default function DecodeCOAForum() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [animatedElements, setAnimatedElements] = useState([]);
  
  // Use the shared theme context instead of local state
  const { theme } = useTheme(); // This hook will get the current theme from context
  const isDarkMode = theme === 'dark';
  
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
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      {/* Theme Toggle Button Removed - Now using the shared theme toggle from Header */}

      {/* Hero Section */}
      <section className={`relative py-12 md:py-20 ${isDarkMode ? 'bg-gradient-to-b from-indigo-900 to-gray-900' : 'bg-gradient-to-b from-indigo-100 to-white'} overflow-hidden transition-colors duration-300`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {animatedElements.map((el) => (
            <div
              key={el.id}
              className={`absolute rounded-full ${isDarkMode ? 'bg-indigo-600 opacity-10' : 'bg-indigo-200 opacity-20'} animate-pulse transition-colors duration-300`}
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
          <div className="flex flex-col items-center space-y-6 md:space-y-8 text-center">
            {/* Rotating Logo */}
            <div className="w-24 h-24 md:w-32 md:h-32 mb-2 md:mb-4 transition-transform duration-300 transform hover:scale-110">
              <img 
                src="https://github.com/Aryan0116/DECODE-CO-A/blob/main/favicon.png?raw=true" 
                alt="DECODE CO-A Logo" 
                className="w-full h-full object-contain transition-transform duration-300"
                style={{ transform: `rotate(${rotation}deg)` }}
              />
            </div>

            <div className={`space-y-3 md:space-y-4 transition-all duration-700 ${fadeInClass}`}>
              <h1 className="text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Welcome to DECODE CO-A FORUM
              </h1>
              <p className={`mx-auto max-w-[700px] text-sm md:text-base lg:text-xl px-4 md:px-0 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Your collaborative learning platform. Ask questions, share knowledge, and grow together.
              </p>
            </div>
            
            <div className={`flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 transition-all duration-700 delay-300 ${fadeInClass}`}>
              <Link to="/forum">
                <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 w-full sm:w-auto ${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'} transition-all duration-300 transform hover:scale-105`}>
                  Explore the Forum
                </button>
              </Link>
              <Link to="/register">
                <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 w-full sm:w-auto ${isDarkMode ? 'bg-gray-800 border border-indigo-500 text-indigo-400 hover:bg-gray-700' : 'bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50'} transition-all duration-300 transform hover:scale-105`}>
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 lg:py-24 transition-colors duration-300">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            <div className="transition-all duration-500 transform hover:-translate-y-2 hover:shadow-xl">
              <div className={`p-1 rounded-lg ${isDarkMode ? 'border-2 border-indigo-800 hover:border-indigo-600' : 'border-2 border-indigo-100 hover:border-indigo-300'} transition-all duration-300`}>
                <div className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className={`rounded-full ${isDarkMode ? 'bg-indigo-900' : 'bg-indigo-100'} p-3 transition-transform duration-300 transform hover:scale-110`}>
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
                      className={`h-6 w-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <path d="M12 17h.01" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold">Ask Questions</h3>
                  <p className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Stuck on a problem? Ask the community and get answers from peers and teachers.
                  </p>
                </div>
              </div>
            </div>

            <div className="transition-all duration-500 transform hover:-translate-y-2 hover:shadow-xl">
              <div className={`p-1 rounded-lg ${isDarkMode ? 'border-2 border-purple-800 hover:border-purple-600' : 'border-2 border-purple-100 hover:border-purple-300'} transition-all duration-300`}>
                <div className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className={`rounded-full ${isDarkMode ? 'bg-purple-900' : 'bg-purple-100'} p-3 transition-transform duration-300 transform hover:scale-110`}>
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
                      className={`h-6 w-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold">Join Discussions</h3>
                  <p className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Participate in engaging discussions, share your insights, and learn from others.
                  </p>
                </div>
              </div>
            </div>

            <div className="transition-all duration-500 transform hover:-translate-y-2 hover:shadow-xl md:col-span-2 lg:col-span-1">
              <div className={`p-1 rounded-lg ${isDarkMode ? 'border-2 border-violet-800 hover:border-violet-600' : 'border-2 border-violet-100 hover:border-violet-300'} transition-all duration-300`}>
                <div className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className={`rounded-full ${isDarkMode ? 'bg-violet-900' : 'bg-violet-100'} p-3 transition-transform duration-300 transform hover:scale-110`}>
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
                      className={`h-6 w-6 ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`}
                    >
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold">Stay Updated</h3>
                  <p className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Receive announcements from teachers and stay informed about important updates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className={`py-12 md:py-16 ${isDarkMode ? 'bg-gradient-to-b from-gray-900 to-indigo-950' : 'bg-gradient-to-b from-white to-indigo-50'} transition-colors duration-300`}>
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-8 lg:gap-10 lg:grid-cols-2">
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tighter lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  Join Our Learning Community
                </h2>
                <p className={`max-w-[600px] text-sm md:text-base lg:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  DECODE CO-A Forum is more than just a forum—it's a collaborative learning environment 
                  where students and teachers come together to share knowledge, ask questions, 
                  and support each other.
                </p>
              </div>
              <Link to="/Forum">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 ${isDarkMode ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'} transition-all duration-300 transform hover:scale-105`}>
                  Get Started
                </button>
              </div>
              </Link>
            </div>

            <a href="https://aryan0116.github.io/DECODE-CO-A/" target="_blank" rel="noopener noreferrer">
  <div className="mx-auto w-full max-w-md lg:max-w-none aspect-video overflow-hidden rounded-xl shadow-xl transition-transform duration-300 transform hover:scale-103 mt-8 lg:mt-0">
    <img
      alt="Students collaborating"
      className="h-full w-full object-cover"
      height="310"
      src="https://github.com/Aryan0116/DECODE-CO-A/blob/main/home.png?raw=true"
      width="550"
    />
  </div>
</a>

          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      {/* <div className={`fixed bottom-4 md:bottom-8 right-4 md:right-8 z-40 transition-all duration-1000 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
        <button 
          className={`rounded-full w-12 h-12 md:w-16 md:h-16 ${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'} shadow-lg flex items-center justify-center text-white transition-transform duration-300 hover:scale-110`}
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
            className="h-5 w-5 md:h-6 md:w-6"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div> */}
    </div>
  );
}