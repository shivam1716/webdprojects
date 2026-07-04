import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const Testimonials = () => {
  const reviews = [
    { name: "Ali Ahmed", text: "Best gym in Bahria Town! The equipment is top-notch and the atmosphere is very motivating.", role: "Member" },
    { name: "Sana Khan", text: "The separate ladies hours (7 AM - 3 PM) are a blessing. Very safe and professional environment.", role: "Member" },
    { name: "Usman Pirzada", text: "The trainers here really know their stuff. Lost 5kg in just one month thanks to their guidance!", role: "Member" }
  ];

  return (
    /* Is ID ka hona zaroori hai Navbar ke link ke liye */
    <div id="reviews" style={{ padding: '80px 5%', backgroundColor: '#0a0a0a' }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h2 style={{ fontSize: '2.5rem', color: '#fff' }}>WHAT OUR <span style={{ color: '#00ffff' }}>MEMBERS SAY</span></h2>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {reviews.map((rev, index) => (
          <motion.div 
            key={index}
            whileHover={{ y: -10 }}
            style={{ backgroundColor: '#111', padding: '30px', borderRadius: '15px', width: '300px', border: '1px solid #333' }}
          >
            <Quote size={30} color="#FFD700" style={{ marginBottom: '15px' }} />
            <p style={{ color: '#ccc', fontStyle: 'italic', lineHeight: '1.6' }}>"{rev.text}"</p>
            <h4 style={{ color: '#00ffff', margin: '10px 0 0' }}>{rev.name}</h4>
            <small style={{ color: '#777' }}>{rev.role}</small>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;