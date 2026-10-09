import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PropertyDetailView } from '@/components/listing/PropertyDetailView';
import { MOCK_LISTINGS } from '@/data/mock-listings';

interface ListingPageProps {
  params: Promise<{
    code: string;
  }>;
}

export async function generateStaticParams() {
  return MOCK_LISTINGS.map((listing) => ({
    code: listing.code,
  }));
}

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const { code } = await params;
  const decodedCode = decodeURIComponent(code);
  const listing = MOCK_LISTINGS.find(
    (item) => item.code.toLowerCase() === decodedCode.toLowerCase() || item.id === decodedCode
  );

  if (!listing) {
    return {
      title: 'ไม่พบทรัพย์ที่ต้องการ — MapNest',
    };
  }

  return {
    title: `${listing.title} | MapNest อสังหาฯ อุดรธานี`,
    description: `${listing.title} ราคา ${listing.priceFormatted} ที่ตั้ง ${listing.location.subdistrict} อุดรธานี`,
    openGraph: {
      title: listing.title,
      description: listing.description,
      images: [listing.images[0]],
    },
  };
}

export default async function ListingDetailPage({ params }: ListingPageProps) {
  const { code } = await params;
  const decodedCode = decodeURIComponent(code);

  const listing = MOCK_LISTINGS.find(
    (item) => item.code.toLowerCase() === decodedCode.toLowerCase() || item.id === decodedCode
  );

  if (!listing) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas-background">
      <Navbar />
      <main className="flex-1">
        <PropertyDetailView listing={listing} />
      </main>
      <Footer />
    </div>
  );
}
