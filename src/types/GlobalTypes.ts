// src/types/BookwhenTypes.ts
export interface HttpStatus {
  code: number;
  message: string;
}

export type Resource = string;
export type Resources = Resource[]

export interface Filters {
  [key: string]: string | string[] | boolean;
}