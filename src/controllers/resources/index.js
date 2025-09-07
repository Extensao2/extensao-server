import * as createResource from './create.js';
import * as getResourceById from './get-by-id.js';
import * as updateResource from './update.js';
import * as deleteResource from './delete.js';
import * as searchResources from './search.js';

export const resourceController = {
  ...createResource,
  ...getResourceById,
  ...updateResource,
  ...deleteResource,
  ...searchResources
};
