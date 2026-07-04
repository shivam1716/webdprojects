import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div id="home" style={styles.heroSection}>
      <div style={styles.overlay}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={styles.content}
        >
          <h1 className="hero-title" style={styles.title}>
            JOIN THE <br /> REVOLUTION AT <br />
            <span style={{ color: '#00ffff' }}>NA FITNESS CLUB</span>
          </h1>
          <p className="hero-subtitle" style={styles.subtitle}>
            Ladies Exclusive (7 AM - 3 PM) | Mens Exclusive (4 PM - 10 PM) <br/>
            Bahria Town Phase 8
          </p>

          <div style={styles.btnContainer}>
            <a href="#packages" style={styles.primaryBtn}>View Offers</a>
            
            <a 
              href="https://wa.me/16142093441" 
              target="_blank" 
              rel="noreferrer" 
              style={styles.whatsappBtn}
            >
              Chat on WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const styles = {
  heroSection: { 
    height: '100vh', 
    backgroundImage: 'url("/gym-bg.webp")', 
    backgroundSize: 'cover', 
    backgroundPosition: 'center center', 
    position: 'relative' /* Ye lagana zaroori tha */
  },
  overlay: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    width: '100%', 
    height: '100%', 
    backgroundColor: 'rgba(0, 0, 0, 0.75)', 
    zIndex: 1,
    /* Text ko Center karne ka Jadoo */
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  content: { 
    position: 'relative', 
    zIndex: 2, 
    textAlign: 'center', 
    padding: '0 20px', 
    width: '100%', 
    maxWidth: '800px' 
  },
  title: { 
    fontSize: '4rem', 
    color: '#fff', 
    fontWeight: '900', 
    letterSpacing: '2px', 
    lineHeight: '1.2', 
    marginBottom: '20px' 
  },
  subtitle: { 
    fontSize: '1.2rem', 
    color: '#ccc', 
    marginBottom: '40px', 
    lineHeight: '1.6' 
  },
  btnContainer: { 
    display: 'flex', 
    gap: '20px', 
    justifyContent: 'center', 
    flexWrap: 'wrap' 
  },
  primaryBtn: { 
    backgroundColor: '#FFD700', 
    color: '#000', 
    padding: '15px 35px', 
    borderRadius: '30px', 
    textDecoration: 'none', 
    fontWeight: 'bold', 
    fontSize: '1.1rem',
    border: '2px solid #FFD700'
  },
  whatsappBtn: { 
    backgroundColor: 'transparent', 
    color: '#fff', 
    padding: '15px 35px', 
    borderRadius: '30px', 
    textDecoration: 'none', 
    fontWeight: 'bold', 
    fontSize: '1.1rem', 
    border: '2px solid #25D366',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  }
};

export default Hero;