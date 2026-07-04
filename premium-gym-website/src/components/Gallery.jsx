import React from 'react';
import { motion } from 'framer-motion';

const Gallery = () => {
  const gymPhotos = [
    { src: "/gallary6.jpeg", isSideways: false }, // Neon Sign (Seedhi)
    { src: "/gallary1.jpeg", isSideways: true },
    { src: "/gallary2.jpeg", isSideways: true },
    { src: "/gallary3.jpeg", isSideways: true },
    { src: "/gallary4.jpeg", isSideways: true },
    { src: "/gallary5.jpeg", isSideways: true }
  ];

  return (
    <div id="gallery" style={{ padding: '60px 5%', backgroundColor: '#0a0a0a' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2rem', color: '#fff', textTransform: 'uppercase' }}>
          OUR <span style={{ color: '#FFD700' }}>GALLERY</span>
        </h2>
      </div>

      <div className="gallery-grid">
        {gymPhotos.map((photo, index) => (
          <motion.div 
            key={index}
            whileHover={{ scale: 1.02 }}
            className="gallery-item"
          >
            <img 
              src={photo.src} 
              alt="Gym" 
              className={photo.isSideways ? "gallery-img sideways-fix" : "gallery-img"} 
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;