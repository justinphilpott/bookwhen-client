// src/index.ts (simplified for ESM-only)
export * from './types/GlobalTypes.js';
export * from './services/event/EventInterfaces.js';
export * from './services/ticket/TicketInterfaces.js';
export { createBookwhenClient } from './client/BookwhenClient.js';
export {
  resolveJsonApiRelationships,
  resolveJsonApiResource,
} from './utils/json-api-resolver.js';
