import React, { useState, useEffect } from 'react';
import { X, TrendingUp } from 'lucide-react';
import emailjs from '@emailjs/browser';
import floorplan from '../../assets/floorplan.png';

const FloorPlan = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Sample floor plan data with placeholder images
  const floorPlans = [
    {
      id: 1,
      title: '3 BHK',
      image: floorplan
    },
    {
      id: 2,
      title: 'Master Plan',
      image: floorplan
    },
    {
      id: 3,
      title: '4 BHK',
      image: floorplan
    }
  ];

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
    if (!formData.mobile || !/^\d{10}$/.test(formData.mobile))
      errors.mobile = 'Valid 10-digit mobile number is required';
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
      phone: formData.mobile,
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
      setSubmitMessage('Thank you! Your inquiry has been submitted successfully.');
      setFormData({ name: '', email: '', mobile: '', message: '' });
      setFormErrors({});
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error sending email:', error.text || error);
      setSubmitMessage(`Failed to send: ${error.text || 'Unknown error'}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSubmitMessage('');
    setFormErrors({});
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-12">
          Floor Plan
        </h1>

        {/* Floor Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {floorPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image Container */}
              <div
                className="relative h-80 bg-gray-200 cursor-pointer group"
                onClick={openModal}
              >
                {/* Floor plan image */}
                <img
                  src={plan.image}
                  alt={plan.title}
                  className="w-full h-full object-cover"
                />

                {/* View Plan Button Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300 flex items-center gap-2 shadow-lg"
                    onClick={openModal}
                  >
                    View Plan
                    <TrendingUp className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title Bar */}
              <div className="bg-blue-600 text-white text-center py-4">
                <h3 className="text-xl font-semibold">{plan.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center zrewritten z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">Request Floor Plan</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Please provide your details to receive the floor plan information.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Enter your full name"
                    required
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Enter your email address"
                    required
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="principle"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.mobile ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Enter your mobile number"
                    required />
                  {formErrors.mobile && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.mobile}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any additional information..."
                  />
                </div>

                {/* Submit Message */}
                {submitMessage && (
                  <div
                    className={`p-3 rounded-md ${
                      submitMessage.includes('successfully')
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {submitMessage}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-md font-semibold transition-colors ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloorPlan;