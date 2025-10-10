import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Medical Disclaimer & Terms of Service',
  description: 'Important legal information about using MomAI Agent. This website provides educational information, not medical advice.',
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50/20 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
          {/* Header */}
          <div className="mb-8 pb-6 border-b border-slate-200">
            <h1 className="text-4xl md:text-5xl font-light text-slate-700 mb-4">
              Medical Disclaimer & Terms of Service
            </h1>
            <p className="text-slate-500 text-sm">Last Updated: January 2025</p>
          </div>

          {/* Important Notice Banner */}
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 p-6 rounded-lg mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Important Notice</h3>
                <p className="text-red-700 leading-relaxed">
                  This website provides general educational information only. It is NOT medical advice and should NOT replace consultation with qualified healthcare professionals. Always consult your doctor or pediatrician for personalized medical guidance.
                </p>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-light text-slate-700 mb-4 flex items-center">
                <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3 text-slate-600">1</span>
                Medical Disclaimer
              </h2>

              <h3 className="text-xl font-medium text-slate-600 mb-3">Not Medical Advice</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                The information provided on this website (momaiagent.com) is for <strong>general informational and educational purposes only</strong>. It is not intended to be, and should not be interpreted as, medical advice, diagnosis, or treatment.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                <strong className="text-slate-700">IMPORTANT:</strong> Always seek the advice of your physician, pediatrician, or other qualified healthcare provider with any questions you may have regarding a medical condition, your pregnancy, or your child's health. Never disregard professional medical advice or delay in seeking it because of something you have read on this website.
              </p>

              <h3 className="text-xl font-medium text-slate-600 mb-3 mt-6">No Doctor-Patient Relationship</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Use of this website and the information contained herein does not create a doctor-patient relationship between you and the website operators, contributors, or any healthcare professionals mentioned. The information provided is not a substitute for professional medical care.
              </p>

              <h3 className="text-xl font-medium text-slate-600 mb-3 mt-6">AI-Generated Content</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Some responses on this website are generated using <strong>artificial intelligence (AI) technology</strong>. While we strive to provide accurate and helpful information based on reputable sources (CDC, AAP, WHO, Health Canada, etc.), AI-generated content:
              </p>
              <ul className="list-disc pl-6 mb-4 text-slate-600 space-y-2">
                <li>May contain errors or inaccuracies</li>
                <li>Should not be relied upon as professional medical advice</li>
                <li>Must be verified with your healthcare provider before taking any action</li>
                <li>Is clearly marked with an AI indicator (💡)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-slate-700 mb-4 flex items-center">
                <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3 text-slate-600">2</span>
                Emergency Situations
              </h2>

              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-4">
                <h3 className="text-xl font-bold text-red-800 mb-3">⚠️ Seek Immediate Medical Attention</h3>
                <p className="text-red-700 text-lg font-semibold mb-3">
                  IF YOU ARE EXPERIENCING A MEDICAL EMERGENCY, CALL 911 (US/Canada) OR YOUR LOCAL EMERGENCY NUMBER IMMEDIATELY.
                </p>
                <p className="text-red-600 mb-3">
                  This website is not designed for emergency situations. In case of:
                </p>
                <ul className="list-disc pl-6 text-red-600 space-y-1">
                  <li>Severe allergic reactions</li>
                  <li>Difficulty breathing or choking</li>
                  <li>Uncontrolled bleeding</li>
                  <li>Loss of consciousness</li>
                  <li>High fever in infants under 3 months</li>
                  <li>Signs of severe dehydration</li>
                  <li>Any life-threatening condition</li>
                </ul>
                <p className="text-red-700 font-semibold mt-3">
                  DO NOT rely on information from this website. Seek immediate emergency medical care.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-slate-700 mb-4 flex items-center">
                <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3 text-slate-600">3</span>
                Content Accuracy & Sources
              </h2>

              <h3 className="text-xl font-medium text-slate-600 mb-3">Evidence-Based Information</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                We make every effort to provide evidence-based information sourced from:
              </p>
              <ul className="grid md:grid-cols-2 gap-3 mb-6">
                <li className="flex items-center text-slate-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Centers for Disease Control and Prevention (CDC)
                </li>
                <li className="flex items-center text-slate-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  American Academy of Pediatrics (AAP)
                </li>
                <li className="flex items-center text-slate-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  World Health Organization (WHO)
                </li>
                <li className="flex items-center text-slate-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Health Canada
                </li>
                <li className="flex items-center text-slate-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Canadian Paediatric Society
                </li>
                <li className="flex items-center text-slate-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Peer-reviewed medical journals
                </li>
              </ul>

              <h3 className="text-xl font-medium text-slate-600 mb-3">No Guarantee of Accuracy</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                While we strive for accuracy, we cannot guarantee that all information is complete, current, free from errors, or applicable to your specific situation. Medical knowledge evolves constantly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-slate-700 mb-4 flex items-center">
                <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3 text-slate-600">4</span>
                Limitation of Liability
              </h2>

              <p className="text-slate-600 leading-relaxed mb-4">
                To the fullest extent permitted by law, the operators, owners, contributors, and affiliates of this website shall not be liable for any:
              </p>
              <ul className="list-disc pl-6 mb-4 text-slate-600 space-y-2">
                <li>Direct, indirect, incidental, or consequential damages</li>
                <li>Loss or injury resulting from use of this website</li>
                <li>Decisions made based on information found on this website</li>
                <li>Errors, omissions, or inaccuracies in the content</li>
                <li>Technical failures, interruptions, or unavailability of the website</li>
              </ul>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mt-4">
                <p className="text-yellow-800">
                  <strong>Use at Your Own Risk:</strong> You acknowledge that use of this website and its information is entirely at your own risk. We provide the website and its content "as is" without any warranties of any kind.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-slate-700 mb-4 flex items-center">
                <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3 text-slate-600">5</span>
                User Responsibilities
              </h2>

              <p className="text-slate-600 leading-relaxed mb-4">
                By using this website, you agree to:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800">✓ Use information for personal, non-commercial purposes only</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800">✓ Verify all information with healthcare professionals</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800">✓ Not rely solely on this website for medical decisions</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800">✓ Seek emergency care when appropriate</p>
                </div>
              </div>
            </section>

            {/* Plain Language Summary */}
            <section className="mt-12 bg-gradient-to-r from-violet-50 to-blue-50 rounded-2xl p-8">
              <h2 className="text-2xl font-light text-slate-700 mb-4">Summary (Plain Language)</h2>
              <div className="space-y-3 text-slate-600">
                <p className="flex items-start">
                  <span className="text-violet-500 mr-3 text-xl">•</span>
                  <span>This website provides general information, not medical advice</span>
                </p>
                <p className="flex items-start">
                  <span className="text-violet-500 mr-3 text-xl">•</span>
                  <span>Always talk to your doctor or pediatrician about your specific situation</span>
                </p>
                <p className="flex items-start">
                  <span className="text-violet-500 mr-3 text-xl">•</span>
                  <span>AI responses might have errors - verify everything with your healthcare provider</span>
                </p>
                <p className="flex items-start">
                  <span className="text-violet-500 mr-3 text-xl">•</span>
                  <span>In emergencies, call 911 immediately</span>
                </p>
                <p className="flex items-start">
                  <span className="text-violet-500 mr-3 text-xl">•</span>
                  <span>Every baby is different - what works for one may not work for another</span>
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-violet-200">
                <p className="text-lg font-medium text-slate-700">
                  Remember: Your healthcare provider knows you and your baby best. This website is a helpful resource, but never a replacement for professional medical care.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-light text-slate-700 mb-4">Contact Us</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                If you have questions about this disclaimer or need medical guidance, please contact us:
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
                  <strong>Website:</strong> <a href="https://momaiagent.com" className="text-blue-600 hover:underline">momaiagent.com</a>
                </p>
              </div>
            </section>

            {/* Acceptance */}
            <div className="mt-8 p-6 bg-slate-100 rounded-xl">
              <p className="text-slate-700 text-center">
                <strong>By using this website, you acknowledge that you have read, understood, and agree to this disclaimer.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
