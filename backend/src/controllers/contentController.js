const Testimonial = require('../models/Testimonial');
const BlogArticle = require('../models/BlogArticle');
const Event = require('../models/Event');
const GalleryImage = require('../models/GalleryImage');

const createCRUD = (Model, options = {}) => ({
  getAll: async (req, res) => {
    try {
      const filter = options.publicFilter ? { isPublished: true } : {};
      const items = await Model.find(filter).sort(options.sort || '-createdAt');
      res.status(200).json({ success: true, data: items });
    } catch (error) {
      res.status(500).json({ success: false, message: `Failed to fetch ${options.name}` });
    }
  },

  getOne: async (req, res) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ success: false, message: `${options.name} not found` });
      }
      res.status(200).json({ success: true, data: item });
    } catch (error) {
      res.status(500).json({ success: false, message: `Failed to fetch ${options.name}` });
    }
  },

  create: async (req, res) => {
    try {
      const item = await Model.create(req.body);
      res.status(201).json({ success: true, data: item });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!item) {
        return res.status(404).json({ success: false, message: `${options.name} not found` });
      }
      res.status(200).json({ success: true, data: item });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) {
        return res.status(404).json({ success: false, message: `${options.name} not found` });
      }
      res.status(200).json({ success: true, message: `${options.name} deleted` });
    } catch (error) {
      res.status(500).json({ success: false, message: `Failed to delete ${options.name}` });
    }
  },
});

const testimonialCRUD = createCRUD(Testimonial, { name: 'Testimonial', publicFilter: true });
const blogCRUD = createCRUD(BlogArticle, { name: 'Article', publicFilter: true, sort: '-publishedAt' });
const eventCRUD = createCRUD(Event, { name: 'Event', publicFilter: true, sort: 'eventDate' });
const galleryCRUD = createCRUD(GalleryImage, { name: 'Gallery image', publicFilter: true, sort: 'sortOrder' });

const adminTestimonialCRUD = createCRUD(Testimonial, { name: 'Testimonial', sort: '-createdAt' });
const adminBlogCRUD = createCRUD(BlogArticle, { name: 'Article', sort: '-publishedAt' });
const adminEventCRUD = createCRUD(Event, { name: 'Event', sort: 'eventDate' });
const adminGalleryCRUD = createCRUD(GalleryImage, { name: 'Gallery image', sort: 'sortOrder' });

exports.getTestimonials = testimonialCRUD.getAll;
exports.getAllTestimonialsAdmin = adminTestimonialCRUD.getAll;
exports.getTestimonial = testimonialCRUD.getOne;
exports.createTestimonial = testimonialCRUD.create;
exports.updateTestimonial = testimonialCRUD.update;
exports.deleteTestimonial = testimonialCRUD.delete;

exports.submitTestimonialFeedback = async (req, res) => {
  try {
    const { customerName, company, role, content, rating } = req.body;

    if (!customerName?.trim() || !content?.trim() || rating == null) {
      return res.status(400).json({
        success: false,
        message: 'Name, feedback, and rating are required',
      });
    }

    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    const testimonial = await Testimonial.create({
      customerName: customerName.trim(),
      company: company?.trim() || '',
      role: role?.trim() || '',
      content: content.trim(),
      rating: numericRating,
      isPublished: true,
      featured: false,
    });

    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getArticles = blogCRUD.getAll;
exports.getAllArticlesAdmin = adminBlogCRUD.getAll;
exports.getArticle = async (req, res) => {
  try {
    const article = await BlogArticle.findOne({
      $or: [{ slug: req.params.slug }, { _id: req.params.slug }],
      isPublished: true,
    });
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    article.views += 1;
    await article.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch article' });
  }
};
exports.createArticle = async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.slug && data.title) {
      data.slug = data.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    const item = await BlogArticle.create(data);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
exports.updateArticle = blogCRUD.update;
exports.deleteArticle = blogCRUD.delete;

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({
      isPublished: true,
      eventDate: { $gte: new Date() },
    }).sort('eventDate');
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch events' });
  }
};
exports.getAllEvents = adminEventCRUD.getAll;
exports.getEvent = eventCRUD.getOne;
exports.createEvent = eventCRUD.create;
exports.updateEvent = eventCRUD.update;
exports.deleteEvent = eventCRUD.delete;

exports.getGallery = galleryCRUD.getAll;
exports.getAllGalleryAdmin = adminGalleryCRUD.getAll;
exports.getGalleryImage = galleryCRUD.getOne;
exports.createGalleryImage = galleryCRUD.create;
exports.updateGalleryImage = galleryCRUD.update;
exports.deleteGalleryImage = galleryCRUD.delete;

