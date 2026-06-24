import { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Container, Row, Col, Card, Spinner, Form, Button, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { contentAPI } from '../services/api';

const StarRating = ({ rating }) => (
  <span>
    {[...Array(5)].map((_, i) => (
      <span key={i} style={{ color: i < rating ? '#f59e0b' : '#e2e8f0' }}>★</span>
    ))}
  </span>
);

const StarPicker = ({ value, onChange, onBlur }) => (
  <div className="star-picker" role="group" aria-label="Rating">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        className="star-picker-btn"
        onClick={() => onChange(star)}
        onBlur={onBlur}
        aria-label={`${star} star${star > 1 ? 's' : ''}`}
      >
        <span style={{ color: star <= value ? '#f59e0b' : '#e2e8f0', fontSize: '1.75rem' }}>★</span>
      </button>
    ))}
  </div>
);

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      customerName: '',
      company: '',
      role: '',
      content: '',
      rating: 5,
    },
  });

  const fetchTestimonials = useCallback(() => {
    setLoading(true);
    contentAPI
      .getTestimonials()
      .then((res) => setTestimonials(res.data.data))
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await contentAPI.submitTestimonialFeedback({
        ...data,
        rating: Number(data.rating),
      });
      setSubmitted(true);
      reset();
      setTestimonials((prev) => [res.data.data, ...prev]);
      toast.success('Thank you for your feedback!');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to submit feedback. Please try again.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = testimonials.length
    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
    : 0;

  return (
    <>
      <div className="page-header">
        <Container>
          <h1>Customer Testimonials</h1>
          <p className="lead opacity-90">
            {testimonials.length > 0
              ? `Average Rating: ${avgRating}/5 from ${testimonials.length} reviews`
              : 'Share your experience with AI-Solutions'}
          </p>
        </Container>
      </div>

      <section className="section-padding bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <h2 className="section-title text-center mb-2">Share Your Feedback</h2>
              <p className="section-subtitle text-center">
                Tell us about your experience. Your review will appear on this page for others to see.
              </p>

              {submitted && (
                <Alert variant="success" className="mb-4">
                  <Alert.Heading>Thank you!</Alert.Heading>
                  <p className="mb-0">Your feedback has been published below.</p>
                </Alert>
              )}

              <Card className="card-hover p-4">
                <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Your Name *</Form.Label>
                        <Form.Control
                          {...register('customerName', {
                            required: 'Name is required',
                            maxLength: { value: 100, message: 'Maximum 100 characters' },
                          })}
                          isInvalid={!!errors.customerName}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.customerName?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Company</Form.Label>
                        <Form.Control
                          {...register('company', {
                            maxLength: { value: 150, message: 'Maximum 150 characters' },
                          })}
                          isInvalid={!!errors.company}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.company?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Role / Job Title</Form.Label>
                        <Form.Control
                          {...register('role', {
                            maxLength: { value: 100, message: 'Maximum 100 characters' },
                          })}
                          isInvalid={!!errors.role}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.role?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Rating *</Form.Label>
                        <Controller
                          name="rating"
                          control={control}
                          rules={{
                            required: 'Please select a rating',
                            min: { value: 1, message: 'Rating must be at least 1' },
                            max: { value: 5, message: 'Rating cannot exceed 5' },
                          }}
                          render={({ field }) => (
                            <StarPicker
                              value={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                            />
                          )}
                        />
                        {errors.rating && (
                          <div className="text-danger small mt-1">{errors.rating.message}</div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>Your Feedback *</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          placeholder="What did you like about working with us?"
                          {...register('content', {
                            required: 'Feedback is required',
                            minLength: { value: 10, message: 'Please write at least 10 characters' },
                            maxLength: { value: 2000, message: 'Maximum 2000 characters' },
                          })}
                          isInvalid={!!errors.content}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.content?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Button type="submit" variant="primary" size="lg" disabled={submitting} className="w-100">
                        {submitting ? 'Submitting...' : 'Submit Feedback'}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section-padding">
        <Container>
          <h2 className="section-title text-center mb-4">What Our Customers Say</h2>
          {loading ? (
            <div className="loading-spinner">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : testimonials.length === 0 ? (
            <p className="text-center text-muted">No testimonials yet. Be the first to share your experience!</p>
          ) : (
            <Row className="g-4">
              {testimonials.map((t) => (
                <Col md={6} lg={4} key={t._id}>
                  <Card className="card-hover h-100 p-4">
                    <StarRating rating={t.rating} />
                    <Card.Text className="my-3 fst-italic">&ldquo;{t.content}&rdquo;</Card.Text>
                    <div>
                      <strong>{t.customerName}</strong>
                      <div className="text-muted small">
                        {t.role}
                        {t.company && `, ${t.company}`}
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>
    </>
  );
};

export default Testimonials;
