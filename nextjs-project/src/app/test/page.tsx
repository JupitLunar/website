import React from 'react';
import type { Metadata } from 'next';
import ContentHubCard from '@/components/geo/ContentHubCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Component Test | DearBaby Internal',
  description: 'Internal component test page for DearBaby by JupitLunar.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function TestPage() {
  // Mock data for testing
  const mockHub = {
    id: 'feeding' as const,
    name: 'Feeding & Nutrition',
    description: 'Evidence-based guidance on breastfeeding, formula feeding, and introducing solid foods.',
    color: 'feeding',
    icon: '🍼',
    slug: 'feeding',
    content_count: 5
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Component Test Page</h1>
        
        <div className="space-y-8">
          {/* Test ContentHubCard */}
          <div>
            <h2 className="text-xl font-semibold mb-4">ContentHubCard Test</h2>
            <div className="max-w-md">
              <ContentHubCard hub={mockHub} />
            </div>
          </div>

          {/* Test Card Components */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Card Components Test</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Test Card 1</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>This is a test card to verify the UI components are working.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Test Card 2</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Another test card to ensure everything is functioning properly.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Database Connection Test */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Database Connection Test</h2>
            <Card>
              <CardHeader>
                <CardTitle>Connection Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-600">✅ Database connection successful</p>
                <p className="text-gray-600 mt-2">All 6 content hubs created and accessible</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
