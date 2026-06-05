import { Router } from 'express';
import { settingsShow } from '../controllers/adminController';

export const settingsRoutes = Router();

settingsRoutes.get('/settings', settingsShow);
