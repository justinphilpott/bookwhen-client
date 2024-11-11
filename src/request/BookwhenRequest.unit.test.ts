import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BookwhenRequest } from './BookwhenRequest.js';
import type { Resources, Filters } from "../types/GlobalTypes.js";


describe('BookwhenRequest', () => {
const testpath = "path";

  describe('path handling', () => {
    it('should return a /"path" when called with "path"', () => {
      const request = new BookwhenRequest(testpath);
      expect(request.toString()).toBe('/'+testpath);
    });
    it('should throw an error if the path is empty', () => {
      expect(() => new BookwhenRequest('')).toThrow('Path is required');
    });
    it('should throw an error if the path is undefined', () => {
      expect(() => new BookwhenRequest(undefined as unknown as string)).toThrow('Path is required');
    });
  });

  describe('addIncludes', () => {
    it('should return the given path with an empty string when no resources are provided', () => {
      const resources: string[] = [];
      const query = new BookwhenRequest(testpath);
      query.addIncludes(resources);
      expect(query.toString()).toEqual('/'+testpath);
    });

    it('should return a query string with a single resource', () => {
      const resources: string[] = ['resource1'];
      const query = new BookwhenRequest(testpath);
      query.addIncludes(resources);
      expect(query.toString()).toEqual('/'+testpath+'?include=resource1');
    });

    it('should return a query string with multiple resources separated by commas', () => {
      const resources: string[] = ['resource1', 'resource2', 'resource3'];
      const query = new BookwhenRequest(testpath);
      query.addIncludes(resources);
      expect(query.toString()).toEqual('/'+testpath+'?include=resource1,resource2,resource3');
    });
  });

  describe('addFilters', () => {
    it('should return a query with no filters, if an empty filters array is given', () => {
      const filters: Filters = {};
      const query = new BookwhenRequest(testpath);
      query.addFilters(filters);
      expect(query.toString()).toEqual('/'+testpath);
    });

    it('should return a query string with a single filter', () => {
      const filters: Filters = { 'key': "value" };
      const query = new BookwhenRequest(testpath);
      query.addFilters(filters);
      expect(query.toString()).toEqual('/'+testpath+'?filter[key]=value');
    });

    it('should return a query string with a single filter and multiple values', () => {
      const filters: Filters = { 'key': ['value one', 'value two'] };
      const query = new BookwhenRequest(testpath);
      query.addFilters(filters);
      expect(query.toString()).toEqual('/'+testpath+'?filter[key]=value%20one,value%20two');
    });

    it('should return a query string with multiple filters where values are strings', () => {
      const filters: Filters = { 
        title: 'advanced',
        detail: 'masterclass',
      }
      const query = new BookwhenRequest(testpath);
      query.addFilters(filters);
      expect(query.toString()).toEqual('/'+testpath+'?filter[title]=advanced&filter[detail]=masterclass');
    });

    it('should return a query string with multiple filters where values are arrays of strings', () => {
      const filters: Filters = { 
        title: ['title1', 'title2'],
        detail: ['detail1', 'detail2', 'detail3'],
      }
      const query = new BookwhenRequest(testpath);
      query.addFilters(filters);
      expect(query.toString()).toEqual('/'+testpath+'?filter[title]=title1,title2&filter[detail]=detail1,detail2,detail3');
    });

    it('should ignore empty string filter values', () => {
      const filters: Filters = { key: '', key2: 'value' }
      const query = new BookwhenRequest(testpath);
      query.addFilters(filters);
      expect(query.toString()).toEqual('/'+testpath+'?filter[key2]=value');
    });

    it('should ignore undefined filter values', () => {
      const filters: Filters = { key: undefined as any, key2: 'value' }
      const query = new BookwhenRequest(testpath);
      query.addFilters(filters);
      expect(query.toString()).toEqual('/'+testpath+'?filter[key2]=value');
    });

    it('should ignore null filter values', () => {
      const filters: Filters = { key: null as any, key2: 'value' }
      const query = new BookwhenRequest(testpath);
      query.addFilters(filters);
      expect(query.toString()).toEqual('/'+testpath+'?filter[key2]=value');
    });

    it('should ignore an "empty array" filter value', () => {
      const filters: Filters = { key: [] }
      const query = new BookwhenRequest(testpath);
      query.addFilters(filters);
      expect(query.toString()).toEqual('/'+testpath);
    });

    it('should ignore empty string elements, where a filter value is an array', () => {
      const filters: Filters = { key: ['', 'value'] }
      const query = new BookwhenRequest(testpath);
      expect(query.toString()).toEqual('/'+testpath);    
    });

    it('should ignore undefined array elements, where a filter value is an array', () => {
      const filters: Filters = { key: [undefined as any, 'value'], key2: 'value2' }
      const query = new BookwhenRequest(testpath);
      query.addFilters(filters);
      expect(query.toString()).toEqual('/'+testpath+'?filter[key]=value&filter[key2]=value2');
    });

    it('should ignore null array elements, where a filter value is an array', () => {
      const filters: Filters = { key: [null as any, 'value'], key2: 'value2' }
      const query = new BookwhenRequest(testpath);
      query.addFilters(filters);
      expect(query.toString()).toEqual('/'+testpath+'?filter[key]=value&filter[key2]=value2');
    });

    it('should return a query string with a single filter when value is an array with a single value', () => {
      const filters: Filters = { key: ['value'] }
      const query = new BookwhenRequest(testpath);
      query.addFilters(filters);
      expect(query.toString()).toEqual('/'+testpath+'?filter[key]=value');
    });

    it('should build a URL query string from the provided parameters, skipping invalid value types', () => {
      const params = {
        key1: 'value1',
        key2: ['value2', null, 'value3', ''],
        key3: undefined as any,
        key4: ['key3skipped', undefined, '123'],
        key5: "1234",
        key6: null,
        key7: undefined,
        key8: [],
        key9: 'undefined',
      };
  
      const expectedFilterString = '/path?filter[key1]=value1&filter[key2]=value2,value3&filter[key4]=key3skipped,123&filter[key5]=1234&filter[key9]=undefined';
      const query = new BookwhenRequest(testpath);
      // @ts-ignore
      query.addFilters(params);
  
      expect(query.toString()).toEqual(expectedFilterString);
    });
  });
});
