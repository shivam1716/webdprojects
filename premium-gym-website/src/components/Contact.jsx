import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';

const Contact = () => {
  return (
    <div id="contact" style={styles.section}>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        style={styles.header}
      >
        <h2 style={styles.title}>GET IN <span style={{ color: '#00ffff' }}>TOUCH</span></h2>
        <p style={styles.subtitle}>Ready to start? Visit us or drop a message!</p>
      </motion.div>

      <div style={styles.container}>
        {/* Contact Details Box */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={styles.infoWrapper}
        >
          <div style={styles.infoItem}>
            <MapPin size={30} color="#FFD700" />
            <div>
              <h4 style={styles.infoTitle}>Location</h4>
              <p style={styles.infoText}>Bahria Town Phase 8, Rawalpindi</p>
            </div>
          </div>

          <div style={styles.infoItem}>
            <Phone size={30} color="#00ffff" />
            <div>
              <h4 style={styles.infoTitle}>Phone</h4>
              <p style={styles.infoText}>0320 1575095</p>
            </div>
          </div>

          <div style={styles.infoItem}>
            <Mail size={30} color="#FFD700" />
            <div>
              <h4 style={styles.infoTitle}>Email</h4>
              <p style={styles.infoText}>info@nafitnessclub.com</p>
            </div>
          </div>

          {/* Social Icons */}
          <div style={styles.socialContainer}>
            {/* Instagram */}
            <a href="https://www.instagram.com/nafitnessclub" target="_blank" rel="noreferrer" style={styles.socialIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            {/* WhatsApp - Updated US Number */}
            <a href="https://wa.me/16142093441" target="_blank" rel="noreferrer" style={{...styles.socialIcon, color: '#25D366'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </a>
          </div>
        </motion.div>

        {/* Map Box */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={styles.mapWrapper}
        >
          <iframe 
            title="NA Fitness Club Official Location"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6654.218040052943!2d73.0775566!3d33.4985406!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38df8d70bf463643%3A0xc24c26f7f1d26366!2sNA%20Fitness%20Club!5e0!3m2!1sen!2s!4v1776542166077!5m2!1sen!2s" 
            width="100%" 
            height="100%" 
            style={{ border: 0, borderRadius: '15px' }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>
      </div>
    </div>
  );
};

const styles = {
  section: { padding: '80px 5% 40px', backgroundColor: '#111', color: '#fff' },
  header: { textAlign: 'center', marginBottom: '50px' },
  title: { fontSize: '3rem', fontWeight: 'bold', letterSpacing: '2px', margin: 0 },
  subtitle: { color: '#888', fontSize: '1.2rem', marginTop: '10px' },
  container: { display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'space-between' },
  infoWrapper: { flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '30px', backgroundColor: '#1a1a1a', padding: '40px', borderRadius: '15px', border: '1px solid #333' },
  infoItem: { display: 'flex', alignItems: 'center', gap: '20px' },
  infoTitle: { margin: 0, fontSize: '1.2rem', color: '#fff' },
  infoText: { margin: '5px 0 0', color: '#aaa', fontSize: '1rem' },
  socialContainer: { display: 'flex', gap: '15px', marginTop: '20px' },
  socialIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '45px', height: '45px', backgroundColor: '#333', color: '#00ffff', borderRadius: '50%', textDecoration: 'none', transition: '0.3s' },
  mapWrapper: { flex: '1 1 400px', minHeight: '400px', borderRadius: '15px', overflow: 'hidden', border: '1px solid #333' }
};

export default Contact;