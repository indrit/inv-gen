import { Router } from 'express';
import { CMSService } from '../services/cms.service';

const router = Router();

// CMS: Content by slug
router.get('/content/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const content = await CMSService.getContentBySlug(slug);
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    next(error);
  }
});

// CMS: All content
router.get('/content', async (req, res, next) => {
  try {
    const content = await CMSService.getAllContent();
    res.json(content);
  } catch (error) {
    next(error);
  }
});

// CMS: Create content
router.post('/content', async (req, res, next) => {
  try {
    const content = await CMSService.createContent(req.body);
    res.status(201).json(content);
  } catch (error) {
    next(error);
  }
});

export default router;
