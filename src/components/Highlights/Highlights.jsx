import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import highlight from '../../assets/highlights-img.webp';

const Highlights = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init('FPyANi4X-1gUfsMCI'); // Replace with your EmailJS Public Key
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error for the field being edited
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      errors.email = 'Valid email is required';
    if (!formData.phone || !/^\d{10}$/.test(formData.phone))
      errors.phone = 'Valid 10-digit phone number is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // Validate form
    const errors = validateForm();
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
      message: formData.message || 'No message provided',
      time: currentTime
    };

    try {
      await emailjs.send(
        'service_91dd84g', // Your EmailJS Service ID
        'template_ncabbum', // Your EmailJS Template ID
        templateParams
      );
      console.log('Email sent successfully:', templateParams);
      setSubmitMessage('Thank you! The brochure has been sent to your email.');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setFormErrors({});
      setTimeout(() => {
        setIsPopupOpen(false);
        setSubmitMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error sending email:', error.text || error);
      setSubmitMessage(`Failed to send: ${error.text || 'Unknown error'}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-white p-4 md:p-8">
      {/* Image on the left */}
      <div className="hidden md:block md:w-1/2 h-full">
        <img
          src={highlight}
          alt="Godrej Property"
          className="w-full h-[500px] object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Content on the right */}
      <div className="w-full md:w-1/2 p-6 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-8">Highlights</h1>

       <ul className="space-y-4 mb-8">
  <li className="flex items-start">
    <span className="text-green-600 mr-2">•</span>
    <span className="text-gray-700 ">
127 Years Legacy of Quality & Trust</span>
  </li>
  <li className="flex items-start">
    <span className="text-green-600 mr-2">•</span>
    <span className="text-gray-700 ">
#1 Global Sustainable Developer by GRESB*</span>
  </li>
  <li className="flex items-start">
    <span className="text-green-600 mr-2">•</span>
    <span className="text-gray-700 ">65+ Live Projects Across India</span>
  </li>
  <li className="flex items-start">
    <span className="text-green-600 mr-2">•</span>
    <span className="text-gray-700 ">
60K Happy Families Stay in a Godrej Home</span>
  </li>
  <li className="flex items-start">
    <span className="text-green-600 mr-2">•</span>
    <span className="text-gray-700 ">High street amenities & plaza</span>
  </li>
  <li className="flex items-start">
    <span className="text-green-600 mr-2">•</span>
    <span className="text-gray-700 ">Multi-Level Car Parking</span>
  </li>
  <li className="flex items-start">
    <span className="text-green-600 mr-2">•</span>
    <span className="text-gray-700 ">Double Height Entrance Lobby</span>
  </li>
  <li className="flex items-start">
    <span className="text-green-600 mr-2">•</span>
    <span className="text-gray-700 ">Kitchen Platform in Granite</span>
  </li>
  <li className="flex items-start">
    <span className="text-green-600 mr-2">•</span>
    <span className="text-gray-700 ">Electrical Provision for Inverter</span>
  </li>
  <li className="flex items-start">
    <span className="text-green-600 mr-2">•</span>
    <span className="text-gray-700 ">Earthquake-resistant RCC Framed Structure</span>
  </li>
</ul>

        <div className="border-t border-gray-300 pt-6">
          <button
            onClick={() => setIsPopupOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-md transition duration-300"
          >
            Download Brochure
          </button>
        </div>
      </div>

      {/* Popup Form */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Download Brochure</h2>
            <p className="text-gray-600 mb-6">Please fill in your details to receive the brochure.</p>

            {submitMessage ? (
              <div className={`p-4 rounded-md ${submitMessage.includes('Thank you') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {submitMessage}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                    required
                  Stuart
                  />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                    required
                  />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>

                <div className="mb-6">
                  <label htmlFor="phone" className="block text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                    required
                  />
                  {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 mb-2">Message (Optional)</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Any additional information..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Submit'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Highlights;