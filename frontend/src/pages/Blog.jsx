import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Spinner } from 'react-bootstrap';
import { contentAPI } from '../services/api';

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contentAPI
      .getArticles()
      .then((res) => setArticles(res.data.data))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="page-header">
        <Container>
          <h1>Blog & Articles</h1>
          <p className="lead opacity-90">Insights, tutorials, and company news</p>
        </Container>
      </div>

      <section className="section-padding">
        <Container>
          {loading ? (
            <div className="loading-spinner"><Spinner animation="border" variant="primary" /></div>
          ) : (
            <Row className="g-4">
              {articles.map((article) => (
                <Col md={6} lg={4} key={article._id}>
                  <Card className="card-hover h-100">
                    <Card.Body className="p-4">
                      <Badge bg="primary" className="mb-2">{article.category}</Badge>
                      <Card.Title>
                        <Link to={`/blog/${article.slug}`} className="text-dark text-decoration-none">
                          {article.title}
                        </Link>
                      </Card.Title>
                      <Card.Text className="text-muted">{article.excerpt}</Card.Text>
                      <div className="d-flex justify-content-between text-muted small mt-auto">
                        <span>{article.author}</span>
                        <span>{article.readTime} min read</span>
                      </div>
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

export default Blog;
