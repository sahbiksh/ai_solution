import AdminContentManager from '../../components/admin/AdminContentManager';
import { adminContentAPI } from '../../services/api';

const categories = ['AI Trends', 'Case Studies', 'Tutorials', 'Company News', 'Industry Insights'];

const emptyForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  author: 'AI-Solutions Team',
  category: categories[0],
  coverImage: '',
  tags: '',
  readTime: 5,
  isPublished: true,
};

const AdminBlog = () => (
  <AdminContentManager
    title="Blog Articles"
    api={adminContentAPI.articles}
    emptyForm={emptyForm}
    columns={[
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
      { key: 'author', label: 'Author' },
      { key: 'readTime', label: 'Read Time' },
      { key: 'isPublished', label: 'Status' },
    ]}
    fields={[
      { name: 'title', label: 'Title', type: 'text', required: true, autoSlugFrom: 'slug', fullWidth: true },
      { name: 'slug', label: 'URL Slug', type: 'text', required: true },
      { name: 'author', label: 'Author', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', options: categories, required: true },
      { name: 'readTime', label: 'Read Time (minutes)', type: 'number', min: 1, required: true },
      { name: 'coverImage', label: 'Cover Image URL', type: 'text', fullWidth: true },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea', rows: 2, required: true, fullWidth: true },
      { name: 'content', label: 'Content (HTML allowed)', type: 'textarea', rows: 6, required: true, fullWidth: true },
      { name: 'tags', label: 'Tags (comma separated)', type: 'text', fullWidth: true },
      { name: 'isPublished', label: 'Published', type: 'checkbox', checkboxLabel: 'Publish on website' },
    ]}
    preparePayload={(form) => ({
      ...form,
      readTime: Number(form.readTime),
      tags: form.tags
        ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    })}
  />
);

export default AdminBlog;
