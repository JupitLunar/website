import React from 'react';

const Complete: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 text-slate-700">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-purple-200 opacity-40 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-indigo-200 opacity-30 blur-3xl" />
      </div>

      <header className="relative mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg">
            <span className="text-2xl">🪐</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-500">JupitLunar</p>
            <h1 className="text-lg font-semibold text-slate-800">Mom AI Agent Platform</h1>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-500 md:flex">
          <a className="transition hover:text-indigo-500" href="/">Home</a>
          <a className="transition hover:text-indigo-500" href="/products">Products</a>
          <a className="transition hover:text-indigo-500" href="/sitefaq">FAQ</a>
        </nav>
      </header>

      <main className="relative mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col items-center px-6 pb-24">
        <div className="w-full max-w-2xl rounded-3xl border border-white/60 bg-white/90 p-10 text-center shadow-xl backdrop-blur">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-9 w-9"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-900">You're All Set!</h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Your email has been verified successfully. We&apos;re excited to have you join the Mom AI Agent community.
            Explore curated guidance, tailored support, and tools designed to accompany every step of your parenting journey.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/momaiagent/complete"
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700"
            >
              Go to your dashboard
            </a>
            <a
              href="/products"
              className="inline-flex items-center justify-center rounded-full border border-indigo-100 bg-white px-6 py-3 text-sm font-semibold text-indigo-600 transition hover:border-indigo-200"
            >
              Explore features
            </a>
          </div>
        </div>

        <section className="mt-16 grid w-full gap-8 rounded-3xl border border-white/50 bg-white/80 p-10 backdrop-blur md:grid-cols-3">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-400">Next steps</span>
            <h3 className="text-xl font-semibold text-slate-900">What happens now?</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              We&apos;ve curated a quick guide so you know exactly how to begin making the most of your new AI assistant.
            </p>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">1</div>
              <div>
                <h4 className="text-base font-semibold text-slate-800">Personalize your profile</h4>
                <p className="text-sm text-slate-600">
                  Share your family&apos;s details so we can tailor daily insights and reminders that truly resonate.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">2</div>
              <div>
                <h4 className="text-base font-semibold text-slate-800">Explore curated hubs</h4>
                <p className="text-sm text-slate-600">
                  Discover expert-backed content organized around pregnancy, newborn care, infant development, and more.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">3</div>
              <div>
                <h4 className="text-base font-semibold text-slate-800">Connect with support</h4>
                <p className="text-sm text-slate-600">
                  Join community sessions and live Q&amp;A events hosted by pediatric specialists and parenting coaches.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 p-6 text-white">
            <div>
              <h4 className="text-lg font-semibold">Need a hand?</h4>
              <p className="mt-2 text-sm text-indigo-100">
                Our concierge team is here to help you set up and learn the ropes. Reach out anytime and we&apos;ll guide you
                through your first week.
              </p>
            </div>
            <a
              href="mailto:hello@momaiagent.com"
              className="inline-flex items-center justify-center rounded-full bg-white/90 px-5 py-3 text-sm font-semibold text-indigo-600 shadow-lg transition hover:bg-white"
            >
              Contact support
            </a>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-white/60 bg-white/70 py-6 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-4 px-6 text-xs text-slate-500 md:flex-row">
          <p>&copy; {new Date().getFullYear()} Mom AI Agent. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a className="transition hover:text-indigo-500" href="/privacy">
              Privacy Policy
            </a>
            <a className="transition hover:text-indigo-500" href="/disclaimer">
              Disclaimer
            </a>
            <a className="transition hover:text-indigo-500" href="mailto:hello@momaiagent.com">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Complete;
