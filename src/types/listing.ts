export type DealType = 'sale' | 'rent';

export type PropertyType = 'condo' | 'house' | 'townhome' | 'land' | 'commercial';

export type ListingStatus = 'available' | 'reserved' | 'sold';

export interface Listing {
  id: string;
  code: string; // e.g. UD-00101
  title: string;
  titleEn?: string;
  dealType: DealType;
  propertyType: PropertyType;
  price: number; // in THB
  priceFormatted: string; // e.g. "฿1,450,000" or "฿8,500/เดือน"
  pinPrice: string; // e.g. "฿1.45M" or "฿8,500"
  status: ListingStatus;
  statusLabel: string;
  location: {
    address: string;
    subdistrict: string;
    district: string;
    province: string;
    lat: number;
    lng: number;
    nearLandmark?: string;
  };
  specs: {
    usableAreaSqm?: number;
    landAreaSqwa?: number;
    bedrooms?: number;
    bathrooms?: number;
    floor?: number;
    totalFloors?: number;
    parking?: number;
    unitType?: string;
  };
  images: string[];
  photoCount: number;
  features: string[];
  description: string;
  isVerified: boolean;
  updatedAt: string;
  poster: {
    name: string;
    role: 'owner' | 'agent';
    verified: boolean;
    phone?: string;
  };
}

export type SearchViewMode = 'list' | 'photo' | 'map';

export interface SearchFilterState {
  keyword: string;
  propertyType?: PropertyType;
  dealType?: DealType;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  viewMode: SearchViewMode;
}
