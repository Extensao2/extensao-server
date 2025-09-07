import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import Resource from '../models/Resource.js';
import { requireAuth } from '../middleware/auth.js';
 
 const router = express.Router();
 
 // Create resource (PUT /resource)
 router.put('/resource', requireAuth, [
   body('title').notEmpty().withMessage('Title is required'),
   body('content').notEmpty().withMessage('Content is required')
 ], async (req, res) => {
   try {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }
 
     const { title, content } = req.body;
 
     const resource = new Resource({ 
       title, 
       content,
      createdBy: req.user._id
     });
     await resource.save();
 
     res.status(201).json({ id: resource.id });
   } catch (error) {
     console.error('Create resource error:', error);
     res.status(500).json({ error: 'Internal server error' });
   }
 });