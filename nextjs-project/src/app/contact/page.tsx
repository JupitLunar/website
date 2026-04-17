import type { Metadata } from 'next';
import Link from 'next/link';
import ContactForm from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact & Support',
  description:
    'Contact Mom AI Agent for answer-hub questions, trust and methodology questions, content corrections, and product support.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact & Support',
    description:
      'Use the contact form for platform questions, citation corrections, and product support.',
    url: '/contact',
  },
  twitter: {
    title: 'Contact & Support',
    description:
      'Platform support, correction reports, and product support for Mom AI Agent.',
  },
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6 text-indigo-900">Contact Mom AI Agent</h1>

      <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <p className="text-lg mb-6 text-slate-700">
          Reach out for answer-hub questions, trust and methodology questions, content corrections, or product support.
          Mom AI Agent is the public evidence hub; products sit downstream of that public platform.
        </p>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-3">Platform questions</p>
            <h2 className="text-xl font-semibold mb-3 text-indigo-800">Trust, methodology, and platform scope</h2>
            <p className="text-sm text-slate-600 mb-4">
              For public answer-hub questions, source model issues, trust feedback, and platform clarification.
            </p>
            <Link
              href="/contact?type=general#contact-form"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Open platform form →
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-3">Product support</p>
            <h2 className="text-xl font-semibold mb-3 text-indigo-800">DearBaby support</h2>
            <p className="text-sm text-slate-600 mb-4">
              For account help, subscriptions, tracking issues, and app feedback.
            </p>
            <Link
              href="/contact?type=support#contact-form"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Open support form →
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-3">Corrections</p>
            <h2 className="text-xl font-semibold mb-3 text-indigo-800">Source and content fixes</h2>
            <p className="text-sm text-slate-600 mb-4">
              For citation fixes, broken links, source wording, and evidence quality feedback.
            </p>
            <Link
              href="/contact?type=general#contact-form"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Report correction →
            </Link>
          </div>
        </div>

        <ContactForm />

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-indigo-800">Direct contacts</h2>
            <div className="space-y-4">
              <p className="flex items-center text-slate-600">
                <span className="font-medium w-24">Email:</span>
                <a href="mailto:support@momaiagent.com" className="text-indigo-600 hover:text-indigo-800">
                  support@momaiagent.com
                </a>
              </p>
              <p className="flex items-center text-slate-600">
                <span className="font-medium w-24">LinkedIn:</span>
                <a
                  href="https://www.linkedin.com/company/dearbabyai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Mom AI Agent on LinkedIn
                </a>
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
            <h3 className="text-lg font-semibold mb-3 text-indigo-800">Before you submit</h3>
            <p className="text-slate-600 mb-4">
              Include relevant page links, expected behavior, and screenshots when possible.
              For urgent symptoms or medical concerns, contact your pediatric or emergency care team directly.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/search" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                Open Answer Hub
              </Link>
              <Link href="/trust" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                Review Trust Center
              </Link>
              <Link href="/faq" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                Browse FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} JupitLunar. Mom AI Agent is the public evidence hub for the platform.</p>
        <p>This contact page is for support and correction requests, not individualized medical advice.</p>
      </div>
    </div>
  );
}
