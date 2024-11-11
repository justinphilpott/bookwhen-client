import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { createBookwhenClient } from './BookwhenClient.js';
import { BookwhenClient } from './BookwhenClient.js';
import { EventService } from '../services/event/Event.js';

vi.mock('axios');
vi.mock('../src/services/event/Event');

describe('BookwhenClient', () => {
  it('should throw an error if axiosInstance is not provided', () => {
    expect(() => new BookwhenClient(undefined as any)).toThrowError(
      'BookwhenClient - you must provide an axios instance'
    );
  });

  it('should assign axiosInstance correctly', () => {
    const mockAxiosInstance = {} as AxiosInstance;
    const client = new BookwhenClient(mockAxiosInstance);

    expect(client['axiosInstance']).toBe(mockAxiosInstance);
  });

  it('should expose EventService via getter', () => {
    const mockAxiosInstance = {} as AxiosInstance;
    const client = new BookwhenClient(mockAxiosInstance);

    const eventService = client.events;

    expect(eventService['axiosInstance']).toBe(mockAxiosInstance);
    expect(eventService).toBeInstanceOf(EventService);
  });

  it('should share axiosInstance with EventService', () => {
    const mockAxiosInstance = {} as AxiosInstance;
    const client = new BookwhenClient(mockAxiosInstance);

    const eventService = client.events;

    expect(eventService['axiosInstance']).toBe(mockAxiosInstance);
  });
});

describe('createBookwhenClient', () => {
  let mockAxiosInstance: AxiosInstance;

  beforeEach(() => {
    // Create mock axios instance with interceptors
    mockAxiosInstance = {
      interceptors: {
        response: {
          use: vi.fn()
        },
        request: {
          use: vi.fn()
        }
      }
    } as unknown as AxiosInstance;

    // Mock axios.create to return our mock instance
    vi.spyOn(axios, 'create').mockReturnValue(mockAxiosInstance);
  });

  it('should create an axiosInstance with correct config and return a BookwhenClient', () => {
    const apiKey = 'test-api-key';

    const client = createBookwhenClient({ apiKey });

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://api.bookwhen.com/v2',
      auth: { username: apiKey, password: '' },
    });
    expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    expect(client).toBeInstanceOf(BookwhenClient);
  });

  it('should handle errors using the interceptor', async () => {
    const axiosInstance = axios.create();
    const errorResponse = { response: { status: 400 } };

    vi.spyOn(axios, 'create').mockReturnValue(axiosInstance);

    // Mock the interceptor
    const interceptor = vi.fn();
    axiosInstance.interceptors.response.use = interceptor;

    createBookwhenClient({ apiKey: 'test-api-key' });

    const [, errorHandler] = interceptor.mock.calls[0] as [unknown, (error: any) => Promise<never>];

    await expect(errorHandler(errorResponse)).rejects.toThrowError('BookwhenClient: Bad request');
  });
});