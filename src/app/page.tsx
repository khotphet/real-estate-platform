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
import { MOCK_LISTINGS } from '@/data/mock-listings';
import { SearchViewMode } from '@/types/listing';
import { THAILAND_CENTER, getProvinceByName } from '@/data/provinces';

export default function SearchPage() {
  const [activeType, setActiveType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<SearchViewMode>('map');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>('newest');

  // Province info for center/zoom and breadcrumb
  const currentProvinceInfo = useMemo(() => {
    if (selectedProvince === 'all') return null;
    return getProvinceByName(selectedProvince);
  }, [selectedProvince]);

  const mapCenter = useMemo(() => {
    if (currentProvinceInfo) {
      return { lat: currentProvinceInfo.lat, lng: currentProvinceInfo.lng };
    }
    return { lat: THAILAND_CENTER.lat, lng: THAILAND_CENTER.lng };
  }, [currentProvinceInfo]);

  const mapZoom = useMemo(() => {
    if (currentProvinceInfo) return currentProvinceInfo.zoom;
    return 6;
  }, [currentProvinceInfo]);

  // Filter listings based on current province, search & active category chip
  // Rule O5: Sold items are hidden from search results
  const filteredListings = useMemo(() => {
    return MOCK_LISTINGS.filter((item) => {
      // Hide sold items from public search feed
      if (item.status === 'sold') return false;

      // Filter by Province
      if (selectedProvince !== 'all' && item.location.province !== selectedProvince) {
        return false;
      }

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
          item.location.district.toLowerCase().includes(q) ||
          item.location.province.toLowerCase().includes(q) ||
          (item.location.nearLandmark && item.location.nearLandmark.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      return 0; // default newest
    });
  }, [selectedProvince, activeType, searchQuery, sortOption]);

  // Counts for the category chips in current province scope
  const counts = useMemo(() => {
    const activeSearch = MOCK_LISTINGS.filter((l) => {
      if (l.status === 'sold') return false;
      if (selectedProvince !== 'all' && l.location.province !== selectedProvince) return false;
      return true;
    });

    return {
      all: activeSearch.length,
      condo: activeSearch.filter((l) => l.propertyType === 'condo').length,
      house: activeSearch.filter((l) => l.propertyType === 'house').length,
      townhome: activeSearch.filter((l) => l.propertyType === 'townhome').length,
      land: activeSearch.filter((l) => l.propertyType === 'land').length,
    };
  }, [selectedProvince]);

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
        selectedProvince={selectedProvince}
        onSelectProvince={(prov) => setSelectedProvince(prov)}
        counts={counts}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-muted mb-1">
              <span
                onClick={() => setSelectedProvince('all')}
                className="hover:text-foreground cursor-pointer"
              >
                หน้าแรก
              </span>
              <span>/</span>
              {currentProvinceInfo ? (
                <>
                  <span className="text-muted">{currentProvinceInfo.region}</span>
                  <span>/</span>
                  <span className="text-primary font-semibold">{currentProvinceInfo.nameTh}</span>
                </>
              ) : (
                <span className="text-primary font-semibold">ทั่วประเทศไทย (77 จังหวัด)</span>
              )}
            </nav>

            {/* Results Title & Count */}
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight flex items-baseline gap-2">
              <span>
                {selectedProvince === 'all'
                  ? 'อสังหาริมทรัพย์ทั่วประเทศไทย'
                  : `อสังหาริมทรัพย์ใน${selectedProvince}`}
              </span>
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
                className="px-6 py-2.5 rounded-xl border border-border bg-surface hover:bg-background text-xs font-bold text-foreground transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
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
                className="px-6 py-2.5 rounded-xl border border-border bg-surface hover:bg-background text-xs font-bold text-foreground transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
                <span>โหลดเพิ่มเติม (แสดงครบทั้ง {filteredListings.length} รายการ)</span>
              </button>
            </div>
          </div>
        )}

        {viewMode === 'map' && (
          <div>
            <MapView
              listings={filteredListings}
              center={mapCenter}
              zoom={mapZoom}
              provinceName={selectedProvince}
            />
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
