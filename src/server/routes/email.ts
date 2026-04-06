import { Router } from 'express';
import { EmailService } from '../services/email.service';

const router = Router();

// Email: Campaigns
router.get('/campaigns', async (req, res, next) => {
  try {
    const campaigns = await EmailService.getCampaigns();
    res.json(campaigns);
  } catch (error) {
    next(error);
  }
});

router.post('/campaigns', async (req, res, next) => {
  try {
    const campaign = await EmailService.createCampaign(req.body);
    res.status(201).json(campaign);
  } catch (error) {
    next(error);
  }
});

// Email: Subscribers
router.get('/subscribers', async (req, res, next) => {
  try {
    const subscribers = await EmailService.getSubscribers();
    res.json(subscribers);
  } catch (error) {
    next(error);
  }
});

router.post('/subscribers', async (req, res, next) => {
  try {
    const subscriber = await EmailService.createSubscriber(req.body);
    res.status(201).json(subscriber);
  } catch (error) {
    next(error);
  }
});

export default router;
