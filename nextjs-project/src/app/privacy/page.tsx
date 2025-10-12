import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how we collect, use, and protect your information on MomAI Agent.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
          {/* Header */}
          <div className="mb-8 pb-6 border-b border-slate-200">
            <h1 className="text-4xl md:text-5xl font-light text-slate-700 mb-4">
              Privacy Policy
            </h1>
            <p className="text-slate-500 text-sm">Last Updated: January 2025</p>
          </div>

          {/* Introduction */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-3">Our Commitment to Your Privacy</h2>
            <p className="text-blue-800 leading-relaxed">
              At MomAI Agent, we take your privacy seriously. This policy explains what information we collect,
              how we use it, and your rights regarding your data. We are committed to transparency and protecting
              your personal information.
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-slate max-w-none">
            {/* Section 1 */}
            <section className="mb-8">
              <h2 className="text-2xl font-light text-slate-700 mb-4 flex items-center">
                <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3 text-slate-600">1</span>
                Information We Collect
              </h2>

              <h3 className="text-xl font-medium text-slate-600 mb-3">1.1 Information You Provide</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                When you use our AI assistant, we collect:
              </p>
              <ul className="list-disc pl-6 mb-6 text-slate-600 space-y-2">
                <li><strong>Questions and queries</strong> you submit to our AI assistant</li>
                <li><strong>Email addresses</strong> if you subscribe to our newsletter (optional)</li>
                <li><strong>Feedback</strong> you provide about our content or services</li>
              </ul>

              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg mb-6">
                <p className="text-green-800">
                  <strong>✓ We DO NOT collect:</strong> Personal health information, names, birthdates,
                  medical records, or any personally identifiable health data.
                </p>
              </div>

              <h3 className="text-xl font-medium text-slate-600 mb-3">1.2 Automatically Collected Information</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                When you visit our website, we automatically collect:
              </p>
              <ul className="list-disc pl-6 mb-6 text-slate-600 space-y-2">
                <li><strong>Usage data:</strong> Pages viewed, time spent, click patterns</li>
                <li><strong>Device information:</strong> Browser type, operating system, device type</li>
                <li><strong>IP address:</strong> For analytics and security purposes (anonymized)</li>
                <li><strong>Cookies:</strong> Small files stored on your device (see Section 5)</li>
              </ul>

              <h3 className="text-xl font-medium text-slate-600 mb-3">1.3 Third-Party Services</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                We use the following third-party services that may collect data:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h4 className="font-semibold text-slate-700 mb-2">OpenAI</h4>
                  <p className="text-sm text-slate-600">Powers our AI assistant. Queries are processed to generate responses.</p>
                  <a href="https://openai.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                    OpenAI Privacy Policy →
                  </a>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h4 className="font-semibold text-slate-700 mb-2">Vercel</h4>
                  <p className="text-sm text-slate-600">Hosts our website. Collects basic usage and performance data.</p>
                  <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                    Vercel Privacy Policy →
                  </a>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h4 className="font-semibold text-slate-700 mb-2">Supabase</h4>
                  <p className="text-sm text-slate-600">Stores our knowledge base and articles. No personal user data.</p>
                  <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                    Supabase Privacy Policy →
                  </a>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h4 className="font-semibold text-slate-700 mb-2">Analytics (if enabled)</h4>
                  <p className="text-sm text-slate-600">Tracks anonymous usage patterns to improve our service.</p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="mb-8">
              <h2 className="text-2xl font-light text-slate-700 mb-4 flex items-center">
                <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3 text-slate-600">2</span>
                How We Use Your Information
              </h2>

              <p className="text-slate-600 leading-relaxed mb-4">
                We use the collected information for the following purposes:
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-700 mb-1">Provide AI Responses</h3>
                    <p className="text-slate-600 text-sm">Process your queries through OpenAI to generate helpful, evidence-based responses.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-700 mb-1">Improve Our Service</h3>
                    <p className="text-slate-600 text-sm">Analyze usage patterns to understand what topics are most helpful and improve our content.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-700 mb-1">Send Updates (Optional)</h3>
                    <p className="text-slate-600 text-sm">If you subscribe, send newsletters with parenting tips and new content (you can unsubscribe anytime).</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-700 mb-1">Security & Fraud Prevention</h3>
                    <p className="text-slate-600 text-sm">Protect our website from abuse, spam, and malicious activities.</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                <p className="text-yellow-800">
                  <strong>We NEVER:</strong> Sell your data, share it with advertisers, or use it for purposes other than improving our service.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="mb-8">
              <h2 className="text-2xl font-light text-slate-700 mb-4 flex items-center">
                <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3 text-slate-600">3</span>
                Data Storage & Security
              </h2>

              <h3 className="text-xl font-medium text-slate-600 mb-3">How We Protect Your Data</h3>
              <ul className="list-disc pl-6 mb-6 text-slate-600 space-y-2">
                <li><strong>Encryption:</strong> All data transmitted between your browser and our servers uses HTTPS encryption</li>
                <li><strong>Secure hosting:</strong> Our website is hosted on Vercel with enterprise-grade security</li>
                <li><strong>Limited access:</strong> Only authorized personnel have access to backend systems</li>
                <li><strong>Regular updates:</strong> We keep our systems and dependencies up to date with security patches</li>
                <li><strong>No unnecessary storage:</strong> We don't store more data than necessary for our service</li>
              </ul>

              <h3 className="text-xl font-medium text-slate-600 mb-3">Data Retention</h3>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
                <ul className="space-y-2 text-slate-600">
                  <li>• <strong>AI queries:</strong> Processed by OpenAI and may be retained per their policy (typically 30 days for API calls)</li>
                  <li>• <strong>Analytics data:</strong> Anonymized usage data retained for 26 months</li>
                  <li>• <strong>Newsletter emails:</strong> Retained until you unsubscribe</li>
                  <li>• <strong>Cookies:</strong> Expire after the session or as specified in cookie settings</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section className="mb-8">
              <h2 className="text-2xl font-light text-slate-700 mb-4 flex items-center">
                <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3 text-slate-600">4</span>
                Your Rights & Choices
              </h2>

              <p className="text-slate-600 leading-relaxed mb-4">
                You have the following rights regarding your data:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Access</h4>
                  <p className="text-blue-800 text-sm">Request a copy of the data we have about you</p>
                </div>
                <div className="bg-violet-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-violet-900 mb-2">Correction</h4>
                  <p className="text-violet-800 text-sm">Ask us to correct inaccurate information</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Deletion</h4>
                  <p className="text-green-800 text-sm">Request deletion of your personal data</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-2">Opt-Out</h4>
                  <p className="text-red-800 text-sm">Unsubscribe from emails or disable cookies</p>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed mb-4">
                To exercise these rights, please contact us through our website contact form or email.
              </p>
            </section>

            {/* Section 5 */}
            <section className="mb-8">
              <h2 className="text-2xl font-light text-slate-700 mb-4 flex items-center">
                <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3 text-slate-600">5</span>
                Cookies & Tracking Technologies
              </h2>

              <h3 className="text-xl font-medium text-slate-600 mb-3">What Are Cookies?</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Cookies are small text files stored on your device that help us provide a better experience.
              </p>

              <h3 className="text-xl font-medium text-slate-600 mb-3">Types of Cookies We Use</h3>
              <div className="space-y-3 mb-6">
                <div className="border-l-4 border-blue-400 bg-blue-50 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-blue-900 mb-1">Essential Cookies (Required)</h4>
                  <p className="text-blue-800 text-sm">Necessary for the website to function properly (security, session management)</p>
                </div>
                <div className="border-l-4 border-violet-400 bg-violet-50 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-violet-900 mb-1">Analytics Cookies (Optional)</h4>
                  <p className="text-violet-800 text-sm">Help us understand how visitors use our site (Google Analytics, if enabled)</p>
                </div>
              </div>

              <h3 className="text-xl font-medium text-slate-600 mb-3">Managing Cookies</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                You can control cookies through your browser settings. Note that disabling cookies may affect website functionality.
              </p>
            </section>

            {/* Section 6 */}
            <section className="mb-8">
              <h2 className="text-2xl font-light text-slate-700 mb-4 flex items-center">
                <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3 text-slate-600">6</span>
                Children's Privacy
              </h2>

              <p className="text-slate-600 leading-relaxed mb-4">
                Our website is intended for use by adults (18+) who are parents or caregivers. We do not knowingly collect
                personal information from children under 13. If you believe we have inadvertently collected such information,
                please contact us immediately.
              </p>
            </section>

            {/* Section 7 */}
            <section className="mb-8">
              <h2 className="text-2xl font-light text-slate-700 mb-4 flex items-center">
                <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3 text-slate-600">7</span>
                International Users
              </h2>

              <p className="text-slate-600 leading-relaxed mb-4">
                Our website is hosted in the United States. If you access our site from outside the US, your information
                may be transferred to, stored, and processed in the US. By using our website, you consent to this transfer.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                <p className="text-blue-800">
                  <strong>GDPR Compliance:</strong> If you are in the European Union, you have additional rights under GDPR,
                  including data portability and the right to lodge a complaint with your supervisory authority.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section className="mb-8">
              <h2 className="text-2xl font-light text-slate-700 mb-4 flex items-center">
                <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3 text-slate-600">8</span>
                Changes to This Policy
              </h2>

              <p className="text-slate-600 leading-relaxed mb-4">
                We may update this privacy policy from time to time. When we make significant changes, we will:
              </p>
              <ul className="list-disc pl-6 mb-4 text-slate-600 space-y-2">
                <li>Update the "Last Updated" date at the top of this page</li>
                <li>Notify users via email (if subscribed)</li>
                <li>Display a notice on our website</li>
              </ul>
              <p className="text-slate-600 leading-relaxed">
                Your continued use of our website after changes indicates acceptance of the updated policy.
              </p>
            </section>

            {/* Section 9 */}
            <section className="mb-8">
              <h2 className="text-2xl font-light text-slate-700 mb-4 flex items-center">
                <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3 text-slate-600">9</span>
                Contact Us
              </h2>

              <p className="text-slate-600 leading-relaxed mb-4">
                If you have questions or concerns about this privacy policy or our data practices, please contact us:
              </p>

              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                <p className="text-slate-700 mb-3"><strong>MomAI Agent</strong></p>
                <p className="text-slate-600 text-sm mb-1">
                  <strong>Email:</strong> <a href="mailto:support@momaiagent.com" className="text-blue-600 hover:underline">support@momaiagent.com</a>
                </p>
                <p className="text-slate-600 text-sm mb-1">
                  <strong>Location:</strong> Edmonton, AB, Canada
                </p>
                <p className="text-slate-600 text-sm mb-1">
                  <strong>Website:</strong> <a href="https://www.momaiagent.com" className="text-blue-600 hover:underline">www.momaiagent.com</a>
                </p>
                <p className="text-slate-600 text-sm mt-3 pt-3 border-t border-slate-200">
                  <strong>Response time:</strong> Within 48 hours
                </p>
              </div>
            </section>

            {/* Summary */}
            <section className="mt-12 bg-gradient-to-r from-violet-50 to-blue-50 rounded-2xl p-8">
              <h2 className="text-2xl font-light text-slate-700 mb-4">Quick Summary</h2>
              <div className="space-y-3 text-slate-600">
                <p className="flex items-start">
                  <span className="text-violet-500 mr-3 text-xl">✓</span>
                  <span>We collect minimal data needed to provide our AI service</span>
                </p>
                <p className="flex items-start">
                  <span className="text-violet-500 mr-3 text-xl">✓</span>
                  <span>We never sell your data or share it with advertisers</span>
                </p>
                <p className="flex items-start">
                  <span className="text-violet-500 mr-3 text-xl">✓</span>
                  <span>AI queries are processed by OpenAI with their privacy protections</span>
                </p>
                <p className="flex items-start">
                  <span className="text-violet-500 mr-3 text-xl">✓</span>
                  <span>You can request access, correction, or deletion of your data anytime</span>
                </p>
                <p className="flex items-start">
                  <span className="text-violet-500 mr-3 text-xl">✓</span>
                  <span>We use industry-standard security measures to protect your information</span>
                </p>
              </div>
            </section>

            {/* Related Links */}
            <div className="mt-8 pt-8 border-t border-slate-200">
              <h3 className="text-lg font-medium text-slate-700 mb-4">Related Policies</h3>
              <div className="flex flex-wrap gap-4">
                <Link href="/disclaimer" className="inline-flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors">
                  Medical Disclaimer
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link href="/trust" className="inline-flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors">
                  Trust & Methods
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
