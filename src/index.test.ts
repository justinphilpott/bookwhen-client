import { describe, it, expect } from 'vitest';
import { 
  createBookwhenClient, 
  resolveJsonApiRelationships, 
  resolveJsonApiResource 
} from './index.js';

describe('index.ts', () => {
  it('should export BookwhenClient', () => {
    expect(createBookwhenClient).toBeDefined();
  });

  it('should export resolveJsonApiRelationships utility', () => {
    expect(resolveJsonApiRelationships).toBeDefined();
  });

  it('should export resolveJsonApiResource utility', () => {
    expect(resolveJsonApiResource).toBeDefined();
  });
});
