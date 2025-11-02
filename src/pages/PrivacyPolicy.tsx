import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#2B2D31] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6 text-[#B5BAC1] hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
        </Link>

        <div className="bg-[#313338] p-8 rounded-lg">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-[#B5BAC1] mb-8">Last updated: November 2, 2025</p>

          <div className="space-y-6 text-[#DBDEE1]">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">1. Introduction</h2>
              <p>
                Welcome to Incordes. We respect your privacy and are committed to protecting your
                personal data. This privacy policy will inform you about how we look after your
                personal data when you use our service and tell you about your privacy rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">2. Data We Collect</h2>
              <p className="mb-2">We collect and process the following data:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Account information: email address, username, password (encrypted)</li>
                <li>Profile information: avatar, banner, bio</li>
                <li>Server and channel data: servers you create or join, channels, messages</li>
                <li>Usage data: how you interact with our service</li>
                <li>Technical data: IP address, browser type, device information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">3. How We Use Your Data</h2>
              <p className="mb-2">We use your data to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Provide and maintain our service</li>
                <li>Authenticate and manage your account</li>
                <li>Enable communication between users</li>
                <li>Improve and optimize our service</li>
                <li>Prevent fraud and abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">4. Data Sharing</h2>
              <p>
                We do not sell your personal data. We only share your data with:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                <li>Other users as necessary for the service (e.g., messages in channels)</li>
                <li>Service providers who help us operate our service</li>
                <li>Law enforcement when required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your
                personal data. However, no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">6. Your Rights</h2>
              <p className="mb-2">You have the right to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Request data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">7. Data Retention</h2>
              <p>
                We retain your personal data only for as long as necessary to provide our service
                and comply with legal obligations. You can request deletion of your account at any
                time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">8. Cookies</h2>
              <p>
                We use local storage and session storage to maintain your login state and
                preferences. You can clear this data through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">9. Children's Privacy</h2>
              <p>
                Our service is not intended for users under 13 years of age. We do not knowingly
                collect data from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">10. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any
                changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">11. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our privacy practices,
                please contact us at:
              </p>
              <p className="mt-2 font-semibold text-[#5865F2]">
                connection.support@gmail.com
              </p>
            </section>

            <section className="border-t border-[#1E1F22] pt-6 mt-8">
              <h2 className="text-2xl font-semibold text-white mb-3">GDPR Compliance</h2>
              <p>
                For users in the European Economic Area (EEA), we comply with the General Data
                Protection Regulation (GDPR). You have additional rights under GDPR, including the
                right to lodge a complaint with a supervisory authority.
              </p>
            </section>

            <section className="border-t border-[#1E1F22] pt-6 mt-8">
              <h2 className="text-2xl font-semibold text-white mb-3">California Privacy Rights</h2>
              <p>
                For users in California, you have rights under the California Consumer Privacy Act
                (CCPA), including the right to know what personal information we collect and the
                right to request deletion of your data.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
