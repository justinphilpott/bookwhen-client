export interface TicketCost {
  currency_code: string;
  net: number;
  tax: number;
  face_value_net?: number;
}

export interface TicketAttributes {
  title: string;
  details: string;
  number_issued: number | null;
  number_taken: number;
  course_ticket: boolean;
  group_ticket: boolean;
  group_min: number | null;
  group_max: number | null;
  available: boolean;
  available_from: string | null;
  available_to: string | null;
  cost: TicketCost;
  built_basket_iframe_url: string;
  built_basket_url: string;
}

export interface TicketRelationshipData {
  id: string;
  type: string;
}

export interface TicketRelationships {
  events?: {
    data: TicketRelationshipData[];
  };
  class_passes?: {
    data: TicketRelationshipData[];
  };
}

export interface BookwhenTicket {
  id: string;
  type: string;
  attributes: TicketAttributes;
  relationships?: TicketRelationships;
}

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

export interface TicketsResponse extends JsonApiResponse<BookwhenTicket[]> {}

export interface TicketResponse extends JsonApiResponse<BookwhenTicket> {}
