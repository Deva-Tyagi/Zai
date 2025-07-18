import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Phone, MessageCircle, X, Download, MapPin } from 'lucide-react';
import emailjs from '@emailjs/browser';
import banner2 from '../../assets/banner2.webp';
import banner3 from '../../assets/banner3.webp';
import banner4 from '../../assets/banner4.jpg';

const BannerSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showBrochurePopup, setShowBrochurePopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [brochureFormData, setBrochureFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [brochureFormErrors, setBrochureFormErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState('');

  // Configuration
  const config = {
    whatsappNumber: '+919818094754',
    phoneNumber: '+919818094754',
    popupInterval: 12000,
    emailjsServiceId: 'service_91dd84g',
    emailjsTemplateId: 'template_ncabbum',
    emailjsPublicKey: 'FPyANi4X-1gUfsMCI' // Replace with your EmailJS Public Key
  };

  // Use imported images directly
  const backgroundImages = [banner2, banner3, banner4];

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(config.emailjsPublicKey);
  }, []);

  // Auto-slide carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // Fixed popup functionality
  const startPopupTimer = useCallback(() => {
    return setTimeout(() => {
      setShowPopup(true);
    }, config.popupInterval);
  }, [config.popupInterval]);

  useEffect(() => {
    const timer = startPopupTimer();
    return () => clearTimeout(timer);
  }, [startPopupTimer]);

  const closePopup = () => {
    setShowPopup(false);
    setFormErrors({});
    setSubmitMessage('');
    // Start a new timer when popup is closed
    setTimeout(() => {
      const timer = startPopupTimer();
      return () => clearTimeout(timer);
    }, 0);
  };

  const closeBrochurePopup = () => {
    setShowBrochurePopup(false);
    setBrochureFormErrors({});
    setSubmitMessage('');
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + backgroundImages.length) % backgroundImages.length);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleBrochureInputChange = (e) => {
    const { name, value } = e.target;
    setBrochureFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setBrochureFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = (data, isBrochureForm = false) => {
    const errors = {};
    if (!data.name) errors.name = 'Name is required';
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) errors.email = 'Valid email is required';
    if (!data.phone || !/^\d{10}$/.test(data.phone)) errors.phone = 'Valid 10-digit phone number is required';
    // if (!isBrochureForm && !data.message) errors.message = 'Message is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // Validate form
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
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
      message: formData.message,
      time: currentTime
    };

    try {
      await emailjs.send(config.emailjsServiceId, config.emailjsTemplateId, templateParams);
      console.log('Email sent successfully:', templateParams);
      setSubmitMessage('Thank you! We will contact you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setFormErrors({});
      setTimeout(() => setShowPopup(false), 2000);
    } catch (error) {
      console.error('Error sending email:', error.text || error);
      setSubmitMessage(`Failed to send: ${error.text || 'Unknown error'}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBrochureSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // Validate form
    const errors = validateForm(brochureFormData, true);
    if (Object.keys(errors).length > 0) {
      setBrochureFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    // Get current time for the template
    const currentTime = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    // Map brochureFormData to EmailJS template parameters
    const templateParams = {
      from_name: brochureFormData.name,
      from_email: brochureFormData.email,
      phone: brochureFormData.phone,
      message: 'User requested to download the investment brochure.',
      time: currentTime
    };

    try {
      await emailjs.send(config.emailjsServiceId, config.emailjsTemplateId, templateParams);
      console.log('Email sent successfully:', templateParams);
      setSubmitMessage('Thank you! We will contact you soon.');
      setBrochureFormData({ name: '', email: '', phone: '' });
      setBrochureFormErrors({});
      setTimeout(() => setShowBrochurePopup(false), 2000);
    } catch (error) {
      console.error('Error sending email:', error.text || error);
      setSubmitMessage(`Failed to send: ${error.text || 'Unknown error'}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hi, I am interested in your property projects. Please provide more details.');
    window.open(`https://wa.me/${config.whatsappNumber.replace('+', '')}?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${config.phoneNumber}`, '_self');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Property ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
        ))}
      </div>

      {/* Carousel Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 sm:p-2 rounded-full hover:bg-opacity-70 transition-all z-10"
      >
        <ChevronLeft size={20} className="sm:size-[24px]" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 sm:p-2 rounded-full hover:bg-opacity-70 transition-all z-10"
      >
        <ChevronRight size={20} className="sm:size-[24px]" />
      </button>

      {/* Carousel Indicators */}
      <div className="absolute bottom-16 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* Left Content */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-8 lg:py-0">
          <div className="max-w-xl">
            <div className="flex items-center text-white mb-4">
              <MapPin size={16} className="mr-2 sm:size-[20px]" />
              <span className="text-sm sm:text-lg"> Pune, India </span>
            </div>

            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              GODREJ PROPERTIES
            </h1>

            <h2 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-6 sm:mb-8">
              Luxury 3 & 4 Bedroom Residences Starts
            </h2>

            <button
              onClick={() => setShowBrochurePopup(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold flex items-center transition-colors text-sm sm:text-base"
            >
              <Download size={16} className="mr-2 sm:size-[20px]" />
              Download Brochure
            </button>
          </div>
        </div>

        {/* Right Side - Quick Enquiry Form */}
        <div className="w-full lg:max-w-md bg-black bg-opacity-70 p-4 sm:p-6 flex flex-col justify-center lg:max-h-[600px]">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 sm:p-6">
            <h3 className="text-white text-lg sm:text-xl font-bold mb-4 text-center lg:text-left">QUICK ENQUIRY!</h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-white bg-opacity-20 text-white placeholder-gray-300 rounded-lg border ${
                    formErrors.name ? 'border-red-500' : 'border-white border-opacity-30'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base`}
                  required
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your Email"
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-white bg-opacity-20 text-white placeholder-gray-300 rounded-lg border ${
                    formErrors.email ? 'border-red-500' : 'border-white border-opacity-30'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base`}
                  required
                />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </div>

              <div className="flex">
                <div className="flex items-center bg-white bg-opacity-20 rounded-l-lg px-2 sm:px-3 border border-white border-opacity-30 border-r-0">
                  <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-4 sm:w-5 h-2 sm:h-3 mr-1 sm:mr-2" />
                  <span className="text-white text-sm sm:text-base">+91</span>
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Your Phone"
                  className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-white bg-opacity-20 text-white placeholder-gray-300 rounded-r-lg border ${
                    formErrors.phone ? 'border-red-500' : 'border-white border-opacity-30'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base`}
                  required
                />
                {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
              </div>

              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your Message"
                  rows="2"
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-white bg-opacity-20 text-white placeholder-gray-300 rounded-lg border ${
                    formErrors.message ? 'border-red-500' : 'border-white border-opacity-30'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm sm:text-base`}
                ></textarea>
                {formErrors.message && <p className="text-red-500 text-xs mt-1">{formErrors.message}</p>}
              </div>

              {submitMessage && (
                <div
                  className={`text-center py-2 px-4 rounded-lg ${
                    submitMessage.includes('Thank you') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {submitMessage}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'SUBMIT NOW'}
              </button>
            </form>

            <div className="mt-3 text-xs text-gray-300">
              <label className="flex items-start">
                <input type="checkbox" className="mt-1 mr-2 flex-shrink-0" required />
                <span className="text-xs leading-tight">
                  I authorize company representatives to Call, SMS, Email or WhatsApp me about its products and offers. This consent overrides any registration for DNC/NDNC.
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Contact Icons */}
      <div className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 z-20">
        <button
          onClick={handleWhatsApp}
          className="bg-green-500 hover:bg-green-600 text-white p-3 sm:p-4 rounded-full shadow-lg transition-colors"
        >
          <MessageCircle size={20} className="sm:size-[24px]" />
        </button>
      </div>

      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-20">
        <button
          onClick={handleCall}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 sm:p-4 rounded-full shadow-lg transition-colors"
        >
          <Phone size={20} className="sm:size-[24px]" />
        </button>
      </div>

      {/* Popup Form */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 sm:p-8 max-w-md w-full mx-4 relative">
            <button
              onClick={closePopup}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} className="sm:size-[24px]" />
            </button>

            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Get Best Deals!</h3>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base`}
                  required
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your Email"
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base`}
                  required
                />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Your Phone"
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border ${
                    formErrors.phone ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base`}
                  required
                />
                {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
              </div>

              {submitMessage && (
                <div
                  className={`text-center py-2 px-4 rounded-lg ${
                    submitMessage.includes('Thank you') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {submitMessage}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Get Best Deals'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Brochure Download Popup */}
      {showBrochurePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl p-6 sm:p-8 max-w-md w-full mx-4 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-blue-700"></div>
            <div className="absolute top-4 right-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 opacity-20"></div>
            </div>

            <button
              onClick={closeBrochurePopup}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={20} className="sm:size-[24px]" />
            </button>

            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Download size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Download Brochure</h3>
              <p className="text-gray-600 text-sm sm:text-base">Please provide your details to download our exclusive brochure</p>
            </div>

            <form onSubmit={handleBrochureSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={brochureFormData.name}
                  onChange={handleBrochureInputChange}
                  placeholder="Enter your name"
                  className={`w-full px-4 py-3 border ${
                    brochureFormErrors.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  required
                />
                {brochureFormErrors.name && <p className="text-red-500 text-xs mt-1">{brochureFormErrors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={brochureFormData.email}
                  onChange={handleBrochureInputChange}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3 border ${
                    brochureFormErrors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  required
                />
                {brochureFormErrors.email && <p className="text-red-500 text-xs mt-1">{brochureFormErrors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={brochureFormData.phone}
                  onChange={handleBrochureInputChange}
                  placeholder="Enter your phone number"
                  className={`w-full px-4 py-3 border ${
                    brochureFormErrors.phone ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  required
                />
                {brochureFormErrors.phone && <p className="text-red-500 text-xs mt-1">{brochureFormErrors.phone}</p>}
              </div>

              {submitMessage && (
                <div
                  className={`text-center py-2 px-4 rounded-lg ${
                    submitMessage.includes('Thank you') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {submitMessage}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-semibold shadow-md transition-all transform hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span>Download Now</span>
                  )}
                </button>
              </div>

              <div className="text-center text-xs text-gray-500 mt-4">
                <p>We respect your privacy. Your information is secure with us.</p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerSection;