"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.validateQuery = exports.validateBody = void 0;
const errorHandler_1 = require("./errorHandler");
const validateBody = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });
        if (error) {
            const messages = error.details.map(detail => detail.message).join(', ');
            next(new errorHandler_1.AppError(messages, 400));
            return;
        }
        req.body = value;
        next();
    };
};
exports.validateBody = validateBody;
const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.query, {
            abortEarly: false,
            stripUnknown: true
        });
        if (error) {
            const messages = error.details.map(detail => detail.message).join(', ');
            next(new errorHandler_1.AppError(messages, 400));
            return;
        }
        req.query = value;
        next();
    };
};
exports.validateQuery = validateQuery;
const validateParams = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.params, {
            abortEarly: false,
            stripUnknown: true
        });
        if (error) {
            const messages = error.details.map(detail => detail.message).join(', ');
            next(new errorHandler_1.AppError(messages, 400));
            return;
        }
        req.params = value;
        next();
    };
};
exports.validateParams = validateParams;
//# sourceMappingURL=validation.js.map