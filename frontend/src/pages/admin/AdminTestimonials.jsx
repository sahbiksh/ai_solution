import AdminContentManager from '../../components/admin/AdminContentManager';
import { adminContentAPI } from '../../services/api';

const emptyForm = {
  customerName: '',
  company: '',
  role: '',
  content: '',
  rating: 5,
  avatar: '',
  isPublished: true,
  featured: false,
};

const AdminTestimonials = () => (
  <AdminContentManager
    title="Testimonials"
    api={adminContentAPI.testimonials}
    emptyForm={emptyForm}
    columns={[
      { key: 'customerName', label: 'Customer' },
      { key: 'company', label: 'Company' },
      { key: 'rating', label: 'Rating' },
      { key: 'featured', label: 'Featured' },
      { key: 'isPublished', label: 'Status' },
    ]}
    fields={[
      { name: 'customerName', label: 'Customer Name', type: 'text', required: true },
      { name: 'company', label: 'Company', type: 'text' },
      { name: 'role', label: 'Role', type: 'text' },
      { name: 'rating', label: 'Rating (1-5)', type: 'number', min: 1, max: 5, required: true },
      { name: 'avatar', label: 'Avatar URL', type: 'text' },
      { name: 'content', label: 'Testimonial', type: 'textarea', rows: 4, required: true, fullWidth: true },
      { name: 'isPublished', label: 'Published', type: 'checkbox', checkboxLabel: 'Publish on website' },
      { name: 'featured', label: 'Featured', type: 'checkbox', checkboxLabel: 'Show as featured' },
    ]}
    preparePayload={(form) => ({
      ...form,
      rating: Number(form.rating),
    })}
  />
);

export default AdminTestimonials;
