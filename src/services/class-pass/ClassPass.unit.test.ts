import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { ClassPassService } from './ClassPass.js';
import type { BookwhenClassPass } from './ClassPassTypes.js';

describe('ClassPassService', () => {
  let classPassService: ClassPassService;
  let mockAxiosInstance: AxiosInstance;

  beforeEach(() => {
    mockAxiosInstance = axios.create();
    classPassService = new ClassPassService(mockAxiosInstance);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('retrieves a single class pass by id', async () => {
    const classPass = {
      id: 'cp-1',
      type: 'class_pass',
    } as BookwhenClassPass;

    vi.spyOn(mockAxiosInstance, 'get').mockResolvedValue({
      data: { data: classPass },
    });

    const result = await classPassService.getById({ classPassId: 'cp-1' });

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/class_passes/cp-1');
    expect(result).toEqual({ data: classPass });
  });

  it('maps 404 errors on getById to a class-pass-specific message', async () => {
    vi.spyOn(mockAxiosInstance, 'get').mockRejectedValue({
      response: { status: 404 },
    });

    await expect(
      classPassService.getById({ classPassId: 'missing' }),
    ).rejects.toThrow(
      'Class pass not found. Please check the class pass ID and try again.',
    );
  });

  it('validates getById params', async () => {
    // @ts-expect-error validating runtime schema guard
    await expect(classPassService.getById(1)).rejects.toThrow(
      'classPasses.getById: Schema Validation failed: Expected object, received number',
    );
  });

  it('retrieves multiple class passes', async () => {
    const classPasses = [{ id: 'cp-1' }] as BookwhenClassPass[];

    vi.spyOn(mockAxiosInstance, 'get').mockResolvedValue({
      data: { data: classPasses },
    });

    const result = await classPassService.getMultiple();

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/class_passes');
    expect(result).toEqual({ data: classPasses });
  });

  it('builds filtered query for getMultiple', async () => {
    vi.spyOn(mockAxiosInstance, 'get').mockResolvedValue({
      data: { data: [] },
    });

    await classPassService.getMultiple({
      filters: {
        title: 'Studio pass',
        usage_type: 'personal',
      },
    });

    expect(mockAxiosInstance.get).toHaveBeenCalledWith(
      '/class_passes?filter[title]=Studio%20pass&filter[usage_type]=personal',
    );
  });
});
