import { createResource } from './create.js';
import { getResourceById } from './get-by-id.js';
import { updateResource } from './update.js';
import { deleteResource } from './delete.js';
import { searchResources } from './search.js';

export { createResource, getResourceById, updateResource, deleteResource, searchResources };

export const resourceController = {
  createResource,
  getResourceById,
  updateResource,
  deleteResource,
  searchResources
};