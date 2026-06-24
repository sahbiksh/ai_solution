const express = require('express');
const {
  createInquiry,
  getInquiries,
  getInquiry,
  updateInquiry,
  deleteInquiry,
  getStatistics,
  exportCSV,
  exportPDF,
} = require('../controllers/inquiryController');
const { inquiryValidation } = require('../validators/inquiryValidator');
const validate = require('../middleware/validate');
const { protect, requireAdmin } = require('../middleware/auth');
const { inquiryLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/', inquiryLimiter, inquiryValidation, validate, createInquiry);

router.use(protect, requireAdmin);
router.get('/statistics', getStatistics);
router.get('/export/csv', exportCSV);
router.get('/export/pdf', exportPDF);
router.get('/', getInquiries);
router.get('/:id', getInquiry);
router.put('/:id', updateInquiry);
router.delete('/:id', deleteInquiry);

module.exports = router;
