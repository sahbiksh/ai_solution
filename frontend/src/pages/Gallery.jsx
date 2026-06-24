import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner } from 'react-bootstrap';
import { contentAPI } from '../services/api';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contentAPI
      .getGallery()
      .then((res) => setImages(res.data.data))
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="page-header">
        <Container>
          <h1>Gallery</h1>
          <p className="lead opacity-90">Events, team, and company highlights</p>
        </Container>
      </div>

      <section className="section-padding">
        <Container>
          {loading ? (
            <div className="loading-spinner"><Spinner animation="border" variant="primary" /></div>
          ) : (
            <Row className="g-4">
              {images.map((img) => (
                <Col md={6} lg={4} key={img._id}>
                  <Card className="card-hover overflow-hidden">
                    <Card.Img
                      variant="top"
                      src={img.imageUrl}
                      alt={img.title}
                      style={{ height: 220, objectFit: 'cover' }}
                    />
                    <Card.Body>
                      <Badge bg="primary" className="mb-2">{img.category}</Badge>
                      <Card.Title>{img.title}</Card.Title>
                      {img.description && <Card.Text className="text-muted small">{img.description}</Card.Text>}
                    </Card.Body>
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

export default Gallery;
