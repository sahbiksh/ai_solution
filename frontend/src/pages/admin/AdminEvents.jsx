import AdminContentManager from '../../components/admin/AdminContentManager';
import { adminContentAPI } from '../../services/api';

const eventTypes = ['Webinar', 'Workshop', 'Conference', 'Meetup', 'Product Launch'];

const emptyForm = {
  title: '',
  description: '',
  location: '',
  eventDate: '',
  endDate: '',
  eventType: eventTypes[0],
  registrationUrl: '',
  coverImage: '',
  isPublished: true,
  maxAttendees: '',
};

const AdminEvents = () => (
  <AdminContentManager
    title="Events"
    api={adminContentAPI.events}
    emptyForm={emptyForm}
    columns={[
      { key: 'title', label: 'Title' },
      { key: 'eventType', label: 'Type' },
      { key: 'location', label: 'Location' },
      { key: 'eventDate', label: 'Date', type: 'date' },
      { key: 'isPublished', label: 'Status' },
    ]}
    fields={[
      { name: 'title', label: 'Event Title', type: 'text', required: true, fullWidth: true },
      { name: 'eventType', label: 'Event Type', type: 'select', options: eventTypes, required: true },
      { name: 'location', label: 'Location', type: 'text', required: true },
      { name: 'eventDate', label: 'Start Date', type: 'datetime', required: true },
      { name: 'endDate', label: 'End Date', type: 'datetime' },
      { name: 'maxAttendees', label: 'Max Attendees', type: 'number', min: 1 },
      { name: 'registrationUrl', label: 'Registration URL', type: 'text', fullWidth: true },
      { name: 'coverImage', label: 'Cover Image URL', type: 'text', fullWidth: true },
      { name: 'description', label: 'Description', type: 'textarea', rows: 4, required: true, fullWidth: true },
      { name: 'isPublished', label: 'Published', type: 'checkbox', checkboxLabel: 'Publish on website' },
    ]}
    preparePayload={(form) => ({
      ...form,
      maxAttendees: form.maxAttendees ? Number(form.maxAttendees) : undefined,
      endDate: form.endDate || undefined,
    })}
  />
);

export default AdminEvents;
