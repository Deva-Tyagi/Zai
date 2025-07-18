import React from 'react';

const Privacy = () => {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md">
        {/* Disclaimer Section */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Disclaimer</h2>
          
          <div className="prose prose-sm sm:prose max-w-none text-gray-600">
            <p className="mb-4">
              This website is only for the purpose of providing information regarding real estate projects in different regions. By accessing this website, the viewer confirms that the information including brochures and marketing collaterals on this website is solely for informational purposes.
            </p>
            
            <p className="mb-4">
              Nothing on this website constitutes advertising, marketing, booking, selling or an offer for sale, or invitation to purchase a unit in any project by the company. The company is not liable for any consequences of any action taken by the viewer relying on such material/information on this website.
            </p>
            
            <p className="mb-4">
              Please note that INSTADEAL has not verified the information and the compliances of the projects. Further, we have not checked the RERA (Real Estate Regulation Act 2016) registration status of the real estate projects listed herein. INSTADEAL does not make any representation in regards to the compliances done against these projects.
            </p>
            
            <p className="mb-4">
              You should make yourself aware about the RERA registration status of the listed real estate projects before purchasing property. This site is for information purpose only and should not be treated as the official website.
            </p>
          </div>
        </section>

        {/* Privacy Policy Section */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Privacy Policy</h2>
          
          <div className="prose prose-sm sm:prose max-w-none text-gray-600">
            <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Our Commitment</h3>
            <p className="mb-4">
              At INSTADEAL, we respect your privacy and the confidentiality of the information you submit on our portal. We are committed to protecting the privacy of users' personal information collected on our platform. We do not sell, trade, or rent your personal information to others. Information collected on our website is kept strictly confidential.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Information Collection</h3>
            <p className="mb-4">
              We collect information from you when you register on our site or fill out a form. You may be asked to enter your name, email, mailing address, or phone number. We may also collect your computer's IP address, IP address location, and browser/device information. However, you may visit our site anonymously.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Use of Information</h3>
            <p className="mb-4">
              We use the collected information to enhance your satisfaction by designing services tailored to your needs. Personal Information stored in a user's profile may be used, for example, to send invitation emails to people interested in joining the community.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Data Protection</h3>
            <p className="mb-4">
              INSTADEAL implements secure transmission protocols to protect sensitive information. All communication is encrypted using industry standards. Access to personal information is limited to employees or service providers who need it for delivering services and are bound by confidentiality agreements.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Cookies</h3>
            <p className="mb-4">
              a) Cookies are stored on your browser/device and may be used for session management, performance monitoring, and personalization. b) You can decline cookies, but this may limit site functionality. We use cookies for session continuity, analytics, and personalization.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Third Parties</h3>
            <p className="mb-4">
              Third-party links or ads may appear on our website. We are not responsible for their content or privacy practices. Trusted third-party tools (e.g., analytics or marketing) may assist us if they maintain strict confidentiality.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">User Consent</h3>
            <p className="mb-4">
              By using our website, you consent to the collection and use of this information. This policy applies solely to information collected by INSTADEAL and is part of our Terms and Conditions of Use. You can opt out of communication or request data deletion.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Legal Compliance</h3>
            <p className="mb-4">
              INSTADEAL only shares user information with others when we have the user's permission or as required by law or for legal proceedings, fraud prevention, or security concerns. In case of any legal requirements, fraud investigation, or safety enforcement, user data may be accessed or shared as needed with law enforcement.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Governing Law</h3>
            <p className="mb-4">
              These terms are governed by Indian law, and any disputes shall be subject to the jurisdiction of courts in Noida, Uttar Pradesh. For concerns, email us at <a href="mailto:legal@instadeal.in" className="text-blue-600 hover:underline">legal@instadeal.in</a>.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Policy Updates</h3>
            <p className="mb-4">
              This privacy policy is subject to undergo change and review without any prior notice or approval. To keep yourself updated on the changes introduced, please keep visiting and reviewing the terms and conditions of this privacy policy.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Privacy;