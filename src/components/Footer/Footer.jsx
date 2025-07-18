import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import emailjs from '@emailjs/browser';

const Footer = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");

  // EmailJS Configuration
  const EMAIL_SERVICE_ID = 'service_91dd84g';
  const EMAIL_TEMPLATE_ID = 'template_ncabbum';
  const EMAIL_PUBLIC_KEY = 'FPyANi4X-1gUfsMCI'; 

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(EMAIL_PUBLIC_KEY);
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
    if (!formData.fullName) errors.fullName = 'Name is required';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      errors.email = 'Valid email is required';
    if (!formData.phone || !/^\d{10}$/.test(formData.phone))
      errors.phone = 'Valid 10-digit phone number is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("");

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
      from_name: formData.fullName,
      from_email: formData.email,
      phone: formData.phone,
      message: `Site visit request from ${formData.fullName}. Contact: ${formData.email}, Phone: ${formData.phone}`,
      time: currentTime
    };

    try {
      await emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, templateParams);
      console.log('Email sent successfully:', templateParams);
      setSubmitStatus("success");
      setFormData({ fullName: "", email: "", phone: "" });
      setFormErrors({});
    } catch (error) {
      console.error("Error sending email:", error.text || error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-gray-300 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* About Developer Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-light text-blue-600 mb-6">
              About Developer
            </h2>
            <p className="text-gray-700 text-base leading-relaxed">
              Godrej Properties brings the Godrej Group philosophy of
              innovation, sustainability and excellence to the real estate
              industry. Each Godrej Properties development combines a 120-year
              legacy of excellence and trust with a commitment to cutting-edge
              design and technology.
            </p>

            <div className="space-y-2 text-sm text-gray-600">
              <p>Agent Rera : UPRERAAGT25838 </p>
            </div>

            <div className="flex items-center space-x-4 mt-8">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-blue-600 font-medium">Call Us Anytime</p>
                <p className="text-gray-700 font-semibold">+91-9818094754</p>
              </div>
            </div>
          </div>

          {/* Schedule Site Visit Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-light text-blue-600 mb-6">
              Schedule A Site Visit
            </h2>
            <p className="text-gray-600 mb-8 text-center">
              Please fill out the form below, our expert will get back to you
              soon.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Your Full Name"
                  required
                  className={`w-full pl-10 pr-4 py-3 border ${
                    formErrors.fullName ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all duration-200`}
                />
                {formErrors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  required
                  className={`w-full pl-10 pr-4 py-3 border ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all duration-200`}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone/Mobile"
                  required
                  className={`w-full pl-10 pr-4 py-3 border ${
                    formErrors.phone ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all duration-200`}
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-700'
                } transition-colors duration-200`}
              >
                {isSubmitting ? "SUBMITTING..." : "GET CALL BACK"}
              </button>

              {submitStatus === "success" && (
                <div className="text-green-600 text-center">
                  Thank you! We'll get back to you soon.
                </div>
              )}
              {submitStatus === "error" && (
                <div className="text-red-600 text-center">
                  Sorry, something went wrong. Please try again.
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-16 pt-8 border-t border-gray-300">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-4 max-w-3xl mx-auto">
              <strong>Disclaimer:</strong> This is not the official website of
              Godrej Properties. It is owned and managed by RKRM Real Estate
              LLP, a RERA-registered channel partner (RERA No: UPRERAAGT25838)
              for informational and marketing purposes only.| *T&C Apply
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-300">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 text-sm text-gray-600">
            <Link to="/privacy">
              <button className="hover:text-blue-600 transition-colors duration-200 bg-transparent border-none text-current cursor-pointer">
                Privacy Policy
              </button>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;