exports.getPortfolio = async (req, res) => {
  try {
    const portfolio = [
      {
        id: 1,
        title: 'Digital Employee Experience Platform',
        client: 'North East Manufacturing Ltd',
        category: 'Software Development',
        description: 'Built an AI-powered employee portal reducing HR query resolution time by 60%.',
        technologies: ['React', 'Node.js', 'OpenAI API', 'MongoDB'],
        image: '/images/portfolio/project1.jpg',
        results: ['60% faster query resolution', '85% employee satisfaction', '£200K annual savings'],
      },
      {
        id: 2,
        title: 'AI Virtual Assistant for Healthcare',
        client: 'Sunderland Health Trust',
        category: 'Virtual Assistant',
        description: 'Deployed an intelligent chatbot handling patient appointment scheduling and FAQs.',
        technologies: ['Python', 'NLP', 'React', 'AWS'],
        image: '/images/portfolio/project2.jpg',
        results: ['40% reduction in call volume', '24/7 patient support', '95% accuracy rate'],
      },
      {
        id: 3,
        title: 'Rapid AI Prototyping Suite',
        client: 'TechStart Innovations',
        category: 'AI Prototyping',
        description: 'Delivered a proof-of-concept AI recommendation engine within 3 weeks.',
        technologies: ['TensorFlow', 'FastAPI', 'React', 'Docker'],
        image: '/images/portfolio/project3.jpg',
        results: ['3-week delivery', 'Secured £500K funding', '90% prototype accuracy'],
      },
      {
        id: 4,
        title: 'Smart Document Processing',
        client: 'Legal Partners UK',
        category: 'Software Development',
        description: 'Automated contract review and classification using machine learning.',
        technologies: ['Python', 'spaCy', 'Node.js', 'PostgreSQL'],
        image: '/images/portfolio/project4.jpg',
        results: ['75% time savings', '99.2% classification accuracy', 'ROI in 4 months'],
      },
    ];
    res.status(200).json({ success: true, data: portfolio });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch portfolio' });
  }
};

exports.chatbot = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const lowerMsg = message.toLowerCase().trim();
    const chatbotResponses = {
      hi: 'Hello! Welcome to AI-Solutions. How can I help you today?',
      hello: 'Hi there! How may I assist you?',
      hey: 'Hey! Welcome to AI-Solutions. What can I do for you?',
      'how are you': "I'm doing great, thank you for asking! How can I assist you today?",
      'how are u': "I'm doing great! How can I help you today?",
      'hwo are you': "I'm doing great! Thanks for asking. How may I assist you?",
      'who are you': 'I am the AI-Solutions Virtual Assistant.',
      'what is your name': 'I am the AI-Solutions Virtual Assistant.',
      'thank you': "You're welcome! Happy to help.",
      thanks: "You're welcome!",
      bye: 'Goodbye! Have a wonderful day.',
      goodbye: 'Goodbye! Feel free to come back anytime.',
      'can you help me': 'Of course! Please tell me what you need help with.',
      'what services do you provide':
        'AI-Solutions provides AI-powered software solutions and prototyping services.',
    };
    let response;

    if (chatbotResponses[lowerMsg]) {
      response = chatbotResponses[lowerMsg];
    } else if (lowerMsg.includes('service') || lowerMsg.includes('offer')) {
      response = 'AI-Solutions offers three core services: AI-powered Virtual Assistants, affordable AI-based Prototyping, and innovative Software Development. Visit our Services page for details!';
    } else if (lowerMsg.includes('contact') || lowerMsg.includes('reach')) {
      response = 'You can reach us via our Contact Us page, email us at info@ai-solutions.co.uk, or call +44 191 555 0100. We are based in Sunderland, UK.';
    } else if (lowerMsg.includes('price') || lowerMsg.includes('cost')) {
      response = 'Our pricing is tailored to each project. Submit an inquiry through our Contact form and our team will provide a customized quote within 2 business days.';
    } else if (lowerMsg.includes('location') || lowerMsg.includes('where')) {
      response = 'AI-Solutions is headquartered in Sunderland, United Kingdom. We serve clients globally with remote and on-site delivery options.';
    } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      response = 'Hello! Welcome to AI-Solutions. I am your AI assistant. How can I help you today? Ask me about our services, portfolio, or how to get in touch.';
    } else {
      response = 'Thank you for your question! For detailed information, please visit our website pages or submit an inquiry via the Contact Us form. Our team will respond within 2 business days.';
    }

    res.status(200).json({
      success: true,
      data: {
        message: response,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Chatbot error' });
  }
};
