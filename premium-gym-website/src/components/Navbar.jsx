import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
        {/* Logo Section */}
        <div style={styles.logoContainer}>
          <Dumbbell color="#00ffff" size={28} />
          <h2 style={styles.logoText}>
            NA <span style={{ color: '#FFD700' }}>FITNESS</span>
          </h2>
        </div>

        {/* Desktop Links - PC par nazar aayenge, Mobile par hide honge via CSS */}
        <ul style={styles.navLinks} className="desktop-links">
          <li><a href="#home" style={styles.link}>Home</a></li>
          <li><a href="#facilities" style={styles.link}>Facilities</a></li>
          <li><a href="#gallery" style={styles.link}>Gallery</a></li>
          <li><a href="#packages" style={styles.link}>Packages</a></li>
          <li><a href="#reviews" style={styles.link}>Reviews</a></li>
          <li><a href="#contact" style={styles.link}>Contact</a></li>
        </ul>

        {/* Right Side: Join Button & Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>

          <a
            href="https://wa.me/16142093441"
            target="_blank"
            rel="noreferrer"
            style={styles.joinBtn}
          >
            Join Now
          </a>

          {/* Mobile Menu Icon - Sirf mobile view mein nazar aayega */}
          <div onClick={toggleMenu} style={styles.menuIcon} className="mobile-toggle-btn">
            {isOpen ? <X size={28} color="#fff" /> : <Menu size={28} color="#fff" />}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={styles.mobileMenu}
          >
            <ul style={styles.mobileLinks}>
              <li><a href="#home" onClick={toggleMenu} style={styles.mLink}>Home</a></li>
              <li><a href="#facilities" onClick={toggleMenu} style={styles.mLink}>Facilities</a></li>
              <li><a href="#gallery" onClick={toggleMenu} style={styles.mLink}>Gallery</a></li>
              <li><a href="#packages" onClick={toggleMenu} style={styles.mLink}>Packages</a></li>
              <li><a href="#reviews" onClick={toggleMenu} style={styles.mLink}>Reviews</a></li>
              <li><a href="#contact" onClick={toggleMenu} style={styles.mLink}>Contact</a></li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const styles = {
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
    backdropFilter: 'blur(10px)',
    zIndex: 1000,
    borderBottom: '1px solid #333'
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 5%',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  logoContainer: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoText: { color: '#fff', fontSize: '1.4rem', fontWeight: 'bold', margin: 0 },
  navLinks: { display: 'flex', listStyle: 'none', gap: '25px', margin: 0, padding: 0 },
  link: {
    color: '#e0e0e0',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'color 0.3s ease'
  },
  joinBtn: {
    backgroundColor: '#FFD700',
    color: '#000',
    padding: '10px 20px',
    borderRadius: '25px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '0.9rem'
  },
  menuIcon: { cursor: 'pointer', display: 'none' }, // Desktop par hide rahega
  mobileMenu: { backgroundColor: '#111', width: '100%', borderBottom: '1px solid #333', overflow: 'hidden' },
  mobileLinks: {
    listStyle: 'none',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    textAlign: 'center'
  },
  mLink: { color: '#fff', textDecoration: 'none', fontSize: '1.1rem', display: 'block', padding: '10px 0' }
};

export default Navbar;