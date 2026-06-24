import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';

const services = [
  {
    title: 'AI-Powered Virtual Assistant',
    icon: '🤖',
    description: 'Deploy intelligent chatbots and virtual assistants that understand natural language, handle customer queries 24/7, and integrate seamlessly with your existing systems.',
    features: ['Natural Language Processing', 'Multi-channel Support', 'CRM Integration', 'Analytics Dashboard', 'Custom Training'],
    badge: 'Most Popular',
  },
  {
    title: 'AI-Based Prototyping',
    icon: '⚡',
    description: 'Validate your AI concepts quickly with our affordable prototyping service. Get a working proof-of-concept in weeks, not months.',
    features: ['Rapid Development', 'Cost-Effective', 'Feasibility Testing', 'Investor-Ready Demos', 'Iterative Refinement'],
    badge: 'Startup Friendly',
  },
  {
    title: 'Innovative Software Development',
    icon: '💻',
    description: 'Full-stack custom software development with AI integration. From web applications to enterprise systems, we build scalable solutions.',
    features: ['Custom Web Apps', 'API Development', 'Cloud Deployment', 'ML Integration', 'Ongoing Support'],
    badge: 'Enterprise Grade',
  },
  {
    title: 'AI Consulting',
    icon: '📊',
    description: 'Strategic guidance on AI adoption, technology selection, and digital transformation roadmaps tailored to your industry.',
    features: ['AI Strategy', 'Technology Audit', 'ROI Analysis', 'Implementation Planning', 'Team Training'],
    badge: 'Advisory',
  },
];

const Services = () => (
  <>
    <div className="page-header">
      <Container>
        <h1>Our Services</h1>
        <p className="lead opacity-90">AI-powered solutions for every business challenge</p>
      </Container>
    </div>

    <section className="section-padding">
      <Container>
        <Row className="g-4">
          {services.map((service) => (
            <Col lg={6} key={service.title}>
              <Card className="card-hover h-100">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <span className="fs-1">{service.icon}</span>
                    <Badge bg="primary">{service.badge}</Badge>
                  </div>
                  <Card.Title className="fs-4">{service.title}</Card.Title>
                  <Card.Text className="text-muted mb-4">{service.description}</Card.Text>
                  <ul className="list-unstyled">
                    {service.features.map((feature) => (
                      <li key={feature} className="mb-2">
                        <span className="text-primary me-2">✓</span>{feature}
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="text-center mt-5">
          <Button as={Link} to="/contact" variant="primary" size="lg">
            Request a Consultation
          </Button>
        </div>
      </Container>
    </section>
  </>
);

export default Services;
