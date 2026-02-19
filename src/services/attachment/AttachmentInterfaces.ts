import type {
  AttachmentResponse,
  AttachmentsResponse,
} from './AttachmentTypes.js';

export interface IAttachmentService {
  getById(params: GetAttachmentByIdParams): Promise<AttachmentResponse>;
  getMultiple(
    params?: GetMultipleAttachmentsParams,
  ): Promise<AttachmentsResponse>;
}

export interface GetAttachmentByIdParams {
  attachmentId: string;
}

interface AttachmentFiltersMap {
  title?: string;
  file_name?: string;
  file_type?: string;
}

export type AttachmentFilters = {
  [K in keyof AttachmentFiltersMap]?: AttachmentFiltersMap[K];
};

export interface GetMultipleAttachmentsParams {
  filters?: AttachmentFilters;
}
