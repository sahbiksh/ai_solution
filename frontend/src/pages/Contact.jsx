import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { inquiryAPI } from '../services/api';

const countries = [
  'United Kingdom', 'United States', 'Germany', 'France', 'Poland', 'India',
  'Australia', 'Canada', 'Netherlands', 'Ireland', 'Other',
];

const serviceOptions = [
  'Virtual Assistant', 'AI Prototyping', 'Software Development', 'Consulting', 'Other',
];

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await inquiryAPI.submit(data);
      setSubmitted(true);
      reset();
      toast.success('Your inquiry has been submitted successfully!');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to submit inquiry. Please try again.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <Container>
          <h1>Contact Us</h1>
          <p className="lead opacity-90">Tell us about your project requirements</p>
        </Container>
      </div>

      <section className="section-padding">
        <Container>
          <Row className="g-5">
            <Col lg={5}>
              <h2 className="section-title">Get in Touch</h2>
              <p className="text-muted mb-4">
                Fill out the form and our team will respond within 2 business days.
              </p>
              <Card className="card-hover p-4">
                <h5>Contact Information</h5>
                <ul className="list-unstyled mt-3 text-muted">
                  <li className="mb-2">📍 Sunderland, United Kingdom</li>
                  <li className="mb-2">📧 info@ai-solutions.co.uk</li>
                  <li className="mb-2">📞 +44 191 555 0100</li>
                  <li>🕐 Mon-Fri: 9:00 AM - 5:30 PM GMT</li>
                </ul>
              </Card>
            </Col>

            <Col lg={7}>
              {submitted && (
                <Alert variant="success" className="mb-4">
                  <Alert.Heading>Thank you for your inquiry!</Alert.Heading>
                  <p>We have received your message and will contact you within 2 business days.</p>
                </Alert>
              )}

              <Card className="card-hover p-4">
                <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Full Name *</Form.Label>
                        <Form.Control
                          {...register('fullName', {
                            required: 'Full name is required',
                            pattern: { value: /^[a-zA-Z\s'-]+$/, message: 'Invalid name format' },
                          })}
                          isInvalid={!!errors.fullName}
                        />
                        <Form.Control.Feedback type="invalid">{errors.fullName?.message}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Email Address *</Form.Label>
                        <Form.Control
                          type="email"
                          {...register('email', {
                            required: 'Email is required',
                            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
                          })}
                          isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Phone Number *</Form.Label>
                        <Form.Control
                          {...register('phone', {
                            required: 'Phone number is required',
                            pattern: { value: /^[+]?[\d\s()-]{7,20}$/, message: 'Invalid phone number' },
                          })}
                          isInvalid={!!errors.phone}
                        />
                        <Form.Control.Feedback type="invalid">{errors.phone?.message}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Company Name *</Form.Label>
                        <Form.Control
                          {...register('companyName', { required: 'Company name is required' })}
                          isInvalid={!!errors.companyName}
                        />
                        <Form.Control.Feedback type="invalid">{errors.companyName?.message}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Country *</Form.Label>
                        <Form.Select
                          {...register('country', { required: 'Country is required' })}
                          isInvalid={!!errors.country}
                        >
                          <option value="">Select country</option>
                          {countries.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.country?.message}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Job Title *</Form.Label>
                        <Form.Control
                          {...register('jobTitle', { required: 'Job title is required' })}
                          isInvalid={!!errors.jobTitle}
                        />
                        <Form.Control.Feedback type="invalid">{errors.jobTitle?.message}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>Service Interest</Form.Label>
                        <Form.Select {...register('serviceInterest')}>
                          {serviceOptions.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>Job Details / Project Requirements *</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          {...register('jobDetails', {
                            required: 'Project requirements are required',
                            minLength: { value: 20, message: 'Please provide at least 20 characters' },
                            maxLength: { value: 5000, message: 'Maximum 5000 characters' },
                          })}
                          isInvalid={!!errors.jobDetails}
                        />
                        <Form.Control.Feedback type="invalid">{errors.jobDetails?.message}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Button type="submit" variant="primary" size="lg" disabled={submitting} className="w-100">
                        {submitting ? 'Submitting...' : 'Submit Inquiry'}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Contact;
