require('dotenv').config();
const mongoose = require('mongoose');
const AdminUser = require('../models/AdminUser');
const Testimonial = require('../models/Testimonial');
const BlogArticle = require('../models/BlogArticle');
const Event = require('../models/Event');
const GalleryImage = require('../models/GalleryImage');
const Inquiry = require('../models/Inquiry');
const connectDB = require('../config/db');

const seedData = async () => {
  try {
    await connectDB();

    await Promise.all([
      AdminUser.deleteMany(),
      Testimonial.deleteMany(),
      BlogArticle.deleteMany(),
      Event.deleteMany(),
      GalleryImage.deleteMany(),
      Inquiry.deleteMany(),
    ]);

    const admin = await AdminUser.create({
      name: 'System Administrator',
      email: process.env.ADMIN_EMAIL || 'admin@ai-solutions.co.uk',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      role: 'super_admin',
    });

    const testimonials = await Testimonial.insertMany([
      {
        customerName: 'Sarah Mitchell',
        company: 'North East Manufacturing',
        role: 'HR Director',
        content: 'AI-Solutions transformed our employee experience. Their virtual assistant reduced our HR workload dramatically.',
        rating: 5,
        featured: true,
      },
      {
        customerName: 'James O\'Connor',
        company: 'TechStart Innovations',
        role: 'CEO',
        content: 'The rapid prototyping service helped us secure funding. Delivered a working AI prototype in just 3 weeks.',
        rating: 5,
        featured: true,
      },
      {
        customerName: 'Dr. Emily Watson',
        company: 'Sunderland Health Trust',
        role: 'Digital Lead',
        content: 'Outstanding chatbot implementation. Patient satisfaction scores improved significantly.',
        rating: 4,
        featured: false,
      },
    ]);

    const articles = await BlogArticle.insertMany([
      {
        title: 'The Future of AI in Employee Experience',
        slug: 'future-ai-employee-experience',
        excerpt: 'Discover how AI is reshaping the digital workplace and improving employee satisfaction.',
        content: '<p>Artificial Intelligence is revolutionizing how organizations engage with their employees...</p>',
        author: 'AI-Solutions Team',
        category: 'AI Trends',
        tags: ['AI', 'Employee Experience', 'Digital Transformation'],
        readTime: 8,
      },
      {
        title: '5 Steps to Successful AI Prototyping',
        slug: '5-steps-ai-prototyping',
        excerpt: 'Learn the essential steps to validate your AI ideas quickly and cost-effectively.',
        content: '<p>AI prototyping allows businesses to test concepts before full investment...</p>',
        author: 'Dr. Raj Patel',
        category: 'Tutorials',
        tags: ['Prototyping', 'AI', 'Startup'],
        readTime: 6,
      },
      {
        title: 'AI-Solutions Expands Services in Sunderland',
        slug: 'ai-solutions-expands-sunderland',
        excerpt: 'We are excited to announce our expanded office and new service offerings.',
        content: '<p>AI-Solutions continues to grow in the North East region...</p>',
        author: 'Marketing Team',
        category: 'Company News',
        tags: ['Company', 'Sunderland', 'Growth'],
        readTime: 4,
      },
    ]);

    const events = await Event.insertMany([
      {
        title: 'AI in the Workplace Webinar',
        description: 'Join us for an interactive webinar on implementing AI solutions in your organization.',
        location: 'Online - Microsoft Teams',
        eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        eventType: 'Webinar',
        registrationUrl: 'https://ai-solutions.co.uk/events/webinar',
      },
      {
        title: 'Sunderland Tech Meetup 2026',
        description: 'Network with local tech leaders and learn about the latest AI innovations.',
        location: 'The Fire Station, Sunderland',
        eventDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        eventType: 'Meetup',
      },
      {
        title: 'AI Prototyping Workshop',
        description: 'Hands-on workshop to build your first AI prototype in a day.',
        location: 'AI-Solutions HQ, Sunderland',
        eventDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        eventType: 'Workshop',
        maxAttendees: 25,
      },
    ]);

    const gallery = await GalleryImage.insertMany([
      {
        title: 'Team at Sunderland Office',
        description: 'Our talented team at the Sunderland headquarters.',
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
        category: 'Team',
      },
      {
        title: 'AI Conference 2025',
        description: 'Presenting our latest innovations at the North East AI Conference.',
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        category: 'Conferences',
      },
      {
        title: 'Workshop Session',
        description: 'Interactive AI prototyping workshop with local businesses.',
        imageUrl: 'https://images.unsplash.com/photo-1515187024625-6d5c4a5c4b0e?w=800',
        category: 'Workshops',
      },
    ]);

    const inquiries = await Inquiry.insertMany([
      {
        fullName: 'Michael Brown',
        email: 'michael.brown@example.com',
        phone: '+44 7700 900123',
        companyName: 'Brown Industries',
        country: 'United Kingdom',
        jobTitle: 'IT Manager',
        jobDetails: 'We need an AI virtual assistant for our customer support team handling 500+ queries daily.',
        serviceInterest: 'Virtual Assistant',
        status: 'new',
      },
      {
        fullName: 'Anna Kowalski',
        email: 'anna.k@techfirm.pl',
        phone: '+48 501 234 567',
        companyName: 'TechFirm Poland',
        country: 'Poland',
        jobTitle: 'Product Owner',
        jobDetails: 'Looking for rapid AI prototyping for a recommendation engine in our e-commerce platform.',
        serviceInterest: 'AI Prototyping',
        status: 'in_progress',
      },
      {
        fullName: 'David Chen',
        email: 'david.chen@globalcorp.com',
        phone: '+1 555 123 4567',
        companyName: 'GlobalCorp Inc',
        country: 'United States',
        jobTitle: 'CTO',
        jobDetails: 'Enterprise software development project for document processing automation using ML.',
        serviceInterest: 'Software Development',
        status: 'resolved',
      },
    ]);

    console.log('Database seeded successfully!');
    console.log(`Admin: ${admin.email}`);
    console.log(`Testimonials: ${testimonials.length}`);
    console.log(`Articles: ${articles.length}`);
    console.log(`Events: ${events.length}`);
    console.log(`Gallery: ${gallery.length}`);
    console.log(`Inquiries: ${inquiries.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
