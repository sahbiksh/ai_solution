import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

const NotFound = () => (
  <Container className="section-padding text-center">
    <h1 className="display-1 fw-bold text-primary">404</h1>
    <h2 className="mb-3">Page Not Found</h2>
    <p className="text-muted mb-4">The page you are looking for does not exist.</p>
    <Button as={Link} to="/" variant="primary">Go Home</Button>
  </Container>
);

export default NotFound;
