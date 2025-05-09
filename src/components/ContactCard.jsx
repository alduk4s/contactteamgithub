import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ContactCard = ({ contact, categoryName }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyAnimation, setCopyAnimation] = useState(false);
  const [allTags, setAllTags] = useState([]);
  
  const { firstName, lastName, phone, role, facebook } = contact;
  
  // Sudarome visus žymenis
  useEffect(() => {
    const tags = [];
    
    // Pridedame kategorijos žymenį
    if (categoryName) {
      const label = categoryName.replace(' grupė', '');
      const color = getGroupColor(categoryName);
      tags.push({ label, color });
    }
    
    // Pridedame rolės žymenį, jei yra
    if (role) {
      tags.push({ label: role, color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' });
    }
    
    setAllTags(tags);
  }, [categoryName, role]);
  
  // Formatuojame telefono numerį, kad būtų gražesnis
  const formattedPhone = phone ? phone.replace(/^(\+370)/, '+370 ') : '';
  
  // Kopijuojame numerį į iškarpinę
  const copyToClipboard = async () => {
    if (!phone) return;
    
    try {
      await navigator.clipboard.writeText(phone);
      setCopySuccess(true);
      setCopyAnimation(true);
      
      // Po 2 sekundžių pašaliname kopijavimo pranešimą
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
      
      // Po 300ms pašaliname animaciją
      setTimeout(() => {
        setCopyAnimation(false);
      }, 300);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
  
  // Skambina kontaktui
  const callContact = () => {
    if (!phone) return;
    window.location.href = `tel:${phone}`;
  };
  
  // Atidarome Facebook profilį
  const openFacebook = () => {
    if (facebook) {
      window.open(facebook, '_blank');
    }
  };
  
  // Grąžiname skirtingą spalvą pagal grupės pavadinimą
  const getGroupColor = (name) => {
    if (!name) return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    
    if (name.includes('Elnių')) return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
    if (name.includes('Apuokų')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (name.includes('Žirgų')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    if (name.includes('Lokių')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    if (name.includes('Vadovai')) return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
    if (name.includes('Nariai')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    
    return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  };
  
  // For debugging
  console.log('Kontaktas:', firstName, 'Kategorija:', categoryName, 'Rolė:', role);
  
  return (
    <motion.div
      className="card hover:shadow-medium transition-all"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center flex-wrap">
            <h3 className="font-semibold text-lg text-harbor dark:text-skyblue">
              {firstName} {lastName}
            </h3>
            
            {allTags.map((tag, index) => (
              <motion.span 
                key={index} 
                className={`ml-2 px-2 py-0.5 text-xs rounded-full ${tag.color}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                {tag.label}
              </motion.span>
            ))}
          </div>
          {phone && <p className="text-gray-600 dark:text-gray-400 mt-1">{formattedPhone}</p>}
        </div>
      </div>
      
      <div className="flex flex-col space-y-2 mt-4 md:flex-row md:space-y-0 md:space-x-2">
        {phone && (
          <div className="flex space-x-2 w-full">
            <motion.button
              onClick={copyToClipboard}
              className={`flex-1 btn-secondary text-sm flex items-center justify-center ${
                copyAnimation ? 'bg-teal dark:bg-marine text-white' : ''
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              aria-label="Kopijuoti telefono numerį"
            >
              <svg 
                className="w-5 h-5 mr-1" 
                style={{color: '#0ea5e9'}} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
              <motion.span
                key={copySuccess ? "copied" : "copy"}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.2 }}
              >
                {copySuccess ? 'Nukopijuota!' : 'Kopijuoti'}
              </motion.span>
            </motion.button>
            
            <motion.button
              onClick={callContact}
              className="flex-1 btn-primary text-sm flex items-center justify-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              aria-label="Skambinti kontaktui"
            >
              <svg 
                className="w-5 h-5 mr-1" 
                style={{color: '#0ea5e9'}} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Skambinti
            </motion.button>
          </div>
        )}
        
        {facebook && (
          <motion.button
            onClick={openFacebook}
            className="w-full btn-facebook text-sm flex items-center justify-center"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Atidaryti Facebook profilį"
          >
            <svg 
              className="w-5 h-5 mr-1" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z"
              />
            </svg>
            Facebook
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default ContactCard; 