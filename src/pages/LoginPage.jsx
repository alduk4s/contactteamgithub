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
      <div className="container-narrow animate-fade-in">
        <div className="text-center mb-12">
          <img 
            src="/ContactTeam.png" 
            alt="ContactTeam logotipas" 
            className="w-32 h-32 mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold text-harbor">ContactTeam</h1>
        </div>
        
        <div className="bg-white rounded-xl shadow-medium p-6 md:p-8">
          <h2 className="text-xl font-semibold text-harbor mb-6">Prisijunk prie savo bendruomenės</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="loginCode" className="block text-sm font-medium text-gray-700 mb-1">
                Prisijungimo kodas
              </label>
              <input
                id="loginCode"
                type="text"
                className="input-field"
                placeholder="Įveskite prisijungimo kodą"
                value={loginCode}
                onChange={(e) => setLoginCode(e.target.value)}
                required
              />
            </div>
            
            {error && (
              <div className="text-red-500 text-sm py-1">{error}</div>
            )}
            
            <button
              type="submit"
              className="btn-primary w-full py-3 flex items-center justify-center"
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