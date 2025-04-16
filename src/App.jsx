import { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import LoginPage from './pages/LoginPage';
import ContactListPage from './pages/ContactListPage';

// Tema kontekstas
export const ThemeContext = createContext();

// Temos prieinamumo hook'as
export const useTheme = () => useContext(ThemeContext);

// Temos tiekėjo komponentas
const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Patikriname, ar naršyklė palaiko localStorage
    if (typeof localStorage !== 'undefined') {
      // Bandome gauti išsaugotą temos nustatymą
      const savedMode = localStorage.getItem('darkMode');
      
      // Jei rastas išsaugotas nustatymas, jį naudojame
      if (savedMode !== null) {
        return savedMode === 'true';
      }
      
      // Jei ne, tikriname naršyklės numatytuosius nustatymus
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return true;
      }
    }
    
    // Numatytai grąžiname šviesų režimą
    return false;
  });

  // Funkcija temos perjungimui
  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode.toString());
      return newMode;
    });
  };

  // Effect'as, kuris prideda/pašalina 'dark' klasę HTML elementui
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Animuotas maršrutų komponentas
function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <TransitionGroup component={null}>
      <CSSTransition
        key={location.key}
        timeout={300}
        classNames="page-transition"
        unmountOnExit
      >
        <div className="page-wrapper">
          <Routes location={location}>
            <Route path="/" element={<LoginPage />} />
            <Route path="/community/:communityId" element={<ContactListPage />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AnimatedRoutes />
    </ThemeProvider>
  );
}

export default App; 