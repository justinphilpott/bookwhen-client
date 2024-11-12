import { describe, it, expect } from 'vitest';
import { createBookwhenClient } from './index.js';

describe('index.ts', () => {
    it('should export BookwhenClient', () => {
        expect(createBookwhenClient).toBeDefined();
    });
});
