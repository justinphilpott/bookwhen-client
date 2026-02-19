import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { AttachmentService } from './Attachment.js';
import type { BookwhenAttachment } from './AttachmentTypes.js';

describe('AttachmentService', () => {
  let attachmentService: AttachmentService;
  let mockAxiosInstance: AxiosInstance;

  beforeEach(() => {
    mockAxiosInstance = axios.create();
    attachmentService = new AttachmentService(mockAxiosInstance);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('retrieves a single attachment by id', async () => {
    const attachment = {
      id: 'att-1',
      type: 'attachment',
    } as BookwhenAttachment;

    vi.spyOn(mockAxiosInstance, 'get').mockResolvedValue({
      data: { data: attachment },
    });

    const result = await attachmentService.getById({ attachmentId: 'att-1' });

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/attachments/att-1');
    expect(result).toEqual({ data: attachment });
  });

  it('maps 404 errors on getById to an attachment-specific message', async () => {
    vi.spyOn(mockAxiosInstance, 'get').mockRejectedValue({
      response: { status: 404 },
    });

    await expect(
      attachmentService.getById({ attachmentId: 'missing' }),
    ).rejects.toThrow(
      'Attachment not found. Please check the attachment ID and try again.',
    );
  });

  it('validates getById params', async () => {
    // @ts-expect-error validating runtime schema guard
    await expect(attachmentService.getById(1)).rejects.toThrow(
      'attachments.getById: Schema Validation failed: Expected object, received number',
    );
  });

  it('retrieves multiple attachments', async () => {
    const attachments = [{ id: 'att-1' }] as BookwhenAttachment[];

    vi.spyOn(mockAxiosInstance, 'get').mockResolvedValue({
      data: { data: attachments },
    });

    const result = await attachmentService.getMultiple();

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/attachments');
    expect(result).toEqual({ data: attachments });
  });

  it('builds filtered query for getMultiple', async () => {
    vi.spyOn(mockAxiosInstance, 'get').mockResolvedValue({
      data: { data: [] },
    });

    await attachmentService.getMultiple({
      filters: {
        title: 'Programme',
        file_type: 'pdf',
      },
    });

    expect(mockAxiosInstance.get).toHaveBeenCalledWith(
      '/attachments?filter[title]=Programme&filter[file_type]=pdf',
    );
  });
});
