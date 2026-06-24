import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner } from 'react-bootstrap';
import { contentAPI } from '../services/api';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contentAPI
      .getPortfolio()
      .then((res) => setProjects(res.data.data))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="page-header">
        <Container>
          <h1>Portfolio & Case Studies</h1>
          <p className="lead opacity-90">Successful projects delivering measurable results</p>
        </Container>
      </div>

      <section className="section-padding">
        <Container>
          {loading ? (
            <div className="loading-spinner"><Spinner animation="border" variant="primary" /></div>
          ) : (
            <Row className="g-4">
              {projects.map((project) => (
                <Col lg={6} key={project.id}>
                  <Card className="card-hover h-100">
                    <Card.Body className="p-4">
                      <Badge bg="primary" className="mb-3">{project.category}</Badge>
                      <Card.Title className="fs-4">{project.title}</Card.Title>
                      <Card.Subtitle className="mb-3 text-muted">{project.client}</Card.Subtitle>
                      <Card.Text>{project.description}</Card.Text>
                      <div className="mb-3">
                        {project.technologies.map((tech) => (
                          <Badge bg="light" text="dark" className="me-1 mb-1" key={tech}>{tech}</Badge>
                        ))}
                      </div>
                      <h6 className="mt-3">Key Results:</h6>
                      <ul className="mb-0">
                        {project.results.map((result) => (
                          <li key={result} className="text-success">{result}</li>
                        ))}
                      </ul>
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

export default Portfolio;
