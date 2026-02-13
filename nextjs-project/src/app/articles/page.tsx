import type { Metadata } from 'next';
import Link from 'next/link';
import { contentManager } from '@/lib/supabase';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.momaiagent.com').replace(/\/$/, '');
const PAGE_SIZE = 100;

type SearchParams = {
  page?: string;
};

export const revalidate = 1800;

export const metadata: Metadata = {
  title: 'Article Library',
  description: 'Browse all evidence-based parenting articles from Mom AI Agent.',
  alternates: {
    canonical: `${SITE_URL}/articles`,
  },
};

function parsePage(pageValue?: string): number {
  if (!pageValue) return 1;
  const parsed = Number(pageValue);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const currentPage = parsePage(searchParams.page);
  const allArticles = await contentManager.getAllArticles();
  const totalArticles = allArticles.length;
  const totalPages = Math.max(1, Math.ceil(totalArticles / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);

  const start = (page - 1) * PAGE_SIZE;
  const currentArticles = allArticles.slice(start, start + PAGE_SIZE);

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-light text-slate-800">Article Library</h1>
          <p className="mt-4 text-slate-600 text-lg">
            Internal index for {totalArticles} published evidence-based parenting articles.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Page {page} of {totalPages}
          </p>
        </div>

        <ul className="space-y-4">
          {currentArticles.map((article: any) => (
            <li key={article.slug} className="rounded-xl border border-slate-200 bg-white p-4 hover:border-slate-300 transition-colors">
              <Link href={`/${article.slug}`} className="text-lg font-medium text-slate-800 hover:text-violet-700 transition-colors">
                {article.title || article.slug}
              </Link>
              <div className="mt-2 text-sm text-slate-500">
                {article.hub ? <span>{article.hub}</span> : null}
                {article.date_published ? <span> · {new Date(article.date_published).toLocaleDateString()}</span> : null}
              </div>
            </li>
          ))}
        </ul>

        <nav className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6">
          {page > 1 ? (
            <Link
              href={`/articles?page=${page - 1}`}
              className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Previous page
            </Link>
          ) : (
            <span className="text-sm text-slate-400">Previous page</span>
          )}

          {page < totalPages ? (
            <Link
              href={`/articles?page=${page + 1}`}
              className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Next page
            </Link>
          ) : (
            <span className="text-sm text-slate-400">Next page</span>
          )}
        </nav>
      </div>
    </section>
  );
}
