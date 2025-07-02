// pages/privacy-policy.tsx

import React from 'react';

/**
 * Renders the Privacy Policy page for Sharper Bets.
 * This policy outlines how personal information is collected, used, and protected
 * specifically for the sharper-bets.pro website.
 */
const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-xl border border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">Privacy Policy for Sharper-Bets.pro</h1>
        <p className="mb-6 text-center text-gray-600">Effective date: July 2, 2025</p>

        <p className="mb-6 text-gray-700">
          This Privacy Policy describes how Sharper-Bets.pro ("we," "us," or "our") collects, uses, and discloses your information
          when you visit and use our website, <a href="https://sharper-bets.pro" className="text-blue-600 hover:underline">https://sharper-bets.pro</a>.
          We are committed to protecting your privacy and ensuring you have a positive experience on our site.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3 text-gray-800 border-b pb-2">1. Information We Collect</h2>
        <p className="mb-4 text-gray-700">
          We collect various types of information to provide and improve our services to you.
        </p>
        <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700">
          <li>
            <strong>Information You Voluntarily Provide:</strong>
            <ul className="list-circle list-inside ml-5 mt-1 space-y-1">
              <li>
                <strong>Contact Form Submissions:</strong> When you use our "Contact Us" form, we collect your email address and the content of your message. This information is used solely to respond to your inquiries and provide support.
              </li>
            </ul>
          </li>
          <li>
            <strong>Information Collected Automatically (Usage Data):</strong>
            When you access and use Sharper-Bets.pro, we may automatically collect certain information about your device and browsing activity. This includes:
            <ul className="list-circle list-inside ml-5 mt-1 space-y-1">
              <li>Your Internet Protocol (IP) address.</li>
              <li>Browser type and version.</li>
              <li>Operating system.</li>
              <li>Referring/exit pages.</li>
              <li>Pages of our site that you visit, the time and date of your visit, the time spent on those pages, and other diagnostic data.</li>
            </ul>
          </li>
          <li>
            <strong>Cookies and Tracking Technologies:</strong>
            We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
            <ul className="list-circle list-inside ml-5 mt-1 space-y-1">
              <li>
                <strong>Google Analytics Cookies:</strong> We utilize Google Analytics to collect data about how users interact with our website. This helps us understand website traffic, user behavior, and improve our content and services. The information collected is aggregated and anonymous. You can learn more about Google Analytics' data practices and opt-out options by visiting Google's Privacy & Terms.
              </li>
              <li>
                <strong>Google AdSense Cookies:</strong> We use Google AdSense to display advertisements on our website. Google AdSense may use cookies to serve personalized ads based on your visits to this and other websites. These cookies help Google and its partners to serve ads based on your visit to Sharper-Bets.pro and/or other sites on the Internet.
              </li>
            </ul>
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-3 text-gray-800 border-b pb-2">2. How We Use Your Information</h2>
        <p className="mb-4 text-gray-700">
          Sharper-Bets.pro uses the collected data for various purposes:
        </p>
        <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700">
          <li>To provide and maintain our website and services.</li>
          <li>To respond to your inquiries, comments, or requests submitted via our Contact form.</li>
          <li>To analyze and monitor the usage of our website to improve its functionality, content, and user experience.</li>
          <li>To detect, prevent, and address technical issues.</li>
          <li>To serve relevant and personalized advertisements through Google AdSense.</li>
          <li>To gather analysis or valuable information so that we can improve our service.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-3 text-gray-800 border-b pb-2">3. Disclosure of Your Information (Third-Party Services)</h2>
        <p className="mb-4 text-gray-700">
          We may share your information with third-party service providers to facilitate our Service, provide the Service on our behalf,
          perform Service-related services, or assist us in analyzing how our Service is used.
        </p>
        <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700">
          <li>
            <strong>Google AdSense:</strong> Your data may be shared with Google AdSense for the purpose of ad delivery and personalization. You can control your ad settings and opt out of personalized advertising by visiting&nbsp;
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Ads Settings</a>.
          </li>
          <li>
            <strong>Google Analytics:</strong> Anonymous usage data is shared with Google Analytics for website analytics. You can prevent your data from being used by Google Analytics by installing the Google Analytics opt-out browser add-on, available at&nbsp;
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Analytics Opt-Out Browser Add-on</a>.
          </li>
          <li>
            <strong>Firestore (Google Cloud):</strong> Contact form submissions are stored securely in Firestore, a database service provided by Google. Access to this data is strictly limited to authorized Sharper-Bets.pro administrators for support purposes.
          </li>
        </ul>
        <p className="mb-4 text-gray-700">
          We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3 text-gray-800 border-b pb-2">4. Data Retention and Security</h2>
        <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700">
          <li>
            <strong>Data Retention:</strong> Contact form submissions are retained in Firestore indefinitely to allow us to refer back to past communications for support and record-keeping purposes. Usage data collected by Google Analytics is retained according to Google's data retention policies.
          </li>
          <li>
            <strong>Data Security:</strong> We are committed to ensuring the security of your information. We implement a variety of security measures to maintain the safety of your personal data. This includes using secure communication protocols (HTTPS) for data in transit and relying on Firebase's robust security features, including encryption at rest, for data stored in Firestore. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-3 text-gray-800 border-b pb-2">5. Children’s Privacy</h2>
        <p className="mb-6 text-gray-700">
          Our Service is not intended for individuals under the age of 18 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your Child has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3 text-gray-800 border-b pb-2">6. Your Choices and Rights</h2>
        <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700">
          <li>
            <strong>Opt-Out of Personalized Ads:</strong> You can opt out of personalized advertising by Google AdSense through your&nbsp;
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Ads Settings</a>.
          </li>
          <li>
            <strong>Opt-Out of Google Analytics:</strong> You can prevent your data from being used by Google Analytics by installing the Google Analytics opt-out browser add-on.
          </li>
          <li>
            <strong>Request Data Deletion:</strong> If you have submitted information via our contact form and wish to request its deletion, please email us directly at&nbsp;
            <a href="mailto:privacy@sharper-bets.pro" className="text-blue-600 hover:underline">privacy@sharper-bets.pro</a>. We will process your request in accordance with applicable laws.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-3 text-gray-800 border-b pb-2">7. Changes to This Privacy Policy</h2>
        <p className="mb-6 text-gray-700">
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "effective date" at the top of this Privacy Policy.
          You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3 text-gray-800 border-b pb-2">8. Contact Us</h2>
        <p className="mb-6 text-gray-700">
          If you have any questions about this Privacy Policy, please contact us:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700">
          <li>By email: <a href="mailto:privacy@sharper-bets.pro" className="text-blue-600 hover:underline">privacy@sharper-bets.pro</a></li>
          <li>By visiting this page on our website: <a href="https://sharper-bets.pro/contact" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://sharper-bets.pro/contact</a></li>
        </ul>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
