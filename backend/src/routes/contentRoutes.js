const express = require('express');
const {
  getTestimonials,
  submitTestimonialFeedback,
  getAllTestimonialsAdmin,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getArticles,
  getAllArticlesAdmin,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  getEvents,
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getGallery,
  getAllGalleryAdmin,
  getGalleryImage,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  getPortfolio,
  chatbot,
} = require('../controllers/contentController');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/testimonials', getTestimonials);
router.post('/testimonials/feedback', submitTestimonialFeedback);
router.get('/articles', getArticles);
router.get('/articles/:slug', getArticle);
router.get('/events', getEvents);
router.get('/gallery', getGallery);
router.get('/portfolio', getPortfolio);
router.post('/chatbot', chatbot);

router.use(protect, requireAdmin);
router.get('/admin/testimonials', getAllTestimonialsAdmin);
router.post('/testimonials', createTestimonial);
router.put('/testimonials/:id', updateTestimonial);
router.delete('/testimonials/:id', deleteTestimonial);
router.get('/testimonials/:id', getTestimonial);

router.get('/admin/articles', getAllArticlesAdmin);
router.post('/articles', createArticle);
router.put('/articles/:id', updateArticle);
router.delete('/articles/:id', deleteArticle);

router.get('/admin/events', getAllEvents);
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);
router.get('/events/:id', getEvent);

router.get('/admin/gallery', getAllGalleryAdmin);
router.post('/gallery', createGalleryImage);
router.put('/gallery/:id', updateGalleryImage);
router.delete('/gallery/:id', deleteGalleryImage);
router.get('/gallery/:id', getGalleryImage);

module.exports = router;
