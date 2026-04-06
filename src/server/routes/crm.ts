import { Router } from 'express';
import { CRMService } from '../services/crm.service';

const router = Router();

// CRM: Contacts
router.get('/contacts', async (req, res, next) => {
  try {
    const contacts = await CRMService.getContacts();
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

router.post('/contacts', async (req, res, next) => {
  try {
    const contact = await CRMService.createContact(req.body);
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
});

// CRM: Leads
router.get('/leads', async (req, res, next) => {
  try {
    const leads = await CRMService.getLeads();
    res.json(leads);
  } catch (error) {
    next(error);
  }
});

router.post('/leads', async (req, res, next) => {
  try {
    const lead = await CRMService.createLead(req.body);
    res.status(201).json(lead);
  } catch (error) {
    next(error);
  }
});

export default router;
