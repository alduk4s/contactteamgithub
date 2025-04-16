import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { motion } from 'framer-motion';
import contactsData from '../data/contacts.json';
import { useTheme } from '../App';

const LoginPage = () => {
  const [loginCode, setLoginCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  
  // Nuorodos į modalinių langų DOM elementus
  const contactModalRef = useRef(null);
  const aboutModalRef = useRef(null);

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

  const toggleContactModal = () => {
    setShowContactModal(!showContactModal);
    if (showAboutModal) setShowAboutModal(false);
  };

  const toggleAboutModal = () => {
    setShowAboutModal(!showAboutModal);
    if (showContactModal) setShowContactModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-skyblue to-white dark:from-navy dark:to-depth p-4">
      {/* Tema perjungimo mygtukas */}
      <motion.button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 theme-toggle"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={darkMode ? "Įjungti šviesią temą" : "Įjungti tamsią temą"}
      >
        {darkMode ? (
          // Saulės ikona šviesiam režimui
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          // Mėnulio ikona tamsiam režimui
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </motion.button>

      <div className="container-narrow animate-fade-in flex flex-col items-center w-full">
        <motion.div 
          className="text-center mb-16"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img 
            src="/ContactTeam.png" 
            alt="ContactTeam logotipas" 
            className="w-80 h-80 mx-auto"
          />
        </motion.div>
        
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-medium p-6 md:p-8 max-w-md w-full"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-xl font-semibold text-harbor dark:text-skyblue text-center mb-8">Įveskite bendruomenės kodą</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg 
                  className="w-6 h-6" 
                  fill="black" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                  />
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
            
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: error ? 1 : 0,
                height: error ? 'auto' : 0
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {error && (
                <div className="text-red-500 dark:text-red-400 text-sm py-1 text-center">{error}</div>
              )}
            </motion.div>
            
            <motion.button
              type="submit"
              className="btn-primary w-full py-4 flex items-center justify-center text-base font-medium rounded-lg bg-teal hover:bg-marine dark:bg-marine dark:hover:bg-teal"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
            </motion.button>
          </form>
        </motion.div>
        
        <motion.div 
          className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p>Neturite prisijungimo kodo? Susisiekite su bendruomenės administracija.</p>
        </motion.div>

        {/* Mygtukai apačioje */}
        <motion.div 
          className="mt-16 flex justify-center space-x-6 w-full"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.button 
            onClick={toggleContactModal}
            className="px-6 py-4 bg-teal dark:bg-marine text-white rounded-lg shadow-md hover:shadow-lg transition-colors flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Kontaktai
          </motion.button>
          
          <motion.button 
            onClick={toggleAboutModal}
            className="px-6 py-4 bg-teal dark:bg-marine text-white rounded-lg shadow-md hover:shadow-lg transition-colors flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Apie mus
          </motion.button>
        </motion.div>
      </div>

      {/* Modalinis langas kontaktams */}
      <CSSTransition
        in={showContactModal}
        timeout={300}
        classNames="modal"
        unmountOnExit
        nodeRef={contactModalRef}
      >
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" ref={contactModalRef}>
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 md:p-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 25 }}
            exit={{ y: -20, opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-harbor dark:text-skyblue">Susisiekite su mumis</h2>
              <motion.button 
                onClick={toggleContactModal}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
            
            <div className="space-y-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-lg font-medium text-harbor dark:text-skyblue mb-3">Telefonu</h3>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-teal dark:text-teal mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <a href="tel:+37061658471" className="text-teal dark:text-teal hover:underline font-medium">
                      +370 616 58 471
                    </a>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-lg font-medium text-harbor dark:text-skyblue mb-3">El. paštu</h3>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-teal dark:text-teal mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <a href="mailto:pagalba.contactteam@gmail.com" className="text-teal dark:text-teal hover:underline font-medium">
                      pagalba.contactteam@gmail.com
                    </a>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-lg font-medium text-harbor dark:text-skyblue mb-3">Socialiniuose tinkluose</h3>
                <div className="flex space-x-4">
                  <motion.a 
                    href="https://www.facebook.com/profile.php?id=61575196801133&locale=lt_LT" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center text-teal dark:text-teal hover:underline"
                    whileHover={{ scale: 1.05 }}
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                    Facebook
                  </motion.a>
                  
                  <motion.a 
                    href="https://www.instagram.com/contactteam.lt/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center text-teal dark:text-teal hover:underline"
                    whileHover={{ scale: 1.05 }}
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                    Instagram
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </CSSTransition>

      {/* Modalinis langas apie mus */}
      <CSSTransition
        in={showAboutModal}
        timeout={300}
        classNames="modal"
        unmountOnExit
        nodeRef={aboutModalRef}
      >
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" ref={aboutModalRef}>
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full p-0 overflow-hidden max-h-[90vh]"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 25 }}
            exit={{ y: -20, opacity: 0 }}
          >
            {/* Viršutinė dalis su uždarymo mygtuku */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold text-harbor dark:text-skyblue">Apie mus</h2>
              <motion.button 
                onClick={toggleAboutModal}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
            
            {/* Turinys */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
              <div className="space-y-8 text-gray-700 dark:text-gray-300">
                {/* Įvadinė dalis */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-lg leading-relaxed">
                    <span className="font-semibold text-teal dark:text-skyblue">ContactTeam</span> – tai įrankis, skirtas padėti organizacijoms lengvai saugoti, rasti ir dalintis vidiniais kontaktais.
                  </p>
                </motion.div>
                
                {/* Istorija */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6"
                >
                  <p className="mb-4">
                    Viskas prasidėjo nuo mūsų – dviejų jaunuolių, aktyvių didelėje bendruomenėje. Dažnai susidurdavome su paprasta, bet erzinančia problema – prireikus kieno nors kontakto, tekdavo klausinėti aplink, ieškoti, gaišti laiką.
                  </p>
                  
                  <p>
                    Taip gimė mintis sukurti įrankį, kuris spręstų šią problemą – iš pradžių sau, o vėliau supratome, kad tokios sistemos reikia daugeliui komandų ir įmonių.
                  </p>
                </motion.div>
                
                {/* Kaip veikia */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <p className="mb-8">
                    <span className="font-semibold text-teal dark:text-skyblue">ContactTeam</span> leidžia greitai ir patogiai susirasti kolegų kontaktus, ypač kai prisijungi prie naujos organizacijos ar komandos. Nereikia klausinėti ar ieškoti – visi kontaktai vienoje vietoje, pasiekiami kiekvienam komandos nariui.
                  </p>
                </motion.div>
                
                {/* Mūsų vizija ir vertybės */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6"
                  >
                    <h3 className="text-xl font-semibold text-harbor dark:text-skyblue mb-4">
                      Mūsų vizija
                    </h3>
                    
                    <p>
                      Padėti organizacijoms supaprastinti vidinius procesus, kad jos galėtų susitelkti į svarbiausius darbus. Vidinės tvarkos rūpesčius palikite mums – mes pasirūpinsime, kad viskas veiktų aiškiai, paprastai ir efektyviai.
                    </p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6"
                  >
                    <h3 className="text-xl font-semibold text-harbor dark:text-skyblue mb-4">
                      Mūsų vertybės
                    </h3>
                    
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Paprastumas</li>
                      <li>Aiškumas</li>
                      <li>Efektyvumas</li>
                      <li>Bendruomeniškumas</li>
                    </ul>
                  </motion.div>
                </div>
                
                {/* Apie kūrėjus */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6"
                >
                  <h3 className="text-xl font-semibold text-harbor dark:text-skyblue mb-4">
                    Kas mes?
                  </h3>
                  
                  <p>
                    Mes – du jauni, ambicingi verslininkystės kelią pradedantys kūrėjai. Mums svarbu ne tik technologija, bet ir žmonės – kuriame su vertybėmis, atsakomybe ir tikslu augti kartu su savo klientais.
                  </p>
                </motion.div>
                
                {/* Kaip veikia ContactTeam */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6"
                >
                  <h3 className="text-xl font-semibold text-harbor dark:text-skyblue mb-4">
                    Kaip veikia ContactTeam?
                  </h3>
                  
                  <p className="mb-3">Dirbame B2B formatu – susisiekus su mumis, mes:</p>
                  <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>Sukelsime jūsų kontaktus į sistemą</li>
                    <li>Sukursime administratoriaus ir narių prisijungimus</li>
                    <li>Padėsime sklandžiai pereiti į sistemą</li>
                  </ul>
                </motion.div>
                
                {/* CTA dalis */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-gradient-to-r from-teal to-harbor dark:from-marine dark:to-navy text-white rounded-lg p-6 text-center"
                >
                  <p className="mb-5 text-lg">Palikite kontaktų chaosą mums – o patys susitelkite į tai, kas iš tiesų svarbu.</p>
                  
                  <motion.a 
                    href="mailto:pagalba.contactteam@gmail.com"
                    className="inline-block bg-white text-teal dark:bg-gray-800 px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Parašykite mums – ir pradėkime!
                  </motion.a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </CSSTransition>
    </div>
  );
};

export default LoginPage; 