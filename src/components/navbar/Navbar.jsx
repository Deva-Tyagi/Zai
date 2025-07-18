import React, { useState, useEffect } from "react";
import { X, Phone, Menu } from "lucide-react";
import emailjs from "@emailjs/browser";
import logo from '../../assets/godrej-logo.png';
import aqua from "../../assets/godrej-codename-aquaman.jpg";
import Project from "../Project/Project";
import Overview from "../Overview/Overview";
import Highlights from "../Highlights/Highlights";
import Amenities from "../Amenities/Amenities";
import FloorPlan from "../FloorPlan/FloorPlan";
import Gallery from "../Gallery/Gallery";
import BannerSection from "../BannerSection/BannerSection";
import CTA from "../CTA/CTA";
import Footer from "../Footer/Footer";

const Navbar = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Added mobile menu state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    consent: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");

  // Initialize EmailJS with your Public Key
  useEffect(() => {
    emailjs.init("FPyANi4X-1gUfsMCI");
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
    setSubmitMessage("");
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.phone || !/^\d{10}$/.test(formData.phone))
      errors.phone = "Valid 10-digit phone number is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Valid email is required";
    if (!formData.consent) errors.consent = "Consent is required";
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage("");

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Get current time for the template
    const currentTime = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    // Map formData to EmailJS template parameters
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      message: formData.message || "User submitted contact form from Navbar.",
      time: currentTime
    };

    // Send email using EmailJS
    try {
      const result = await emailjs.send("service_91dd84g", "template_ncabbum", templateParams);
      console.log("EmailJS Success:", result.text, templateParams);
      setSubmitMessage("Thank you! Your message has been sent successfully.");
      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
        consent: false,
      });
      setFormErrors({});
      setTimeout(() => setIsContactOpen(false), 2000);
    } catch (error) {
      console.error("EmailJS Error:", error.text || error);
      setSubmitMessage(`Failed to send: ${error.text || 'Unknown error'}. Please try again.`);
    }
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-lg" : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <div className="text-2xl font-bold flex items-center">
                <img
                  src={logo}
                  alt="Godrej Properties Logo"
                  className="h-14 mr-2"
                />
              </div>
            </div>

            {/* Desktop Navigation Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("projects")}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                PROJECTS
              </button>
              <button
                onClick={() => scrollToSection("overview")}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                OVERVIEW
              </button>
              <button
                onClick={() => scrollToSection("highlights")}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                HIGHLIGHTS
              </button>
              <button
                onClick={() => scrollToSection("amenities")}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                AMENITIES
              </button>
              <button
                onClick={() => scrollToSection("floor-plan")}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                FLOOR PLAN
              </button>
              <button
                onClick={() => scrollToSection("gallery")}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                GALLERY
              </button>
              <button
                onClick={() => setIsContactOpen(true)}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                CONTACT US
              </button>
            </div>

            {/* Phone Number */}
            <div className="hidden md:flex items-center bg-blue-600 text-white px-4 py-2 rounded">
              <Phone className="w-4 h-4 mr-2" />
              <span className="font-medium">91 9818094754</span>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-blue-600 p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button
                  onClick={() => scrollToSection("projects")}
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium transition-colors w-full text-left"
                >
                  PROJECTS
                </button>
                <button
                  onClick={() => scrollToSection("overview")}
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium transition-colors w-full text-left"
                >
                  OVERVIEW
                </button>
                <button
                  onClick={() => scrollToSection("highlights")}
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium transition-colors w-full text-left"
                >
                  HIGHLIGHTS
                </button>
                <button
                  onClick={() => scrollToSection("amenities")}
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium transition-colors w-full text-left"
                >
                  AMENITIES
                </button>
                <button
                  onClick={() => scrollToSection("floor-plan")}
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium transition-colors w-full text-left"
                >
                  FLOOR PLAN
                </button>
                <button
                  onClick={() => scrollToSection("gallery")}
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium transition-colors w-full text-left"
                >
                  GALLERY
                </button>
                <button
                  onClick={() => {
                    setIsContactOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium transition-colors w-full text-left"
                >
                  CONTACT US
                </button>
                
                {/* Mobile Phone Number */}
                <div className="px-3 py-2 border-t border-gray-200 mt-2">
                  <div className="flex items-center bg-blue-600 text-white px-3 py-2 rounded justify-center">
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="font-medium">91 9818094754</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Real Components Sections */}
      <div className="pt-16">
        <section>
          <BannerSection />
        </section>
        <section id="projects">
          <Project />
        </section>
        <section id="overview">
          <Overview />
        </section>
        <section id="highlights">
          <Highlights />
        </section>
        <section id="amenities">
          <Amenities />
        </section>
        <section id="floor-plan">
          <FloorPlan />
        </section>
        <section id="gallery">
          <Gallery />
        </section>
        <section>
          <CTA />
        </section>
        <section>
          <Footer />
        </section>
      </div>

      {/* Contact Form Popup */}
      {isContactOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg mx-auto my-4 relative">
            <img
              src={aqua}
              alt="Aqua Resort Residences"
              className="h-[300px] w-full object-cover"
            />
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={() => setIsContactOpen(false)}
                className="absolute top-3 right-3 text-white hover:text-gray-200 bg-black bg-opacity-30 rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Content */}
            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-800 text-center mb-1">
                Godrej Properties
              </h2>
              <p className="text-gray-600 text-center mb-4 text-sm">
                Find your dream home today with our expert assistance.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Name and Phone Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      className={`w-full p-2.5 border ${
                        formErrors.name ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:border-blue-500 text-sm`}
                      required
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                    )}
                  </div>
                  <div className="flex">
                    <div className="flex items-center bg-gray-100 px-2 rounded-l-lg border border-r-0 border-gray-300">
                      <span className="text-orange-500 text-xs">🇮🇳</span>
                      <span className="ml-1 text-xs text-gray-600">+91</span>
                    </div>
                    <div className="flex-1">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Your Mobile Number"
                        className={`w-full p-2.5 border ${
                          formErrors.phone ? "border-red-500" : "border-gray-300"
                        } rounded-r-lg focus:outline-none focus:border-blue-500 text-sm`}
                        required
                      />
                      {formErrors.phone && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Email and Message Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Your Email Address"
                      className={`w-full p-2.5 border ${
                        formErrors.email ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:border-blue-500 text-sm`}
                      required
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                    )}
                  </div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Message"
                    rows={1}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none text-sm"
                  />
                </div>

                {/* Consent Checkbox */}
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleInputChange}
                    className={`mt-0.5 w-4 h-4 text-blue-600 border ${
                      formErrors.consent ? "border-red-500" : "border-gray-300"
                    } rounded focus:ring-blue-500 flex-shrink-0`}
                    required
                  />
                  <label className="text-xs text-gray-600 leading-tight">
                    I authorize company representatives to Call, SMS, Email or
                    WhatsApp me about its products and offers. This consent
                    overrides any registration for DNC/NDNC.
                  </label>
                </div>
                {formErrors.consent && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.consent}</p>
                )}

                {/* Submit Message */}
                {submitMessage && (
                  <div
                    className={`text-center py-2 px-4 rounded-lg ${
                      submitMessage.includes("Thank you") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {submitMessage}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2.5 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;