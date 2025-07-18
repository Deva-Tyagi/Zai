import React from 'react';
import { 
  Activity, 
  Monitor, 
  Car, 
  Leaf, 
  Waves, 
  BookOpen, 
  Shield, 
  Dumbbell 
} from 'lucide-react';

const Amenities = () => {
  const amenities = [
    {
      icon: <Activity className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-600" />,
      title: "Yoga Deck",
      description: "Unwind and flex your muscles at the yoga deck."
    },
    {
      icon: <Monitor className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-600" />,
      title: "Mini Theatre",
      description: "Catch the latest blockbuster in the exclusive mini theatre."
    },
    {
      icon: <Car className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-600" />,
      title: "Reserved Parking",
      description: "Largest Car Parking with Exclusive Valet Service"
    },
    {
      icon: <Leaf className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-600" />,
      title: "Green Themed Reception",
      description: "Integrate nature into every aspect of your life"
    },
    {
      icon: <Waves className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-600" />,
      title: "Swimming pool",
      description: "India's largest ethnic mall with largest F&B area"
    },
    {
      icon: <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-600" />,
      title: "Reading Lounge",
      description: "Make all your occasions memorable in our multi-purpose hall."
    },
    {
      icon: <Shield className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-600" />,
      title: "Security",
      description: "On Vigil 24x7: Fire Safety & Advanced Security System"
    },
    {
      icon: <Dumbbell className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-600" />,
      title: "Gym",
      description: "one of the best ways to improve your physical health"
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col justify-center py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header - Responsive typography */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-blue-600 mb-8 sm:mb-12 lg:mb-16">
          Features & Amenities
        </h1>
        
        {/* Grid Container - Fully Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {amenities.map((amenity, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-4 sm:p-6 lg:p-8 flex flex-col items-center text-center min-h-[200px] sm:min-h-[220px] lg:min-h-[240px]"
            >
              {/* Icon */}
              <div className="mb-3 sm:mb-4 lg:mb-6 flex-shrink-0">
                {amenity.icon}
              </div>
              
              {/* Title */}
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 lg:mb-4 leading-tight">
                {amenity.title}
              </h3>
              
              {/* Description */}
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed flex-grow">
                {amenity.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Optional: Add a subtle animation for the cards */}
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .grid > div {
            animation: fadeInUp 0.6s ease-out;
          }
          
          .grid > div:nth-child(1) { animation-delay: 0.1s; }
          .grid > div:nth-child(2) { animation-delay: 0.2s; }
          .grid > div:nth-child(3) { animation-delay: 0.3s; }
          .grid > div:nth-child(4) { animation-delay: 0.4s; }
          .grid > div:nth-child(5) { animation-delay: 0.5s; }
          .grid > div:nth-child(6) { animation-delay: 0.6s; }
          .grid > div:nth-child(7) { animation-delay: 0.7s; }
          .grid > div:nth-child(8) { animation-delay: 0.8s; }
        `}</style>
      </div>
    </div>
  );
};

export default Amenities;