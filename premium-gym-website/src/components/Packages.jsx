import React from 'react';
import { motion } from 'framer-motion';

const Packages = () => {
  const plans = [
    { 
      name: 'Standard Registration', 
      price: 'Rs. 7000', 
      features: ['Entry Fee Applicable', 'Access to Gym', 'Standard Guidance'], 
      btnText: 'Join Now',
      isPopular: false
    },
    { 
      name: 'Special Limited Offer', 
      price: 'Rs. 5000', 
      features: ['Entry Fee FULLY WAIVED!', 'First Month Fee Only Rs.5000', 'Valid: 25 Apr - 31 May', 'Save Rs. 2000!'], 
      btnText: 'Grab Offer Now', 
      isPopular: true 
    },
    { 
      name: 'Group Discount (5 Friends)', 
      price: 'Rs. 1000 OFF', 
      features: ['Bring 5 Friends (Male/Female)', 'Get PKR 1000 OFF Fee for EVERYONE!', 'Join Together & Save Big!'], 
      btnText: 'Register Group',
      isPopular: false
    }
  ];

  return (
    <div id="packages" style={{ padding: '80px 5%', backgroundColor: '#111', color: '#fff' }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', letterSpacing: '2px' }}>
          OUR <span style={{ color: '#00ffff' }}>PACKAGES</span>
        </h2>
        <p style={{ color: '#888', marginTop: '10px' }}>Join NA Fitness Club & Kickstart Your Journey!</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        {plans.map((plan, index) => (
          <motion.div 
            key={index}
            whileHover={{ y: -10 }}
            style={{ 
              backgroundColor: '#1a1a1a', 
              padding: '40px 30px', 
              borderRadius: '15px', 
              width: '320px', /* Thori chaurayi (width) barha di taake text fit aye */
              textAlign: 'center', 
              border: plan.isPopular ? '2px solid #FFD700' : '1px solid #333',
              position: 'relative'
            }}
          >
            {/* Most Popular Tag */}
            {plan.isPopular && (
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#FFD700', color: '#000', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.8rem' }}>
                BEST VALUE
              </div>
            )}
            
            <h3 style={{ fontSize: '1.4rem', marginBottom: '15px', color: plan.isPopular ? '#FFD700' : '#fff' }}>{plan.name}</h3>
            
            {/* Price section with strike-through for the special offer */}
            <h2 style={{ fontSize: '2.5rem', marginBottom: '5px', color: '#00ffff' }}>{plan.price}</h2>
            {plan.isPopular && <p style={{textDecoration: 'line-through', color: '#888', marginBottom: '15px'}}>Instead of Rs. 7000</p>}
            
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px', color: '#ccc', lineHeight: '2' }}>
              {plan.features.map((feat, i) => (
                <li key={i} style={{fontWeight: feat.includes('WAIVED') || feat.includes('OFF') ? 'bold' : 'normal', color: feat.includes('WAIVED') || feat.includes('OFF') ? '#FFD700' : '#ccc'}}>
                  {feat}
                </li>
              ))}
            </ul>
            
            {/* Yahan naya WhatsApp Link lagaya gaya hai */}
            <a 
              href="https://wa.me/16142093441" 
              target="_blank" 
              rel="noreferrer" 
              style={{ 
                display: 'inline-block', 
                backgroundColor: plan.isPopular ? '#FFD700' : 'transparent', 
                color: plan.isPopular ? '#000' : '#fff', 
                border: plan.isPopular ? 'none' : '2px solid #00ffff', 
                padding: '10px 25px', 
                borderRadius: '25px', 
                textDecoration: 'none', 
                fontWeight: 'bold',
                transition: '0.3s'
              }}
            >
              {plan.btnText}
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Packages;