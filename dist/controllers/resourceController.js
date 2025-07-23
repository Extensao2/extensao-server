"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceController = void 0;
const Resource_1 = require("@/models/Resource");
const errorHandler_1 = require("@/middleware/errorHandler");
class ResourceController {
    static async createResource(req, res, next) {
        try {
            const { title, content } = req.body;
            const userId = req.user.id;
            const resource = new Resource_1.ResourceModel({
                title,
                content,
                createdBy: userId
            });
            await resource.save();
            res.status(201).json({
                id: resource.id
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getResource(req, res, next) {
        try {
            const { resource_id } = req.params;
            const resource = await Resource_1.ResourceModel.findById(resource_id);
            if (!resource) {
                next(new errorHandler_1.AppError('Recurso não encontrado', 404));
                return;
            }
            res.status(200).json({
                id: resource.id,
                title: resource.title,
                content: resource.content
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateResource(req, res, next) {
        try {
            const { resource_id } = req.params;
            const updates = req.body;
            const resource = await Resource_1.ResourceModel.findById(resource_id);
            if (!resource) {
                next(new errorHandler_1.AppError('Recurso não encontrado', 404));
                return;
            }
            Object.assign(resource, updates);
            await resource.save();
            res.status(200).json({
                id: resource.id
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteResource(req, res, next) {
        try {
            const { resource_id } = req.params;
            const resource = await Resource_1.ResourceModel.findById(resource_id);
            if (!resource) {
                next(new errorHandler_1.AppError('Recurso não encontrado', 404));
                return;
            }
            await Resource_1.ResourceModel.findByIdAndDelete(resource_id);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
    static async searchResources(req, res, next) {
        try {
            const { title, page = 0, size = 10 } = req.query;
            const filter = {};
            if (title) {
                filter.$text = { $search: title };
            }
            const skip = page * size;
            const limit = size;
            const [resources, totalItems] = await Promise.all([
                Resource_1.ResourceModel
                    .find(filter, { title: 1 })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                Resource_1.ResourceModel.countDocuments(filter)
            ]);
            const totalPages = Math.ceil(totalItems / size);
            const response = {
                items: resources.map(resource => ({
                    id: resource._id,
                    title: resource.title
                })),
                page,
                size,
                totalItems,
                totalPages
            };
            res.status(200).json(response);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ResourceController = ResourceController;
//# sourceMappingURL=resourceController.js.map