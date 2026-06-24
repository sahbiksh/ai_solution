import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner } from 'react-bootstrap';
import { contentAPI } from '../services/api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contentAPI
      .getEvents()
      .then((res) => setEvents(res.data.data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <>
      <div className="page-header">
        <Container>
          <h1>Upcoming Events</h1>
          <p className="lead opacity-90">Join us at webinars, workshops, and meetups</p>
        </Container>
      </div>

      <section className="section-padding">
        <Container>
          {loading ? (
            <div className="loading-spinner"><Spinner animation="border" variant="primary" /></div>
          ) : events.length === 0 ? (
            <p className="text-center text-muted">No upcoming events at the moment. Check back soon!</p>
          ) : (
            <Row className="g-4">
              {events.map((event) => (
                <Col md={6} lg={4} key={event._id}>
                  <Card className="card-hover h-100 p-4">
                    <Badge bg="primary" className="mb-3 align-self-start">{event.eventType}</Badge>
                    <Card.Title>{event.title}</Card.Title>
                    <Card.Text className="text-muted">{event.description}</Card.Text>
                    <div className="mt-auto">
                      <p className="mb-1"><strong>📅</strong> {formatDate(event.eventDate)}</p>
                      <p className="mb-0"><strong>📍</strong> {event.location}</p>
                      {event.registrationUrl && (
                        <a href={event.registrationUrl} className="btn btn-primary btn-sm mt-3" target="_blank" rel="noreferrer">
                          Register
                        </a>
                      )}
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

export default Events;
