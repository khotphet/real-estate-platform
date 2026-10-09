'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { FilterBar } from '@/components/search/FilterBar';
import { ListView } from '@/components/search/ListView';
import { PhotoView } from '@/components/search/PhotoView';
import { MapView } from '@/components/search/MapView';
import { DemandBanner } from '@/components/search/DemandBanner';
import { FilterModal } from '@/components/search/FilterModal';
import { Footer } from '@/components/layout/Footer';
import { MOCK_LISTINGS, getActiveSearchListings } from '@/data/mock-listings';
import { SearchViewMode } from '@/types/listing';

export default function SearchPage() {
  const [activeType, setActiveType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<SearchViewMode>('list');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>('newest');

  // Filter listings based on current search & active category chip
  // Rule O5: Sold items are hidden from search results (11 active listings)
  const filteredListings = useMemo(() => {
    return MOCK_LISTINGS.filter((item) => {
      // Hide sold items from public search feed
      if (item.status === 'sold') return false;

      // Filter by property type chip
      if (activeType !== 'all' && item.propertyType !== activeType) {
        return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          item.title.toLowerCase().includes(q) ||
          item.location.address.toLowerCase().includes(q) ||
          item.location.subdistrict.toLowerCase().includes(q) ||
          (item.location.nearLandmark && item.location.nearLandmark.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [activeType, searchQuery]);

  // Counts for the category chips (only available & reserved, sold hidden)
  const counts = useMemo(() => {
    const activeSearch = MOCK_LISTINGS.filter((l) => l.status !== 'sold');
    return {
      all: activeSearch.length, // 11
      condo: activeSearch.filter((l) => l.propertyType === 'condo').length, // 3
      house: activeSearch.filter((l) => l.propertyType === 'house').length, // 4
      townhome: activeSearch.filter((l) => l.propertyType === 'townhome').length, // 2
      land: activeSearch.filter((l) => l.propertyType === 'land').length, // 2
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Main Navigation */}
      <Navbar onSearch={(q) => setSearchQuery(q)} />

      {/* Sticky Filter & View Switcher Bar */}
      <FilterBar
        activeType={activeType}
        onSelectType={setActiveType}
        activeView={viewMode}
        onChangeView={setViewMode}
        onOpenFilterModal={() => setIsFilterOpen(true)}
        counts={counts}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-muted mb-1">
              <span className="hover:text-foreground cursor-pointer">หน้าแรก</span>
              <span>/</span>
              <span className="hover:text-foreground cursor-pointer">ภาคอีสาน</span>
              <span>/</span>
              <span className="text-primary font-semibold">อุดรธานี</span>
            </nav>

            {/* Results Title & Count */}
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight flex items-baseline gap-2">
              <span>อสังหาริมทรัพย์ในอุดรธานี</span>
              <span className="text-sm font-semibold text-primary">
                (พบ {filteredListings.length} รายการ)
              </span>
            </h1>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
            <span className="text-muted font-medium">เรียงตาม:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-surface border border-border rounded-xl px-3 py-1.5 font-semibold text-foreground focus:outline-none focus:border-primary shadow-2xs"
            >
              <option value="newest">ล่าสุด (Newest)</option>
              <option value="price-asc">ราคา: ต่ำ - สูง</option>
              <option value="price-desc">ราคา: สูง - ต่ำ</option>
              <option value="popular">ยอดนิยม (Most Viewed)</option>
            </select>
          </div>
        </div>

        {/* View Content Switching */}
        {viewMode === 'list' && (
          <div>
            <ListView listings={filteredListings} />
            <DemandBanner />

            {/* Load More Button */}
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                className="px-6 py-2.5 rounded-xl border border-border bg-surface hover:bg-background text-xs font-bold text-foreground transition-all shadow-2xs flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
                <span>โหลดเพิ่มเติม (แสดงครบทั้ง {filteredListings.length} รายการ)</span>
              </button>
            </div>
          </div>
        )}

        {viewMode === 'photo' && (
          <div>
            <PhotoView listings={filteredListings} />
            <DemandBanner />

            {/* Load More Button */}
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                className="px-6 py-2.5 rounded-xl border border-border bg-surface hover:bg-background text-xs font-bold text-foreground transition-all shadow-2xs flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
                <span>โหลดเพิ่มเติม (แสดงครบทั้ง {filteredListings.length} รายการ)</span>
              </button>
            </div>
          </div>
        )}

        {viewMode === 'map' && (
          <div>
            <MapView listings={filteredListings} />
          </div>
        )}
      </main>

      {/* S07 Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(f) => {
          if (f.propertyType) setActiveType(f.propertyType);
        }}
        totalResults={filteredListings.length}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
