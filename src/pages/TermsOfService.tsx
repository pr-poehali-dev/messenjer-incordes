import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
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
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-[#B5BAC1] mb-8">Last updated: November 2, 2025</p>

          <div className="space-y-6 text-[#DBDEE1]">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing or using Incordes, you agree to be bound by these Terms of Service and
                all applicable laws and regulations. If you do not agree with any of these terms,
                you are prohibited from using or accessing this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">2. Description of Service</h2>
              <p>
                Incordes is a communication platform that allows users to create servers, channels,
                and exchange messages. The service is provided "as is" and "as available" without
                warranties of any kind.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">3. User Accounts</h2>
              <p className="mb-2">When creating an account, you agree to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your password</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>Be at least 13 years of age</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">4. User Conduct</h2>
              <p className="mb-2">You agree NOT to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Use the service for any illegal purpose</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Share inappropriate, offensive, or harmful content</li>
                <li>Impersonate any person or entity</li>
                <li>Spam, phish, or distribute malware</li>
                <li>Attempt to gain unauthorized access to the service</li>
                <li>Interfere with or disrupt the service</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">5. Content</h2>
              <p>
                You retain ownership of content you post on Incordes. By posting content, you grant
                us a license to use, store, and display that content as necessary to provide the
                service. You are responsible for the content you post and must have the necessary
                rights to post it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">6. Content Moderation</h2>
              <p>
                We reserve the right, but not the obligation, to monitor, review, and remove content
                that violates these terms or is otherwise objectionable. We may also suspend or
                terminate accounts that violate these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">7. Intellectual Property</h2>
              <p>
                The service, including its original content, features, and functionality, is owned
                by Incordes and is protected by international copyright, trademark, and other
                intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">8. Third-Party Links</h2>
              <p>
                Our service may contain links to third-party websites. We are not responsible for
                the content, privacy policies, or practices of third-party websites.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">9. Disclaimers</h2>
              <p className="mb-2">The service is provided "as is" without warranties of any kind, including but not limited to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Warranties of merchantability or fitness for a particular purpose</li>
                <li>Warranties that the service will be uninterrupted or error-free</li>
                <li>Warranties regarding the accuracy or reliability of content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">10. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Incordes shall not be liable for any
                indirect, incidental, special, consequential, or punitive damages, or any loss of
                profits or revenues, whether incurred directly or indirectly, or any loss of data,
                use, goodwill, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">11. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless Incordes from any claims, damages,
                liabilities, and expenses arising from your use of the service or violation of these
                terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">12. Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without prior notice, for any
                reason, including breach of these terms. Upon termination, your right to use the
                service will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">13. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify users of any
                material changes. Your continued use of the service after changes constitutes
                acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">14. Governing Law</h2>
              <p>
                These terms shall be governed by and construed in accordance with applicable laws,
                without regard to conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">15. Dispute Resolution</h2>
              <p>
                Any disputes arising from these terms or your use of the service shall be resolved
                through good faith negotiations. If negotiations fail, disputes may be resolved
                through binding arbitration.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">16. Severability</h2>
              <p>
                If any provision of these terms is found to be unenforceable or invalid, that
                provision shall be limited or eliminated to the minimum extent necessary, and the
                remaining provisions shall remain in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">17. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="mt-2 font-semibold text-[#5865F2]">
                connection.support@gmail.com
              </p>
            </section>

            <section className="border-t border-[#1E1F22] pt-6 mt-8">
              <h2 className="text-2xl font-semibold text-white mb-3">Acknowledgment</h2>
              <p>
                By using Incordes, you acknowledge that you have read these Terms of Service,
                understand them, and agree to be bound by them. If you do not agree to these terms,
                you must not use the service.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
