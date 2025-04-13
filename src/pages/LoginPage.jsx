import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import contactsData from '../data/contacts.json';

const LoginPage = () => {
  const [loginCode, setLoginCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simuliuojame trumpą užkrovimą, kad būtų matoma animacija
    setTimeout(() => {
      const community = contactsData.communities.find(
        (comm) => comm.loginCode === loginCode.trim()
      );
      
      if (community) {
        // Nukreipiame į bendruomenės kontaktų puslapį
        navigate(`/community/${community.id}`);
      } else {
        setError('Neteisingas prisijungimo kodas. Bandykite dar kartą.');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-skyblue to-white p-4">
      <div className="container-narrow animate-fade-in flex flex-col items-center w-full">
        <div className="text-center mb-16">
          <img 
            src="/ContactTeam.png" 
            alt="ContactTeam logotipas" 
            className="w-64 h-64 mx-auto"
          />
        </div>
        
        <div className="bg-white rounded-xl shadow-medium p-6 md:p-8 max-w-md w-full">
          <h2 className="text-xl font-semibold text-harbor text-center mb-8">Įveskite bendruomenės kodą</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <input
                id="loginCode"
                type="text"
                className="input-field pl-10"
                placeholder="Prisijungimo kodas"
                value={loginCode}
                onChange={(e) => setLoginCode(e.target.value)}
                required
              />
            </div>
            
            {error && (
              <div className="text-red-500 text-sm py-1 text-center">{error}</div>
            )}
            
            <button
              type="submit"
              className="btn-primary w-full py-4 flex items-center justify-center text-base font-medium rounded-lg bg-teal hover:bg-marine"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Prisijungiama...
                </span>
              ) : (
                'Prisijungti'
              )}
            </button>
          </form>
        </div>
        
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Neturite prisijungimo kodo? Susisiekite su bendruomenės administracija.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 