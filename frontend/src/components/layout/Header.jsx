import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/services', label: 'Services' },
  { path: '/portfolio', label: 'Portfolio' },
  { path: '/testimonials', label: 'Testimonials' },
  { path: '/blog', label: 'Blog' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/events', label: 'Events' },
  { path: '/contact', label: 'Contact' },
];

const Header = () => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  return (
    <Navbar expand="lg" className="bg-white shadow-sm sticky-top" expanded={expanded}>
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4" onClick={() => setExpanded(false)}>
          <span style={{ background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AI-Solutions
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" onClick={() => setExpanded(!expanded)} />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto">
            {navLinks.map((link) => (
              <Nav.Link
                key={link.path}
                as={Link}
                to={link.path}
                className={location.pathname === link.path ? 'fw-semibold text-primary' : ''}
                onClick={() => setExpanded(false)}
              >
                {link.label}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
