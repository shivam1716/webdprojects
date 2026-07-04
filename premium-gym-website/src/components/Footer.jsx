import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* About Section */}
        <div style={styles.box}>
          <h3 style={styles.title}>NA <span style={{ color: '#FFD700' }}>FITNESS</span></h3>
          <p style={styles.text}>Your ultimate destination for fitness and health in Bahria Town Phase 8. Join us to transform your life.</p>
        </div>

        {/* Timing Section */}
        <div style={styles.box}>
          <h4 style={styles.title}>Opening Hours</h4>
          <p style={styles.text}>Ladies: 07:00 AM - 03:00 PM</p>
          <p style={styles.text}>Mens: 04:00 PM - 10:00 PM</p>
          <p style={styles.text}>Sunday: Closed</p>
        </div>

        {/* Contact Links */}
        <div style={styles.box}>
          <h4 style={styles.title}>Contact Us</h4>
          {/* Phone Display */}
          <p style={styles.text}><Phone size={16} color="#00ffff" /> 0320 1575095</p>
          <p style={styles.text}><Mail size={16} color="#00ffff" /> info@nafitnessclub.com</p>
          <p style={styles.text}><MapPin size={16} color="#00ffff" /> Bahria Town Phase 8, RWP</p>
        </div>
      </div>
      <div style={styles.bottom}>
        © 2026 NA Fitness Club. Designed with ❤️ by [Saqlain]
      </div>
    </footer>
  );
};

const styles = {
  footer: { backgroundColor: '#050505', padding: '50px 5% 20px', borderTop: '2px solid #333', color: '#fff' },
  container: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '30px', maxWidth: '1200px', margin: '0 auto' },
  box: { flex: '1 1 250px' },
  title: { color: '#00ffff', marginBottom: '20px', fontSize: '1.2rem' },
  text: { color: '#aaa', fontSize: '0.9rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' },
  bottom: { textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #222', color: '#555', fontSize: '0.8rem' }
};

export default Footer;