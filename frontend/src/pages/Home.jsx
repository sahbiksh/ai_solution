import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

const services = [
  {
    icon: '🤖',
    title: 'Virtual Assistant',
    description: 'AI-powered chatbots that handle customer queries 24/7 with natural language understanding.',
  },
  {
    icon: '⚡',
    title: 'AI Prototyping',
    description: 'Rapid proof-of-concept development to validate your AI ideas quickly and affordably.',
  },
  {
    icon: '💻',
    title: 'Software Development',
    description: 'End-to-end custom software solutions integrating cutting-edge AI technologies.',
  },
];

const Home = () => (
  <>
    <section className="hero-section">
      <Container className="position-relative">
        <Row className="align-items-center">
          <Col lg={7}>
            <h1 className="display-4 fw-bold mb-4">
              Transform Your Business with AI-Powered Solutions
            </h1>
            <p className="lead mb-4 opacity-90">
              AI-Solutions helps industries improve the digital employee experience through
              intelligent virtual assistants, rapid prototyping, and innovative software development.
            </p>
            <div className="d-flex gap-3 flex-wrap">
              <Button as={Link} to="/contact" variant="light" size="lg" className="fw-semibold">
                Get Started
              </Button>
              <Button as={Link} to="/services" variant="outline-light" size="lg">
                Our Services
              </Button>
            </div>
          </Col>
          <Col lg={5} className="d-none d-lg-block text-center">
            <div className="p-5">
              <div style={{ fontSize: '8rem' }}>🧠</div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>

    <section className="section-padding bg-light">
      <Container>
        <div className="text-center mb-5">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">
            Comprehensive AI solutions tailored to your business needs
          </p>
        </div>
        <Row className="g-4">
          {services.map((service) => (
            <Col md={4} key={service.title}>
              <Card className="card-hover h-100 text-center p-4">
                <Card.Body>
                  <div className="fs-1 mb-3">{service.icon}</div>
                  <Card.Title>{service.title}</Card.Title>
                  <Card.Text className="text-muted">{service.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>

    <section className="section-padding">
      <Container>
        <Row className="align-items-center">
          <Col lg={6}>
            <h2 className="section-title">Why Choose AI-Solutions?</h2>
            <ul className="list-unstyled mt-4">
              {[
                'Based in Sunderland with global reach',
                'Expert team in AI and software development',
                'Affordable prototyping for startups',
                'Proven track record with enterprise clients',
                '24/7 AI-powered customer support solutions',
              ].map((item) => (
                <li key={item} className="mb-3 d-flex align-items-start">
                  <span className="text-primary me-2">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Button as={Link} to="/about" variant="primary" className="mt-3">
              Learn More About Us
            </Button>
          </Col>
          <Col lg={6}>
            <Row className="g-3">
              {[
                { value: '50+', label: 'Projects Delivered' },
                { value: '95%', label: 'Client Satisfaction' },
                { value: '3', label: 'Core AI Services' },
                { value: '24/7', label: 'AI Support Available' },
              ].map((stat) => (
                <Col sm={6} key={stat.label}>
                  <Card className="card-hover text-center p-4">
                    <div className="stat-value" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>
                      {stat.value}
                    </div>
                    <div className="text-muted">{stat.label}</div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </section>

    <section className="section-padding bg-primary text-white text-center">
      <Container>
        <h2 className="mb-3">Ready to Start Your AI Journey?</h2>
        <p className="lead mb-4 opacity-90">
          Contact us today and let our team help transform your digital employee experience.
        </p>
        <Button as={Link} to="/contact" variant="light" size="lg" className="fw-semibold">
          Contact Us Now
        </Button>
      </Container>
    </section>
  </>
);

export default Home;
