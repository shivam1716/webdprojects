import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Activity, Heart } from 'lucide-react';

const Facilities = () => {
  // Services ka data taake code clean rahay
  const services = [
    {
      title: "Strength & Conditioning",
      desc: "Top-of-the-line equipment for muscle building and strength training.",
      icon: <Dumbbell size={40} color="#FFD700" />
    },
    {
      title: "Yoga & Pilates",
      desc: "Relax your mind and build core strength in our dedicated studio.",
      icon: <Heart size={40} color="#00ffff" />
    },
    {
      title: "Full Body Workout",
      desc: "Comprehensive workout zones designed for ultimate fitness results.",
      icon: <Activity size={40} color="#FFD700" />
    }
  ];

  return (
    <div id="facilities" style={styles.section}>
      {/* Animated Title */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }} // Jab scroll kar ke yahan pohnchenge tab animate hoga
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        style={styles.header}
      >
        <h2 style={styles.title}>OUR <span style={{ color: '#00ffff' }}>FACILITIES</span></h2>
        <p style={styles.subtitle}>Experience fitness like never before at NA Fitness Club</p>
      </motion.div>

      {/* Services Grid */}
      <div style={styles.gridContainer}>
        {services.map((service, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, borderColor: '#00ffff' }} // Mouse upar aane par pop hoga aur border blue hoga
            style={styles.card}
          >
            <div style={styles.iconBox}>{service.icon}</div>
            <h3 style={styles.cardTitle}>{service.title}</h3>
            <p style={styles.cardDesc}>{service.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  section: {
    padding: '80px 5%',
    backgroundColor: '#0a0a0a', // Gym ka dark theme
    color: '#fff',
  },
  header: {
    textAlign: 'center',
    marginBottom: '60px',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    letterSpacing: '2px',
    margin: 0,
  },
  subtitle: {
    color: '#888',
    fontSize: '1.2rem',
    marginTop: '10px',
  },
  gridContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '30px',
  },
  card: {
    backgroundColor: '#111',
    padding: '40px 30px',
    borderRadius: '15px',
    width: '300px',
    textAlign: 'center',
    border: '1px solid #333',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
  },
  iconBox: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: '1.5rem',
    color: '#fff',
    marginBottom: '15px',
  },
  cardDesc: {
    color: '#aaa',
    lineHeight: '1.6',
  }
};

export default Facilities;