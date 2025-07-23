"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuidSchema = exports.searchSchema = exports.resourceUpdateSchema = exports.resourceCreateSchema = exports.loginSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.loginSchema = joi_1.default.object({
    token: joi_1.default.string().required().messages({
        'string.empty': 'Token é obrigatório',
        'any.required': 'Token é obrigatório'
    })
});
exports.resourceCreateSchema = joi_1.default.object({
    title: joi_1.default.string().max(200).required().messages({
        'string.empty': 'Título é obrigatório',
        'string.max': 'Título deve ter no máximo 200 caracteres',
        'any.required': 'Título é obrigatório'
    }),
    content: joi_1.default.string().required().messages({
        'string.empty': 'Conteúdo é obrigatório',
        'any.required': 'Conteúdo é obrigatório'
    })
});
exports.resourceUpdateSchema = joi_1.default.object({
    title: joi_1.default.string().max(200).optional(),
    content: joi_1.default.string().optional()
}).or('title', 'content').messages({
    'object.missing': 'Pelo menos um campo (title ou content) deve ser fornecido'
});
exports.searchSchema = joi_1.default.object({
    title: joi_1.default.string().optional(),
    page: joi_1.default.number().integer().min(0).default(0),
    size: joi_1.default.number().integer().min(1).max(100).default(10)
});
exports.uuidSchema = joi_1.default.string().uuid().required().messages({
    'string.empty': 'ID é obrigatório',
    'string.uuid': 'ID deve ser um UUID válido',
    'any.required': 'ID é obrigatório'
});
//# sourceMappingURL=validation.js.map