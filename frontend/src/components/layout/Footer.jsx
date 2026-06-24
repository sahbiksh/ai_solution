import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => (
  <footer className="bg-dark text-white pt-5 pb-3 mt-auto">
    <Container>
      <Row className="g-4">
        <Col md={4}>
          <h5 className="mb-3">AI-Solutions</h5>
          <p className="text-white-50">
            Leveraging Artificial Intelligence to improve the digital employee experience.
            Based in Sunderland, United Kingdom.
          </p>
        </Col>
        <Col md={4}>
          <h5 className="mb-3">Quick Links</h5>
          <ul className="list-unstyled">
            <li><Link to="/about" className="text-white-50">About Us</Link></li>
            <li><Link to="/services" className="text-white-50">Services</Link></li>
            <li><Link to="/portfolio" className="text-white-50">Portfolio</Link></li>
            <li><Link to="/contact" className="text-white-50">Contact</Link></li>
          </ul>
        </Col>
        <Col md={4}>
          <h5 className="mb-3">Contact</h5>
          <p className="text-white-50 mb-1">Sunderland, UK</p>
          <p className="text-white-50 mb-1">info@ai-solutions.co.uk</p>
          <p className="text-white-50">+44 191 555 0100</p>
        </Col>
      </Row>
      <hr className="border-secondary my-4" />
      <p className="text-center text-white-50 mb-0">
        &copy; {new Date().getFullYear()} AI-Solutions. All rights reserved.
      </p>
    </Container>
  </footer>
);

export default Footer;
