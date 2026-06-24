import { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Spinner, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';

const AdminContentManager = ({ title, api, columns, fields, emptyForm, preparePayload }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getAll();
      setItems(res.data.data);
    } catch {
      toast.error(`Failed to load ${title.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  }, [api, title]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    const nextForm = { ...emptyForm };
    fields.forEach((field) => {
      let value = item[field.name];
      if (field.type === 'date' && value) {
        value = new Date(value).toISOString().slice(0, 10);
      }
      if (field.type === 'datetime' && value) {
        value = new Date(value).toISOString().slice(0, 16);
      }
      if (field.type === 'checkbox') {
        value = Boolean(value);
      }
      if (field.type === 'tags' && Array.isArray(value)) {
        value = value.join(', ');
      }
      nextForm[field.name] = value ?? (field.type === 'checkbox' ? false : '');
    });
    setForm(nextForm);
    setShowForm(true);
  };

  const handleChange = (name, value, field) => {
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (field?.autoSlugFrom && !editing) {
        next[field.autoSlugFrom] = value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = preparePayload ? preparePayload(form) : form;
      if (editing) {
        await api.update(editing._id, payload);
        toast.success('Updated successfully');
      } else {
        await api.create(payload);
        toast.success('Created successfully');
      }
      setShowForm(false);
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(deleteId);
      toast.success('Deleted successfully');
      setShowDelete(false);
      fetchItems();
    } catch {
      toast.error('Delete failed');
    }
  };

  const renderCell = (item, col) => {
    const value = item[col.key];
    if (col.render) return col.render(value, item);
    if (col.key === 'isPublished') {
      return <Badge bg={value ? 'success' : 'secondary'}>{value ? 'Published' : 'Draft'}</Badge>;
    }
    if (col.key === 'featured') {
      return value ? <Badge bg="warning">Featured</Badge> : '—';
    }
    if (col.key === 'rating') return '★'.repeat(value || 0);
    if (col.type === 'date' && value) return new Date(value).toLocaleDateString();
    if (typeof value === 'string' && value.length > 60) return `${value.slice(0, 60)}...`;
    return value ?? '—';
  };

  const renderField = (field) => {
    const common = {
      value: form[field.name] ?? '',
      onChange: (e) => handleChange(field.name, field.type === 'checkbox' ? e.target.checked : e.target.value, field),
    };

    switch (field.type) {
      case 'textarea':
        return <Form.Control as="textarea" rows={field.rows || 3} {...common} required={field.required} />;
      case 'select':
        return (
          <Form.Select {...common} required={field.required}>
            {field.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </Form.Select>
        );
      case 'number':
        return (
          <Form.Control
            type="number"
            min={field.min}
            max={field.max}
            {...common}
            required={field.required}
          />
        );
      case 'checkbox':
        return <Form.Check type="checkbox" checked={Boolean(form[field.name])} onChange={common.onChange} label={field.checkboxLabel || 'Yes'} />;
      case 'date':
      case 'datetime':
        return <Form.Control type={field.type === 'datetime' ? 'datetime-local' : 'date'} {...common} required={field.required} />;
      default:
        return <Form.Control type="text" {...common} required={field.required} />;
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{title}</h2>
        <Button variant="primary" onClick={openCreate}>+ Add New</Button>
      </div>

      {loading ? (
        <div className="loading-spinner"><Spinner animation="border" variant="primary" /></div>
      ) : (
        <Table responsive hover className="bg-white rounded shadow-sm">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center text-muted py-4">
                  No records yet. Click &quot;Add New&quot; to create one.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item._id}>
                  {columns.map((col) => (
                    <td key={col.key}>{renderCell(item, col)}</td>
                  ))}
                  <td>
                    <Button variant="outline-primary" size="sm" className="me-1" onClick={() => openEdit(item)}>
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => { setDeleteId(item._id); setShowDelete(true); }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      <Modal show={showForm} onHide={() => setShowForm(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editing ? `Edit ${title.slice(0, -1)}` : `Add ${title.slice(0, -1)}`}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="row g-3">
              {fields.map((field) => (
                <div key={field.name} className={field.fullWidth ? 'col-12' : 'col-md-6'}>
                  {field.type !== 'checkbox' && <Form.Label>{field.label}{field.required ? ' *' : ''}</Form.Label>}
                  {renderField(field)}
                </div>
              ))}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showDelete} onHide={() => setShowDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this item? This cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminContentManager;
