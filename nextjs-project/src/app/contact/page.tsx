import React from 'react';
import type { Metadata } from 'next';
import ContactChatbot from '@/components/ContactChatbot';

export const metadata: Metadata = {
    title: 'Contact Us - Mom AI Agent',
    description: 'Get in touch with Mom AI Agent. We value your feedback and are here to help with any questions about evidence-based parenting guidance.',
};

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-indigo-900">Contact Us</h1>

            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <p className="text-lg mb-6 text-slate-700">
                    We value your feedback and questions! Whether you have a suggestion for new content,
                    encountered an issue with the website, or just want to say hello, we're here to listen.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-indigo-800">Get in Touch</h2>
                        <div className="space-y-4">
                            <p className="flex items-center text-slate-600">
                                <span className="font-medium w-24">Email:</span>
                                <a href="mailto:contact@jupitlunar.com" className="text-indigo-600 hover:text-indigo-800">
                                    contact@jupitlunar.com
                                </a>
                            </p>
                            <p className="flex items-center text-slate-600">
                                <span className="font-medium w-24">Twitter:</span>
                                <a href="https://twitter.com/jupitlunar" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                                    @jupitlunar
                                </a>
                            </p>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-lg font-semibold mb-3 text-indigo-800">Common Topics</h3>
                            <ul className="list-disc pl-5 space-y-2 text-slate-600">
                                <li>Feature requests for Mom AI Agent</li>
                                <li>Reporting technical issues</li>
                                <li>Partnership inquiries</li>
                                <li>Content correction suggestions</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                        <h3 className="text-lg font-semibold mb-3 text-indigo-800">Need Immediate Advice?</h3>
                        <p className="text-slate-600 mb-4">
                            For parenting questions, try our AI Assistant! It's trained on evidence-based data from the CDC, AAP, and WHO.
                        </p>
                        <div className="flex justify-center">
                            {/* Visual placeholder or CTA for the chatbot which is fixed in the corner usually */}
                            <p className="text-sm text-indigo-500 italic">
                                Click the chat icon in the bottom right corner to start a conversation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center text-slate-500 text-sm">
                <p>© {new Date().getFullYear()} JupitLunar. All rights reserved.</p>
                <p>Medical Disclaimer: The information provided is for educational purposes only and does not constitute medical advice.</p>
            </div>
        </div>
    );
}
