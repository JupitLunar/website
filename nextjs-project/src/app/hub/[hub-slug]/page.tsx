import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Redirecting',
  robots: {
    index: false,
    follow: false,
  },
};

export default function HubRedirectPage({ params }: { params: { 'hub-slug': string } }) {
  redirect(`/insight?hub=${encodeURIComponent(params['hub-slug'])}`);
}
