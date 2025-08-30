import { Router } from 'express';
import { improveText, aiChanges } from '../controllers/textController.js';
import { generateWebsite } from '../controllers/websiteController.js';

const router = Router();

router.post('/improve-text', improveText);
router.post('/generate-website', generateWebsite);
router.post('/ai-changes', aiChanges);

export default router;
