/**
 * Generic JSON:API relationship resolver utility
 * 
 * This utility resolves relationships between data and included arrays in JSON:API responses.
 * It matches resources by both id and type to ensure correct resolution.
 */

/**
 * Resolves relationships in a JSON:API response by matching data references with included resources.
 * 
 * @param data - The main data array from the JSON:API response
 * @param included - The included resources array from the JSON:API response
 * @returns A new array with resolved relationships
 */
export function resolveJsonApiRelationships<T extends { relationships?: Record<string, any> }>(
  data: T[],
  included: any[]
): T[] {
  return data.map(item => {
    const resolved = { ...item };
    
    // For each relationship in the item
    Object.keys(resolved.relationships || {}).forEach(relationKey => {
      const relation = resolved.relationships![relationKey];
      
      if (relation.data) {
        // Handle single relationship
        if (relation.data.id && relation.data.type) {
          const resolvedData = included.find(
            inc => inc.id === relation.data.id && inc.type === relation.data.type
          );
          if (resolvedData) {
            resolved.relationships![relationKey].data = resolvedData;
          }
        }
        // Handle array of relationships (for tickets, etc.)
        else if (Array.isArray(relation.data)) {
          resolved.relationships![relationKey].data = relation.data.map((ref: any) => {
            const resolvedItem = included.find(
              inc => inc.id === ref.id && inc.type === ref.type
            );
            return resolvedItem || ref;
          });
        }
      }
    });
    
    return resolved;
  });
}

/**
 * Resolves a single JSON:API resource with its relationships
 * 
 * @param data - The main data object from the JSON:API response
 * @param included - The included resources array from the JSON:API response
 * @returns A new object with resolved relationships
 */
export function resolveJsonApiResource<T extends { relationships?: Record<string, any> }>(
  data: T,
  included: any[]
): T {
  const resolved = { ...data };
  
  // For each relationship in the item
  Object.keys(resolved.relationships || {}).forEach(relationKey => {
    const relation = resolved.relationships![relationKey];
    
    if (relation.data) {
      // Handle single relationship
      if (relation.data.id && relation.data.type) {
        const resolvedData = included.find(
          inc => inc.id === relation.data.id && inc.type === relation.data.type
        );
        if (resolvedData) {
          resolved.relationships![relationKey].data = resolvedData;
        }
      }
      // Handle array of relationships (for tickets, etc.)
      else if (Array.isArray(relation.data)) {
        resolved.relationships![relationKey].data = relation.data.map((ref: any) => {
          const resolvedItem = included.find(
            inc => inc.id === ref.id && inc.type === ref.type
          );
          return resolvedItem || ref;
        });
      }
    }
  });
  
  return resolved;
}
