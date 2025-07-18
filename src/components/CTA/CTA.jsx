import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import emailjs from '@emailjs/browser';
import ctaImg from '../../assets/decision.png';

const CTA = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formType, setFormType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // EmailJS Configuration
  const EMAIL_SERVICE_ID = 'service_91dd84g';
  const EMAIL_TEMPLATE_ID = 'template_ncabbum';
  const EMAIL_PUBLIC_KEY = 'FPyANi4X-1gUfsMCI'; // Replace with your EmailJS Public Key

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(EMAIL_PUBLIC_KEY);
  }, []);

  const handleButtonClick = (type) => {
    setFormType(type);
    setIsPopupOpen(true);
    setFormErrors({});
    setSubmitMessage('');
  };

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
      message: formData.message || `User requested to ${
        formType === 'brochure' ? 'download the investment brochure' : 'schedule a meeting for investment consultation'
      }.`,
      time: currentTime,
      request_type: formType === 'brochure' ? 'Brochure Download' : 'Schedule Meeting',
      to_name: 'Investment Team'
    };

    try {
      await emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, templateParams);
      console.log('Email sent successfully:', templateParams);
      setSubmitMessage('Thank you! We will contact you soon.');
      setFormData({ name: '', email: '', mobile: '', message: '' });
      setFormErrors({});
      setTimeout(() => {
        setIsPopupOpen(false);
        setSubmitMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error sending email:', error.text || error);
      setSubmitMessage(`Failed to send: ${error.text || 'Unknown error'}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setFormData({ name: '', email: '', mobile: '', message: '' });
    setFormErrors({});
    setSubmitMessage('');
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side - Image */}
          <div className="lg:w-1/2">
            <div className="relative">
              <img
                src={ctaImg}
                alt="Investment consultation and business meeting"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Decision Corner
            </h2>

            <p className="text-xl text-gray-600 mb-8">
              Do You Want A Deal Of Investment? Just Let Us Know!
            </p>

            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row items-center gap-4">
                <span className="text-lg text-gray-700">Let Us Serve You Beyond</span>
                <button
                  onClick={() => handleButtonClick('brochure')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300 shadow-lg hover:shadow-xl"
                >
                  Download Brochure
                </button>
              </div>

              <div className="flex flex-col lg:flex-row items-center gap-4">
                <span className="text-lg text-gray-700">Talk For Right Investment</span>
                <button
                  onClick={() => handleButtonClick('schedule')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300 shadow-lg hover:shadow-xl"
                >
                  Schedule Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {formType === 'brochure' ? 'Download Brochure' : 'Schedule Meeting'}
            </h3>

            <p className="text-gray-600 mb-6">
              {formType === 'brochure'
                ? 'Fill out the form below to receive our investment brochure.'
                : "Let us know your details and we'll schedule a meeting with you."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="Enter your full name"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="Enter your email address"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border ${
                    formErrors.mobile ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="Enter your mobile number"
                />
                {formErrors.mobile && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.mobile}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Any additional information..."
                />
              </div>

              {submitMessage && (
                <div
                  className={`text-center py-2 px-4 rounded-lg ${
                    submitMessage.includes('Thank you')
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {submitMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CTA;