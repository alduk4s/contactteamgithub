import { useState } from 'react';

const ContactCard = ({ contact, categoryName }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyAnimation, setCopyAnimation] = useState(false);
  
  const { firstName, lastName, phone } = contact;
  
  // Formatuojame telefono numerį, kad būtų gražesnis
  const formattedPhone = phone.replace(/^(\+370)/, '+370 ');
  
  // Kopijuojame numerį į iškarpinę
  const copyToClipboard = async () => {
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
    window.location.href = `tel:${phone}`;
  };
  
  // Pakeičiame grupės pavadinimą į pavadinimą be žodžio "grupė"
  const getGroupLabel = (name) => {
    if (!name) return '';
    return name.replace(' grupė', '');
  };
  
  // Grąžiname skirtingą spalvą pagal grupės pavadinimą
  const getGroupColor = (name) => {
    if (!name) return 'bg-gray-100 text-gray-700';
    
    if (name.includes('Elnių')) return 'bg-amber-100 text-amber-800';
    if (name.includes('Apuokų')) return 'bg-green-100 text-green-800';
    if (name.includes('Žirgų')) return 'bg-blue-100 text-blue-800';
    if (name.includes('Lokių')) return 'bg-purple-100 text-purple-800';
    if (name.includes('Mentoriai')) return 'bg-red-100 text-red-800';
    if (name.includes('Vadovai')) return 'bg-indigo-100 text-indigo-800';
    
    return 'bg-gray-100 text-gray-700';
  };
  
  // For debugging: remove this in production
  console.log('Rendering ContactCard with categoryName:', categoryName);
  
  return (
    <div className="card hover:shadow-medium transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center">
            <h3 className="font-semibold text-lg text-harbor">
              {firstName} {lastName}
            </h3>
            {categoryName && (
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getGroupColor(categoryName)}`}>
                {getGroupLabel(categoryName)}
              </span>
            )}
          </div>
          <p className="text-gray-600 mt-1">{formattedPhone}</p>
        </div>
      </div>
      
      <div className="flex space-x-2 mt-4">
        <button
          onClick={copyToClipboard}
          className={`flex-1 btn-secondary text-sm flex items-center justify-center ${
            copyAnimation ? 'bg-teal text-white' : ''
          }`}
          aria-label="Kopijuoti telefono numerį"
        >
          <svg 
            className="w-4 h-4 mr-2" 
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
          {copySuccess ? 'Nukopijuota!' : 'Kopijuoti'}
        </button>
        
        <button
          onClick={callContact}
          className="flex-1 btn-primary text-sm flex items-center justify-center"
          aria-label="Skambinti kontaktui"
        >
          <svg 
            className="w-4 h-4 mr-2" 
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
        </button>
      </div>
    </div>
  );
};

export default ContactCard; 