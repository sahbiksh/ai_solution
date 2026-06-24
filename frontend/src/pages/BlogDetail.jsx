import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Badge, Spinner, Button } from 'react-bootstrap';
import { contentAPI } from '../services/api';

const BlogDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    contentAPI
      .getArticle(slug)
      .then((res) => setArticle(res.data.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="loading-spinner"><Spinner animation="border" variant="primary" /></div>;
  }

  if (error || !article) {
    return (
      <Container className="section-padding text-center">
        <h2>Article Not Found</h2>
        <Button as={Link} to="/blog" variant="primary" className="mt-3">Back to Blog</Button>
      </Container>
    );
  }

  return (
    <>
      <div className="page-header">
        <Container>
          <Badge bg="light" text="dark" className="mb-2">{article.category}</Badge>
          <h1>{article.title}</h1>
          <p className="opacity-90">
            By {article.author} &middot; {article.readTime} min read &middot;{' '}
            {new Date(article.publishedAt).toLocaleDateString()}
          </p>
        </Container>
      </div>
      <section className="section-padding">
        <Container style={{ maxWidth: 800 }}>
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
          <div className="mt-4">
            {article.tags?.map((tag) => (
              <Badge bg="secondary" className="me-1" key={tag}>{tag}</Badge>
            ))}
          </div>
          <Button as={Link} to="/blog" variant="outline-primary" className="mt-4">
            &larr; Back to Blog
          </Button>
        </Container>
      </section>
    </>
  );
};

export default BlogDetail;
