const Inquiry = require('../models/Inquiry');
const { sendInquiryNotification, sendConfirmationEmail } = require('../utils/email');
const { generateInquiriesPDF, generateInquiriesCSV } = require('../utils/export');

exports.createInquiry = async (req, res) => {
  try {
    const inquiryData = {
      ...req.body,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    };

    const inquiry = await Inquiry.create(inquiryData);

    await Promise.all([
      sendInquiryNotification(inquiry),
      sendConfirmationEmail(inquiry),
    ]);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your inquiry has been submitted successfully. We will contact you within 2 business days.',
      data: { id: inquiry._id, createdAt: inquiry.createdAt },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e) => ({
        field: e.path,
        message: e.message,
      }));
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }
    res.status(500).json({ success: false, message: 'Failed to submit inquiry' });
  }
};

exports.getInquiries = async (req, res) => {
  try {
    const { search, country, status, page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const query = {};

    if (country) query.country = new RegExp(country, 'i');
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { fullName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { companyName: new RegExp(search, 'i') },
        { jobDetails: new RegExp(search, 'i') },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [inquiries, total] = await Promise.all([
      Inquiry.find(query).sort(sort).skip(skip).limit(parseInt(limit, 10)),
      Inquiry.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: inquiries,
      pagination: {
        total,
        page: parseInt(page, 10),
        pages: Math.ceil(total / parseInt(limit, 10)),
        limit: parseInt(limit, 10),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch inquiries' });
  }
};

exports.getInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    res.status(200).json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch inquiry' });
  }
};

exports.updateInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    res.status(200).json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update inquiry' });
  }
};

exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    res.status(200).json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete inquiry' });
  }
};

exports.getStatistics = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [
      totalInquiries,
      monthlyInquiries,
      yearlyInquiries,
      countryStats,
      serviceStats,
      statusStats,
      monthlyTrend,
    ] = await Promise.all([
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Inquiry.countDocuments({ createdAt: { $gte: startOfYear } }),
      Inquiry.aggregate([
        { $group: { _id: '$country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Inquiry.aggregate([
        { $group: { _id: '$serviceInterest', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Inquiry.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Inquiry.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 11, 1) },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalInquiries,
        monthlyInquiries,
        yearlyInquiries,
        countryStats: countryStats.map((c) => ({ country: c._id, count: c.count })),
        serviceStats: serviceStats.map((s) => ({ service: s._id || 'Unspecified', count: s.count })),
        statusStats: statusStats.map((s) => ({ status: s._id, count: s.count })),
        monthlyTrend: monthlyTrend.map((m) => ({
          label: `${m._id.year}-${String(m._id.month).padStart(2, '0')}`,
          count: m.count,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
  }
};

exports.exportCSV = async (req, res) => {
  try {
    const { country, status } = req.query;
    const query = {};
    if (country) query.country = new RegExp(country, 'i');
    if (status) query.status = status;

    const inquiries = await Inquiry.find(query).sort('-createdAt');
    const csv = generateInquiriesCSV(inquiries);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="inquiries-${Date.now()}.csv"`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to export CSV' });
  }
};

exports.exportPDF = async (req, res) => {
  try {
    const { country, status } = req.query;
    const query = {};
    if (country) query.country = new RegExp(country, 'i');
    if (status) query.status = status;

    const inquiries = await Inquiry.find(query).sort('-createdAt').limit(100);
    generateInquiriesPDF(inquiries, res);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to export PDF' });
  }
};
