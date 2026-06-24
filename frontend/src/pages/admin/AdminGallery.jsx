import AdminContentManager from '../../components/admin/AdminContentManager';
import { adminContentAPI } from '../../services/api';

const categories = ['Events', 'Team', 'Office', 'Conferences', 'Workshops', 'Other'];

const emptyForm = {
  title: '',
  description: '',
  imageUrl: '',
  category: categories[0],
  eventDate: '',
  isPublished: true,
  sortOrder: 0,
};

const AdminGallery = () => (
  <AdminContentManager
    title="Gallery Images"
    api={adminContentAPI.gallery}
    emptyForm={emptyForm}
    columns={[
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
      { key: 'sortOrder', label: 'Order' },
      { key: 'isPublished', label: 'Status' },
    ]}
    fields={[
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', options: categories, required: true },
      { name: 'sortOrder', label: 'Sort Order', type: 'number', min: 0 },
      { name: 'imageUrl', label: 'Image URL', type: 'text', required: true, fullWidth: true },
      { name: 'eventDate', label: 'Event Date', type: 'date' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 3, fullWidth: true },
      { name: 'isPublished', label: 'Published', type: 'checkbox', checkboxLabel: 'Publish on website' },
    ]}
    preparePayload={(form) => ({
      ...form,
      sortOrder: Number(form.sortOrder) || 0,
      eventDate: form.eventDate || undefined,
    })}
  />
);

export default AdminGallery;
