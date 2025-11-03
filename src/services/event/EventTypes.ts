export interface EventImage {
  image_url: string; // Assuming this is a string; adjust if it's an array or different structure
  alt_ratio_16x9_1x_url: string;
  alt_ratio_16x9_2x_url: string;
  alt_ratio_16x9_3x_url: string;
  alt_ratio_4x3_1x_url: string;
  alt_ratio_4x3_2x_url: string;
  alt_ratio_4x3_3x_url: string;
  alt_ratio_1x1_1x_url: string;
  alt_ratio_1x1_2x_url: string;
  alt_ratio_1x1_3x_url: string;
}

export interface EventAttributes {
  title: string;
  details: string;
  all_day: boolean;
  start_at: string; // Consider using Date for TypeScript, but string is fine if manipulating as ISO strings
  end_at: string;
  attendee_limit: number;
  attendee_count: number;
  waiting_list: boolean;
  max_tickets_per_booking: number;
  tags: string[];
  event_image: EventImage;
}

export interface BookwhenEvent {
  id: string;
  type: string; // 'event'
  attributes: EventAttributes;
  // Assuming relationships, links, and included will be defined later
}

// JSON:API compliant response interfaces
export interface JsonApiResponse<T> {
  data: T;
  included?: any[];
  links?: {
    self?: string;
    first?: string;
    last?: string;
    prev?: string;
    next?: string;
  };
  meta?: {
    page?: {
      current?: number;
      total?: number;
      size?: number;
    };
  };
}

export interface EventsResponse extends JsonApiResponse<BookwhenEvent[]> {}

export interface EventResponse extends JsonApiResponse<BookwhenEvent> {}
