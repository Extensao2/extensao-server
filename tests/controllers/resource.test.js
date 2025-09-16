// tests/controllers/resource.test.js
import { resourceController } from '../../src/controllers/resources/index.js';
const { createResource, getResourceById, searchResources, updateResource, deleteResource } = resourceController;

import Resource from '../../src/models/Resource.js';
jest.mock('../../src/models/Resource.js');

const mockRequest = (body = {}, params = {}, query = {}, user = {}) => ({
    body,
    params,
    query,
    user,
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

describe('Resource Controller Unit Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();

        const mockQuery = {
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
        };

        Resource.find = jest.fn().mockReturnValue(mockQuery);
        Resource.findOne = jest.fn();
        Resource.findOneAndUpdate = jest.fn();
        Resource.findOneAndDelete = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // ------------------- createResource -------------------
    describe('createResource', () => {
        it('should create a resource successfully', async () => {
            const req = mockRequest({ title: 'Title', content: 'Content' }, {}, {}, { _id: 'user1' });
            const res = mockResponse();

            const mockSave = jest.fn().mockResolvedValue({ id: 'res1' });
            Resource.mockImplementation(() => ({
                save: mockSave,
                id: 'res1'
            }));

            await createResource(req, res);

            expect(Resource).toHaveBeenCalledWith({
                title: 'Title',
                content: 'Content',
                createdBy: 'user1'
            });
            expect(mockSave).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ id: 'res1' });
        });

        it('should handle save error', async () => {
            const req = mockRequest({ title: 'Title', content: 'Content' }, {}, {}, { _id: 'user1' });
            const res = mockResponse();

            const mockSave = jest.fn().mockRejectedValue(new Error('DB error'));
            Resource.mockImplementation(() => ({ save: mockSave }));

            await createResource(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });
    });

    // ------------------- getResourceById -------------------
    describe('getResourceById', () => {
        it('should return a resource by ID', async () => {
            const req = mockRequest({}, { id: 'res1' });
            const res = mockResponse();

            Resource.findOne.mockResolvedValue({ toJSON: () => ({ id: 'res1', title: 'Title' }) });

            await getResourceById(req, res);

            expect(Resource.findOne).toHaveBeenCalledWith({ id: 'res1' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ id: 'res1', title: 'Title' });
        });

        it('should return 404 if not found', async () => {
            const req = mockRequest({}, { id: 'res1' });
            const res = mockResponse();

            Resource.findOne.mockResolvedValue(null);

            await getResourceById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Resource not found' });
        });

        it('should handle errors', async () => {
            const req = mockRequest({}, { id: 'res1' });
            const res = mockResponse();

            Resource.findOne.mockRejectedValue(new Error('DB error'));

            await getResourceById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });
    });

    // ------------------- searchResources -------------------
        describe('searchResources', () => {
        it('should return all resources matching query', async () => {
            const req = mockRequest({}, {}, { title: 'Test' });
            const res = mockResponse();

            const mockResults = [{ toJSON: () => ({ id: 'res1', title: 'Test' }) }];

            Resource.find.mockImplementation(() => ({
            sort: jest.fn().mockResolvedValue(mockResults)
            }));

            await searchResources(req, res);

            expect(Resource.find).toHaveBeenCalledWith({ title: { $regex: 'Test', $options: 'i' } });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([{ id: 'res1', title: 'Test' }]);
        });

        it('should return all resources if no query', async () => {
            const req = mockRequest();
            const res = mockResponse();

            const mockResults = [{ toJSON: () => ({ id: 'res1', title: 'Title' }) }];

            Resource.find.mockImplementation(() => ({
            sort: jest.fn().mockResolvedValue(mockResults)
            }));

            await searchResources(req, res);

            expect(Resource.find).toHaveBeenCalledWith({});
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([{ id: 'res1', title: 'Title' }]);
        });

        it('should handle errors', async () => {
            const req = mockRequest();
            const res = mockResponse();

            Resource.find.mockImplementation(() => ({
            sort: jest.fn().mockRejectedValue(new Error('DB error'))
            }));

            await searchResources(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });
    });

    // ------------------- updateResource -------------------
    describe('updateResource', () => {
        it('should update resource successfully', async () => {
            const req = mockRequest({ title: 'New Title' }, { id: 'res1' });
            const res = mockResponse();

            Resource.findOneAndUpdate.mockResolvedValue({ id: 'res1' });

            await updateResource(req, res);

            expect(Resource.findOneAndUpdate).toHaveBeenCalledWith(
                { id: 'res1' },
                { title: 'New Title' },
                { new: true, runValidators: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ id: 'res1' });
        });

        it('should return 404 if resource not found', async () => {
            const req = mockRequest({ title: 'New Title' }, { id: 'res1' });
            const res = mockResponse();

            Resource.findOneAndUpdate.mockResolvedValue(null);

            await updateResource(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Resource not found' });
        });

        it('should handle errors', async () => {
            const req = mockRequest({ title: 'New Title' }, { id: 'res1' });
            const res = mockResponse();

            Resource.findOneAndUpdate.mockRejectedValue(new Error('DB error'));

            await updateResource(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });
    });

    // ------------------- deleteResource -------------------
    describe('deleteResource', () => {
        it('should delete resource successfully', async () => {
            const req = mockRequest({}, { id: 'res1' });
            const res = mockResponse();

            Resource.findOneAndDelete.mockResolvedValue({});

            await deleteResource(req, res);

            expect(Resource.findOneAndDelete).toHaveBeenCalledWith({ id: 'res1' });
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        it('should return 404 if not found', async () => {
            const req = mockRequest({}, { id: 'res1' });
            const res = mockResponse();

            Resource.findOneAndDelete.mockResolvedValue(null);

            await deleteResource(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Resource not found' });
        });

        it('should handle errors', async () => {
            const req = mockRequest({}, { id: 'res1' });
            const res = mockResponse();

            Resource.findOneAndDelete.mockRejectedValue(new Error('DB error'));

            await deleteResource(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });
    });

});
