import { useState, useEffect, useCallback } from 'react';
import { Table, Form, Button, Badge, Modal, Spinner, Row, Col, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { inquiryAPI } from '../../services/api';

const statusColors = {
  new: 'primary',
  in_progress: 'warning',
  resolved: 'success',
  closed: 'secondary',
};

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const [status, setStatus] = useState('');
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchInquiries = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await inquiryAPI.getAll({ search, country, status, page, limit: 10 });
      setInquiries(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  }, [search, country, status]);

  useEffect(() => {
    const timer = setTimeout(() => fetchInquiries(), 300);
    return () => clearTimeout(timer);
  }, [fetchInquiries]);

  const handleExport = async (format) => {
    try {
      const params = { country, status };
      const res = format === 'csv'
        ? await inquiryAPI.exportCSV(params)
        : await inquiryAPI.exportPDF(params);

      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inquiries.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success(`${format.toUpperCase()} exported successfully`);
    } catch {
      toast.error(`Failed to export ${format.toUpperCase()}`);
    }
  };

  const handleDelete = async () => {
    try {
      await inquiryAPI.delete(deleteId);
      toast.success('Inquiry deleted');
      setShowDeleteModal(false);
      fetchInquiries(pagination.page);
    } catch {
      toast.error('Failed to delete inquiry');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await inquiryAPI.update(id, { status: newStatus });
      toast.success('Status updated');
      fetchInquiries(pagination.page);
      setShowModal(false);
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Inquiries ({pagination.total})</h2>
        <div className="d-flex gap-2">
          <Button variant="outline-success" size="sm" onClick={() => handleExport('csv')}>Export CSV</Button>
          <Button variant="outline-danger" size="sm" onClick={() => handleExport('pdf')}>Export PDF</Button>
        </div>
      </div>

      <Row className="g-3 mb-4">
        <Col md={4}>
          <InputGroup>
            <Form.Control
              placeholder="Search inquiries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Control
            placeholder="Filter by country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <div className="loading-spinner"><Spinner animation="border" variant="primary" /></div>
      ) : (
        <>
          <Table responsive hover className="bg-white rounded shadow-sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Country</th>
                <th>Service</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry) => (
                <tr key={inquiry._id}>
                  <td>{inquiry.fullName}</td>
                  <td>{inquiry.email}</td>
                  <td>{inquiry.companyName}</td>
                  <td>{inquiry.country}</td>
                  <td>{inquiry.serviceInterest}</td>
                  <td>
                    <Badge bg={statusColors[inquiry.status] || 'secondary'}>
                      {inquiry.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td>{new Date(inquiry.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-1"
                      onClick={() => { setSelected(inquiry); setShowModal(true); }}
                    >
                      View
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => { setDeleteId(inquiry._id); setShowDeleteModal(true); }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {pagination.pages > 1 && (
            <div className="d-flex justify-content-center gap-2 mt-3">
              <Button
                variant="outline-primary"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => fetchInquiries(pagination.page - 1)}
              >
                Previous
              </Button>
              <span className="align-self-center">Page {pagination.page} of {pagination.pages}</span>
              <Button
                variant="outline-primary"
                size="sm"
                disabled={pagination.page >= pagination.pages}
                onClick={() => fetchInquiries(pagination.page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Inquiry Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <>
              <Row className="g-3 mb-3">
                <Col sm={6}><strong>Name:</strong> {selected.fullName}</Col>
                <Col sm={6}><strong>Email:</strong> {selected.email}</Col>
                <Col sm={6}><strong>Phone:</strong> {selected.phone}</Col>
                <Col sm={6}><strong>Company:</strong> {selected.companyName}</Col>
                <Col sm={6}><strong>Country:</strong> {selected.country}</Col>
                <Col sm={6}><strong>Job Title:</strong> {selected.jobTitle}</Col>
                <Col sm={6}><strong>Service:</strong> {selected.serviceInterest}</Col>
                <Col sm={6}><strong>Date:</strong> {new Date(selected.createdAt).toLocaleString()}</Col>
              </Row>
              <div className="mb-3">
                <strong>Project Requirements:</strong>
                <p className="mt-2 p-3 bg-light rounded">{selected.jobDetails}</p>
              </div>
              <Form.Group>
                <Form.Label>Update Status</Form.Label>
                <div className="d-flex gap-2">
                  {['new', 'in_progress', 'resolved', 'closed'].map((s) => (
                    <Button
                      key={s}
                      variant={selected.status === s ? 'primary' : 'outline-primary'}
                      size="sm"
                      onClick={() => handleStatusUpdate(selected._id, s)}
                    >
                      {s.replace('_', ' ')}
                    </Button>
                  ))}
                </div>
              </Form.Group>
            </>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this inquiry? This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminInquiries;
