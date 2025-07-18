import React, { useState } from 'react';
import { X, MapPin, Home, CheckCircle } from 'lucide-react';
import serene from '../../assets/godrej-serene.jpg';
import park from '../../assets/Godrej-Park-Springs.png'
import urban from '../../assets/Godrej-Urban-Retreat.png'
import river from '../../assets/godrej-river-crest.webp'
import emailjs from '@emailjs/browser';


const ProjectsSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const projects = [
    {
      id: 1,
      title: "Godrej Park Springs",
      location: "At Kharadi-Manjari Road, Pune",
      type: "2 & 3 BHK Smart & Comfort Homes",
      price: "₹ 74.99 Lacs* Onwards",
      image: park,
      features: [
        "10 Acres of Central Greenery",
        "Olympics Sized Swimming Pool",
        "6500+ sq.m. of Massive Clubhouse",
        "Stay Informed: Sign Up For Updates"
      ],
      showPrice: true,
      isNewLaunch: false
    },
     {
      id: 2,
      title: "Godrej Urban Retreat",
      location: "At Kharadi-Manjari Road, Pune",
      type: "2 & 3 BHK Luxury Apartments",
      price: "₹ 85 Lacs* Onwards",
      image: urban,
      features: [
        "10 Acres of Central Greenery",
        "6500+ sq.m. of Massive Clubhouse",
        "2000+ sq.m. Of Exclusive Health Centre",
        "4-Tier Security"
      ],
      showPrice: false,
      isNewLaunch: false
    },
      {
      id: 3,
      title: "Godrej River Crest",
      location: "At Manjari Khurd, Pune",
      type: "2, 3 & 4 BHK Apartments",
      price: "₹ 78 Lacs* Onwards",
      image: river,
      features: [
        "Riverfront Living in Manjari Micro-Market",
        "4.5 Acres of Central Greens",
        "40+ Lifestyle Amenities",
        "Grand Clubhouse with River Views"
      ],
      showPrice: false,
      isNewLaunch: false
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.mobile || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // EmailJS integration would go here
      await emailjs.send('service_91dd84g', 'template_ncabbum', formData, 'FPyANi4X-1gUfsMCI');
      
      // For demo purposes, we'll simulate the submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Thank you for your interest! We will contact you soon.');
      setFormData({ name: '', mobile: '', email: '', message: '' });
      setIsModalOpen(false);
    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = (project = null) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
    setFormData({ name: '', mobile: '', email: '', message: '' });
  };

  return (
    <div className="bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-600 mb-4">EXPLORE OUR PROJECTS</h2>
          <p className="text-xl text-gray-700 font-medium">60,000+ HAPPY FAMILIES & ADDING MORE EVERY MONTH</p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Project Image */}
              <div className="relative">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                
                {/* New Launch Badge */}
                {project.isNewLaunch && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">NEW</div>
                    <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold mt-1">LAUNCH</div>
                  </div>
                )}
                
                {/* Launching New Tower Badge */}
                {project.launchingNewTower && (
                  <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded text-xs font-bold">
                    Launching New Tower: T1 & T7
                  </div>
                )}
              </div>

              {/* Project Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">{project.title}</h3>
                
                <div className="flex items-start mb-3">
                  <MapPin className="w-4 h-4 text-gray-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{project.location}</span>
                </div>

                <div className="mb-4">
                  <span className="text-blue-600 font-semibold">Type : </span>
                  <span className="text-gray-700">{project.type}</span>
                </div>

                {/* Price or Click for Info */}
                {project.showPrice ? (
                  <div className="text-2xl font-bold text-blue-600 mb-4">
                    {project.price}
                  </div>
                ) : (
                  <div className="text-lg font-semibold text-orange-600 mb-4 cursor-pointer hover:text-orange-700" 
                       onClick={() => openModal(project)}>
                    Click here for more info
                  </div>
                )}

                {/* Features */}
                <div className="mb-6">
                  {project.features.map((feature, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Interest Button */}
                <button 
                  onClick={() => openModal(project)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                >
                  Interested
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* More Projects Detail Button */}
        <div className="text-center mt-12">
          <button 
            onClick={() => openModal(null)}
            className="bg-orange-600 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:bg-orange-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            More Projects Detail
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Modal Content */}
              <div className="flex flex-col lg:flex-row">
                {/* Left Side - Image */}
                <div className="lg:w-1/2 relative">
                  <img 
                    src={selectedProject?.image || serene} 
                    alt={selectedProject?.title || "Our Projects"}
                    className="w-full h-64 lg:h-96 object-cover"
                  />
                  
                  {/* Overlay with project info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {selectedProject?.title || "Our Premium Projects"}
                    </h3>
                    <p className="text-white/90 mb-4">
                      Find your dream home today with our expert assistance.
                    </p>
                  </div>
                </div>

                {/* Right Side - Form */}
                <div className="lg:w-1/2 p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    {selectedProject?.title || "Get More Project Details"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Find your dream home today with our expert assistance.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-blue-600 outline-none transition-colors"
                        required
                      />
                    </div>

                    <div className="flex">
                      <div className="flex items-center bg-gray-100 px-3 py-3 border-b-2 border-gray-300">
                        <div className="w-6 h-4 mr-2 bg-gradient-to-b from-orange-500 via-white to-green-500 rounded-sm border border-gray-300"></div>
                        <span className="text-gray-700">+91</span>
                      </div>
                      <input
                        type="tel"
                        name="mobile"
                        placeholder="Your Mobile Number"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-3 border-b-2 border-gray-300 focus:border-blue-600 outline-none transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Your Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-blue-600 outline-none transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <textarea
                        name="message"
                        placeholder="Message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-blue-600 outline-none transition-colors resize-none"
                      />
                    </div>

                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="consent"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1 mr-3"
                        required
                      />
                      <label htmlFor="consent" className="text-sm text-gray-700">
                        I authorize company representatives to Call, SMS, Email or WhatsApp me about its products and offers.
                        This consent overrides any registration for DNC/NDNC.
                      </label>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsSection;