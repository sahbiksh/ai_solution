const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    endDate: Date,
    eventType: {
      type: String,
      enum: ['Webinar', 'Workshop', 'Conference', 'Meetup', 'Product Launch'],
      default: 'Webinar',
    },
    registrationUrl: String,
    coverImage: String,
    isPublished: {
      type: Boolean,
      default: true,
    },
    maxAttendees: Number,
    currentAttendees: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

eventSchema.index({ eventDate: 1 });

module.exports = mongoose.model('Event', eventSchema);
