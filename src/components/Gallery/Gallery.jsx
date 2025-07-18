import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import gallery1 from '../../assets/gallery_img1.png'
import gallery2 from '../../assets/gallery_img2.png'
import gallery3 from '../../assets/gallery_img3.png'
import gallery4 from '../../assets/gallery_img4.png'
import gallery5 from '../../assets/gallery_img5.png'


const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Sample gallery images - replace with your actual images
  const galleryImages = [
    {
      id: 1,
      src: gallery1,
      alt: "Modern Dining Room",
      category: "Dining"
    },
    {
      id: 2,
      src: gallery2,
      alt: "Living Room with TV",
      category: "Living Room"
    },
    {
      id: 3,
      src: gallery3,
      alt: "Modern Living Space",
      category: "Living Room"
    },
    {
      id: 4,
      src: gallery4,
      alt: "Kitchen Interior",
      category: "Kitchen"
    },
    {
      id: 5,
      src: gallery5,
      alt: "Luxury Living Room",
      category: "Living Room"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      alt: "Modern Bedroom",
      category: "Bedroom"
    }
  ];

  const openModal = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setCurrentIndex(0);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : galleryImages.length - 1;
    setCurrentIndex(newIndex);
    setSelectedImage(galleryImages[newIndex]);
  };

  const goToNext = () => {
    const newIndex = currentIndex < galleryImages.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setSelectedImage(galleryImages[newIndex]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  const openFormModal = () => {
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setSubmitMessage('');
    setFormData({ name: '', email: '', mobile: '' });
  };

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.mobile) {
      setSubmitMessage('Please fill in all required fields.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitMessage('Please enter a valid email address.');
      return;
    }

    // Mobile validation (basic)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobile.replace(/\D/g, '').slice(-10))) {
      setSubmitMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // EmailJS configuration - Replace with your actual credentials
      const emailJSConfig = {
        serviceID: 'your_service_id',
        templateID: 'your_template_id',
        userID: 'your_user_id'
      };

      // Template parameters for EmailJS
      const templateParams = {
        to_name: 'Gallery Team',
        from_name: formData.name,
        from_email: formData.email,
        mobile: formData.mobile,
        message: `Gallery inquiry from ${formData.name}. Contact details: Email - ${formData.email}, Mobile - ${formData.mobile}`,
        reply_to: formData.email
      };

      // Simulate EmailJS send - Replace with actual EmailJS call
      // await emailjs.send(emailJSConfig.serviceID, emailJSConfig.templateID, templateParams, emailJSConfig.userID);
      
      // For demo purposes, we'll simulate the email sending
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitMessage('Thank you! Your request has been submitted successfully. We will contact you soon.');
      setFormData({ name: '', email: '', mobile: '' });
      
      // Close modal after 3 seconds
      setTimeout(() => {
        closeFormModal();
      }, 3000);
      
    } catch (error) {
      console.error('EmailJS Error:', error);
      setSubmitMessage('Sorry, there was an error sending your request. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-gray-100 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-5xl font-bold text-center text-blue-600 mb-16">
          Gallery
        </h1>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* First Row - 3 equal columns */}
          <div 
            className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => openModal(galleryImages[0], 0)}
          >
            <img 
              src={galleryImages[0].src} 
              alt={galleryImages[0].alt}
              className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {galleryImages[0].category}
              </div>
            </div>
          </div>

          <div 
            className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => openModal(galleryImages[1], 1)}
          >
            <img 
              src={galleryImages[1].src} 
              alt={galleryImages[1].alt}
              className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {galleryImages[1].category}
              </div>
            </div>
          </div>

          <div 
            className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => openModal(galleryImages[2], 2)}
          >
            <img 
              src={galleryImages[2].src} 
              alt={galleryImages[2].alt}
              className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {galleryImages[2].category}
              </div>
            </div>
          </div>

          {/* Second Row - 2 columns, wider layout */}
          <div 
            className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 md:col-span-2"
            onClick={() => openModal(galleryImages[3], 3)}
          >
            <img 
              src={galleryImages[3].src} 
              alt={galleryImages[3].alt}
              className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {galleryImages[3].category}
              </div>
            </div>
          </div>

          <div 
            className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 md:col-span-1"
            onClick={() => openModal(galleryImages[4], 4)}
          >
            <img 
              src={galleryImages[4].src} 
              alt={galleryImages[4].alt}
              className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {galleryImages[4].category}
              </div>
            </div>
          </div>
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button 
            onClick={openFormModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
          >
            <Mail className="w-5 h-5" />
            View More
          </button>
        </div>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
            >
              <ChevronRight className="w-10 h-10" />
            </button>

            {/* Image */}
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Image Info */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-white">
              <h3 className="text-xl font-semibold">{selectedImage.alt}</h3>
              <p className="text-gray-300">{selectedImage.category}</p>
              <p className="text-sm text-gray-400 mt-1">
                {currentIndex + 1} of {galleryImages.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* View More Form Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Mail className="w-6 h-6 text-blue-600" />
                Request Gallery Access
              </h2>
              <button
                onClick={closeFormModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Please provide your details to access our complete gallery collection.
              </p>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleFormInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your mobile number"
                    maxLength="15"
                    required
                  />
                </div>

                {/* Submit Message */}
                {submitMessage && (
                  <div className={`p-3 rounded-md ${
                    submitMessage.includes('successfully') || submitMessage.includes('Thank you')
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    <p className="text-sm">{submitMessage}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-md font-semibold transition-colors flex items-center justify-center gap-2 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Send Request
                    </>
                  )}
                </button>
              </form>

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Why do we need your details?</strong><br />
                  We'll send you exclusive access to our complete gallery collection and keep you updated with our latest projects.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;