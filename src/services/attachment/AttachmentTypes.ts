export interface AttachmentAttributes {
  title: string;
  file_url: string;
  file_size_bytes: string;
  file_size_text: string;
  file_name: string;
  file_type: string;
  content_type: string;
}

export interface BookwhenAttachment {
  id: string;
  type: string;
  attributes: AttachmentAttributes;
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

export interface AttachmentsResponse
  extends JsonApiResponse<BookwhenAttachment[]> {}

export interface AttachmentResponse
  extends JsonApiResponse<BookwhenAttachment> {}
