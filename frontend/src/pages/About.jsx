import { Container, Row, Col, Card } from 'react-bootstrap';

const values = [
  { title: 'Innovation', description: 'Pushing boundaries with cutting-edge AI technology to solve real business challenges.' },
  { title: 'Integrity', description: 'Building trust through transparent communication and ethical AI practices.' },
  { title: 'Excellence', description: 'Delivering high-quality solutions that exceed client expectations every time.' },
  { title: 'Collaboration', description: 'Working closely with clients as partners in their digital transformation journey.' },
];

const About = () => (
  <>
    <div className="page-header">
      <Container>
        <h1>About Us</h1>
        <p className="lead opacity-90">Pioneering AI solutions from Sunderland, UK</p>
      </Container>
    </div>

    <section className="section-padding">
      <Container>
        <Row className="g-5">
          <Col lg={6}>
            <h2 className="section-title">Our Mission</h2>
            <p className="text-muted fs-5">
              To empower organizations worldwide with accessible, innovative AI-powered software solutions
              that enhance the digital employee experience and drive operational excellence.
            </p>
          </Col>
          <Col lg={6}>
            <h2 className="section-title">Our Vision</h2>
            <p className="text-muted fs-5">
              To become the leading AI solutions provider in the North East of England, recognized globally
              for transforming how businesses interact with technology and their workforce.
            </p>
          </Col>
        </Row>
      </Container>
    </section>

    <section className="section-padding bg-light">
      <Container>
        <div className="text-center mb-5">
          <h2 className="section-title">Our Values</h2>
        </div>
        <Row className="g-4">
          {values.map((value) => (
            <Col md={6} lg={3} key={value.title}>
              <Card className="card-hover h-100 p-3 text-center">
                <Card.Body>
                  <Card.Title>{value.title}</Card.Title>
                  <Card.Text className="text-muted">{value.description}</Card.Text>
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
            <h2 className="section-title">Our Story</h2>
            <p className="text-muted">
              Founded in Sunderland, AI-Solutions emerged from a vision to make artificial intelligence
              accessible to businesses of all sizes. Our founders, experienced software engineers and AI
              researchers, recognized that many organizations struggled to adopt AI due to high costs
              and complexity.
            </p>
            <p className="text-muted">
              Today, we serve clients across healthcare, manufacturing, legal, and technology sectors,
              delivering virtual assistants, rapid prototypes, and custom software that make a measurable
              difference to their operations.
            </p>
          </Col>
          <Col lg={6}>
            <Card className="card-hover p-4">
              <h4>Company Details</h4>
              <ul className="list-unstyled mt-3">
                <li className="mb-2"><strong>Founded:</strong> 2022</li>
                <li className="mb-2"><strong>Location:</strong> Sunderland, United Kingdom</li>
                <li className="mb-2"><strong>Industry:</strong> AI Software Solutions</li>
                <li className="mb-2"><strong>Team Size:</strong> 25+ professionals</li>
                <li className="mb-2"><strong>Specialization:</strong> Digital Employee Experience</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  </>
);

export default About;
