import type { Resources, Filters } from '../types/GlobalTypes.js';

/**
 * QueryBuilder class to help build query strings for Bookwhen API requests.
 */
export class BookwhenRequest {
  private path: string = '';
  private filters: string[] = [];
  private includes: string[] = [];

  constructor(path: string) {
    try {
      if (!path) {
        throw new Error('Path is required');
      }
      this.path = path;
    } catch (error) {
      throw new Error('BookwhenQuery error: ' + (error as Error).message);
    }
  }

  /**
   * Adds filters to the BookwhenQuery object.
   * @param filters - An array of key-value pairs representing the filters to be added.
   *
   * Example resultant query strings:
   * /v2/events?filter[from]=20200401&filter[to]=20200404
   * /v2/events?filter[tag]=tag%20one,tag%20two
   * /v2/events?filter[title]=advanced,pro&filter[detail]=masterclass
   *
   * @see https://petstore.swagger.io/?url=https://api.bookwhen.com/v2/openapi.yaml
   *
   * @returns The updated BookwhenQuery object.
   */
  public addFilters(filters: Filters): BookwhenRequest {
    // @todo add zod validation for filters?
    try {
      for (let key in filters) {
        let value = filters[key];
        if (Array.isArray(value) && value && value.length > 0) {
          const encodedValues = value
            .filter((v: string) => typeof v === 'string' && v.length > 0)
            .map((v: string) => encodeURIComponent(v))
            .join(',');

          this.filters.push(
            `filter[${encodeURIComponent(key)}]=${encodedValues}`,
          );
        } else if (typeof value === 'string' && value !== '') {
          if (key.length === 0) {
            throw new Error('Invalid filter key' + key);
          }
          this.filters.push(
            `filter[${encodeURIComponent(key)}]=${encodeURIComponent(value)}`,
          );
        } else if (typeof value === 'undefined' && value !== '') {
          // ignore undefined values
        }
      }
    } catch (error) {
      throw new Error('BookwhenQuery error: ' + (error as Error).message);
    }
    return this;
  }

  /**
   * Adds an include query parameter to the BookwhenRequest object.
   * @param includes - An array of strings representing the resources to include.
   *
   * @returns The updated BookwhenRequest object.
   *
   * @throws Error if any include is not a valid string.
   */
  public addIncludes(includes: Resources): BookwhenRequest {
    try {
      const validIncludes = includes.filter(
        (include: string) => include.length > 0,
      );
      if (validIncludes.length !== includes.length) {
        throw new Error('Invalid includes');
      }
      if (validIncludes.length > 0) {
        const includeQuery = validIncludes.join(',');
        this.includes.push(`include=${includeQuery}`);
      }
    } catch (error) {
      throw new Error('BookwhenQuery error: ' + (error as Error).message);
    }
    return this;
  }

  /**
   * Does the actual work of putting together a valid query string given:
   * - filters
   * - includes
   * - segments
   *
   * @returns
   */
  build(): string {
    let queryString = '';

    // Concatenate filters and includes, if any
    if (this.filters.length > 0) {
      queryString += this.filters.join('&');
    }
    if (this.includes.length > 0) {
      // Add '&' if filters already added to queryString
      queryString += queryString ? '&' : '';
      queryString += this.includes.join('&');
    }

    // Strip any leading slashes from this.path
    const cleanedPath = this.path.replace(/^\/+/, '');

    // Return the full URI, including query string only if it's non-empty
    return `/${cleanedPath}${queryString ? '?' + queryString : ''}`;
  }

  /**
   * @returns the constructed query string
   */
  toString(): string {
    return this.build();
  }
}
