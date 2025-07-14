import Joi from 'joi';

export const loginSchema = Joi.object({
  token: Joi.string().required().messages({
    'string.empty': 'Token é obrigatório',
    'any.required': 'Token é obrigatório'
  })
});

export const resourceCreateSchema = Joi.object({
  title: Joi.string().max(200).required().messages({
    'string.empty': 'Título é obrigatório',
    'string.max': 'Título deve ter no máximo 200 caracteres',
    'any.required': 'Título é obrigatório'
  }),
  content: Joi.string().required().messages({
    'string.empty': 'Conteúdo é obrigatório',
    'any.required': 'Conteúdo é obrigatório'
  })
});

export const resourceUpdateSchema = Joi.object({
  title: Joi.string().max(200).optional(),
  content: Joi.string().optional()
}).or('title', 'content').messages({
  'object.missing': 'Pelo menos um campo (title ou content) deve ser fornecido'
});

export const searchSchema = Joi.object({
  title: Joi.string().optional(),
  page: Joi.number().integer().min(0).default(0),
  size: Joi.number().integer().min(1).max(100).default(10)
});

export const uuidSchema = Joi.string().uuid().required().messages({
  'string.empty': 'ID é obrigatório',
  'string.uuid': 'ID deve ser um UUID válido',
  'any.required': 'ID é obrigatório'
});