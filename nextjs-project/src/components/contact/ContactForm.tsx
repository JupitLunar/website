'use client';

import { useEffect, useState } from 'react';

type ContactType = 'support' | 'enterprise' | 'general';
type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

interface ContactFormState {
  name: string;
  email: string;
  company: string;
  contactType: ContactType;
  message: string;
}

const CONTACT_TYPES: Record<ContactType, { label: string; help: string }> = {
  support: {
    label: 'DearBaby product support',
    help: 'App access, syncing, subscriptions, tracking workflows, and product troubleshooting.',
  },
  enterprise: {
    label: 'Partnership and enterprise',
    help: 'Clinic, employer, licensing, research, and partner workflows with JupitLunar.',
  },
  general: {
    label: 'Content corrections or general inquiry',
    help: 'Citation fixes, wording corrections, broken links, and public website questions.',
  },
};

const MAX_MESSAGE_LENGTH = 2000;

function resolveContactType(value: string | null): ContactType {
  if (value === 'support' || value === 'enterprise' || value === 'general') {
    return value;
  }
  return 'general';
}

export default function ContactForm() {
  const [form, setForm] = useState<ContactFormState>({
    name: '',
    email: '',
    company: '',
    contactType: 'general',
    message: '',
  });
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const parsedType = resolveContactType(params.get('type'));
    setForm((prev) => ({ ...prev, contactType: parsedType }));
  }, []);

  const messageRemaining = MAX_MESSAGE_LENGTH - form.message.length;

  const updateField = <K extends keyof ContactFormState>(key: K, value: ContactFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const trackSuccessfulSubmit = async (contactType: ContactType) => {
    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'contact_form_submitted',
          event_data: {
            contactType,
            surface: 'contact_page',
          },
          session_id: `contact-${Date.now()}`,
        }),
      });
    } catch {
      // Tracking should not block form completion.
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('error');
      setFeedback('Please complete name, email, and message before sending.');
      return;
    }

    const payloadMessage = form.company.trim()
      ? `Organization: ${form.company.trim()}\n\n${form.message.trim()}`
      : form.message.trim();

    setStatus('submitting');
    setFeedback(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: payloadMessage,
          contactType: form.contactType,
        }),
      });

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          typeof body.error === 'string'
            ? body.error
            : 'Unable to send your request right now. Please try again.',
        );
      }

      await trackSuccessfulSubmit(form.contactType);
      setStatus('success');
      setFeedback('Submitted. We received your request and will follow up by email.');
      setForm((prev) => ({
        ...prev,
        name: '',
        email: '',
        company: '',
        message: '',
      }));
    } catch (error) {
      setStatus('error');
      setFeedback(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="contact-form" className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-2">Contact Form</p>
          <h2 className="text-2xl font-semibold text-indigo-900">Send a request</h2>
          <p className="text-sm text-slate-600 mt-2">
            Support requests usually get a response within 1 business day. Partnership inquiries usually within 3 business days.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Name</span>
            <input
              required
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              placeholder="Your name"
              maxLength={100}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              placeholder="you@company.com"
              maxLength={255}
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Request type</span>
            <select
              value={form.contactType}
              onChange={(event) => updateField('contactType', resolveContactType(event.target.value))}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              {(Object.keys(CONTACT_TYPES) as ContactType[]).map((contactType) => (
                <option key={contactType} value={contactType}>
                  {CONTACT_TYPES[contactType].label}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500">{CONTACT_TYPES[form.contactType].help}</p>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Organization (optional)</span>
            <input
              value={form.company}
              onChange={(event) => updateField('company', event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              placeholder="JupitLunar, clinic, startup, etc."
              maxLength={120}
            />
          </label>
        </div>

        <label className="space-y-2 block">
          <span className="text-sm font-medium text-slate-700">Message</span>
          <textarea
            required
            value={form.message}
            onChange={(event) => updateField('message', event.target.value)}
            className="w-full min-h-44 rounded-xl border border-slate-300 px-4 py-3 text-sm leading-relaxed focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            placeholder="Describe what you need, relevant links/screenshots, and the fastest way for us to help."
            maxLength={MAX_MESSAGE_LENGTH}
          />
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Not for emergency or individualized medical advice.
            </span>
            <span className={messageRemaining < 200 ? 'text-amber-600' : 'text-slate-500'}>
              {messageRemaining} characters left
            </span>
          </div>
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === 'submitting' ? 'Sending...' : 'Send Request'}
          </button>
          <a
            href="mailto:support@momaiagent.com"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400"
          >
            Email instead
          </a>
        </div>

        {feedback && (
          <p
            className={`rounded-xl px-4 py-3 text-sm ${
              status === 'success'
                ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border border-rose-200 bg-rose-50 text-rose-700'
            }`}
          >
            {feedback}
          </p>
        )}
      </form>
    </section>
  );
}
