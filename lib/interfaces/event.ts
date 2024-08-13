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
}

interface EventsResponse {
  events: Event[];
  total: number;
  offset: number;
  limit: number;
}

export { Event, EventsResponse };
