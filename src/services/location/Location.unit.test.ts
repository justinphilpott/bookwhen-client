import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { LocationService } from './Location.js';
import type { BookwhenLocation } from './LocationTypes.js';

describe('LocationService', () => {
  let locationService: LocationService;
  let mockAxiosInstance: AxiosInstance;

  beforeEach(() => {
    mockAxiosInstance = axios.create();
    locationService = new LocationService(mockAxiosInstance);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('retrieves a single location by id', async () => {
    const location = { id: 'loc-1', type: 'location' } as BookwhenLocation;

    vi.spyOn(mockAxiosInstance, 'get').mockResolvedValue({
      data: { data: location },
    });

    const result = await locationService.getById({ locationId: 'loc-1' });

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/locations/loc-1');
    expect(result).toEqual({ data: location });
  });

  it('maps 404 errors on getById to a location-specific message', async () => {
    vi.spyOn(mockAxiosInstance, 'get').mockRejectedValue({
      response: { status: 404 },
    });

    await expect(
      locationService.getById({ locationId: 'missing' }),
    ).rejects.toThrow(
      'Location not found. Please check the location ID and try again.',
    );
  });

  it('validates getById params', async () => {
    // @ts-expect-error validating runtime schema guard
    await expect(locationService.getById(1)).rejects.toThrow(
      'locations.getById: Schema Validation failed: Expected object, received number',
    );
  });

  it('retrieves multiple locations', async () => {
    const locations = [{ id: 'loc-1' }, { id: 'loc-2' }] as BookwhenLocation[];

    vi.spyOn(mockAxiosInstance, 'get').mockResolvedValue({
      data: { data: locations },
    });

    const result = await locationService.getMultiple();

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/locations');
    expect(result).toEqual({ data: locations });
  });

  it('builds filtered query for getMultiple', async () => {
    vi.spyOn(mockAxiosInstance, 'get').mockResolvedValue({
      data: { data: [] },
    });

    await locationService.getMultiple({
      filters: {
        address_text: 'Brighton',
        additional_info: 'Studio',
      },
    });

    expect(mockAxiosInstance.get).toHaveBeenCalledWith(
      '/locations?filter[address_text]=Brighton&filter[additional_info]=Studio',
    );
  });
});
