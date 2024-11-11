import { describe, it, expect } from 'vitest';
import * as dotenv from 'dotenv';
import { createBookwhenClient } from './index.js';

dotenv.config();

describe('index.ts', () => {
    it('should load environment variables', () => {
        expect(process.env).toHaveProperty('NODE_ENV');
    });

    it('should export BookwhenClient', () => {
        expect(createBookwhenClient).toBeDefined();
    });
});
