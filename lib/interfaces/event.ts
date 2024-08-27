import { BrandInfo } from './accountInfo';

interface Event {
  id: string;
  name: string;
  gameId: string;
  brandId: string;
  beginDate: Date;
  endDate: Date;
  description: string;
  status: string;
  images: string[];
  brandInfo: BrandInfo;
  favorite?: boolean;
}

interface EventsResponse {
  events: Event[];
  total: number;
  offset: number;
  limit: number;
}

interface FavoriteEventsResponse {
  favoriteEvents: Event[];
  total: number;
  offset: number;
  limit: number;
}

export { Event, EventsResponse, FavoriteEventsResponse };
