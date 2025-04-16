import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import CategoryLabel from '../components/CategoryLabel';
import ContactCard from '../components/ContactCard';
import contactsData from '../data/contacts.json';
import { useTheme } from '../App';

const ContactListPage = () => {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' arba 'desc'
  const { darkMode, toggleDarkMode } = useTheme();
  
  useEffect(() => {
    // Ieškome bendruomenės pagal ID
    const foundCommunity = contactsData.communities.find(
      (comm) => comm.id === communityId
    );
    
    if (foundCommunity) {
      setCommunity(foundCommunity);
      filterContacts(foundCommunity, searchQuery, activeTab, sortOrder);
    } else {
      // Jei bendruomenė nerasta, grįžtame į prisijungimo puslapį
      navigate('/');
    }
  }, [communityId, navigate]);
  
  // Filtruojame ir rūšiuojame kontaktus
  const filterContacts = (comm, query, tab, order) => {
    if (!comm) return;
    
    const lowercaseQuery = query.toLowerCase();
    
    // Debug: įrašykime, kokius kontaktus apdorojame
    console.log('Filtering contacts with tab:', tab);
    
    // Filtruojame kategorijas ir jų kontaktus
    const filtered = comm.categories
      .map(category => {
        // Jei pasirinktas konkretus tabas (ne "all"), filtruojame tik pagal tą kategoriją
        if (tab !== 'all' && category.id !== tab) {
          return {
            ...category,
            contacts: []
          };
        }
        
        // Filtruojame kontaktus pagal paiešką
        let filteredContacts = category.contacts.filter(contact => 
          contact.firstName.toLowerCase().includes(lowercaseQuery) ||
          contact.lastName.toLowerCase().includes(lowercaseQuery) ||
          contact.phone.includes(lowercaseQuery)
        );
        
        // Pirma rūšiuojame pagal rolę - vadovai eina pirma
        filteredContacts = filteredContacts.sort((a, b) => {
          // Jei abu turi role arba abu neturi, rūšiuojame pagal abėcėlę
          const aIsLeader = a.role === "Vadovas";
          const bIsLeader = b.role === "Vadovas";
          
          if (aIsLeader && !bIsLeader) {
            return -1; // a eina prieš b
          } else if (!aIsLeader && bIsLeader) {
            return 1; // b eina prieš a
          }
          
          // Jei abu yra vadovai arba abu nėra vadovai, rūšiuojame pagal abėcėlę
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
          
          if (order === 'asc') {
            return nameA.localeCompare(nameB, 'lt');
          } else {
            return nameB.localeCompare(nameA, 'lt');
          }
        });
        
        return {
          ...category,
          contacts: filteredContacts
        };
      })
      .filter(category => category.contacts.length > 0);
    
    console.log('Filtered categories:', filtered.map(cat => cat.name));
    setFilteredCategories(filtered);
  };
  
  // Atnaujinama paieška ir rūšiavimas
  useEffect(() => {
    filterContacts(community, searchQuery, activeTab, sortOrder);
  }, [searchQuery, activeTab, sortOrder, community]);
  
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };
  
  const handleLogout = () => {
    navigate('/');
  };
  
  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };
  
  if (!community) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige dark:bg-depth">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }
  
  // VKA bendruomenės specilinių grupių navigacija
  const renderVkaGroups = () => {
    if (community.id !== 'vka') return null;
    
    const groupIds = ['elniai', 'apuokai', 'zirgai', 'lokiai'];
    
    return (
      <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <h3 className="text-harbor font-medium mb-3 dark:text-skyblue">Grupės</h3>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
              !groupIds.includes(activeTab)
                ? 'bg-teal dark:bg-marine text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => handleTabChange('all')}
          >
            Visos grupės
          </button>
          
          {community.categories
            .filter(category => groupIds.includes(category.id))
            .map((group) => (
              <button
                key={group.id}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                  activeTab === group.id
                    ? 'bg-teal dark:bg-marine text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => handleTabChange(group.id)}
              >
                {group.name}
              </button>
            ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-beige dark:bg-depth">
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4">
        <div className="container-wide flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={community.logoPath} 
              alt={`${community.name} logotipas`} 
              className="h-8 mr-3"
            />
            <h1 className="text-xl font-semibold text-harbor dark:text-skyblue">{community.name}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label={darkMode ? "Įjungti šviesią temą" : "Įjungti tamsią temą"}
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            <Link 
              to="/"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Atsijungti
            </Link>
          </div>
        </div>
      </header>
      
      <main className="container-wide py-6">
        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex-grow w-full">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
          <button
            onClick={toggleSortOrder}
            className="flex items-center px-4 py-2.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300"
            aria-label="Rūšiavimo tvarka"
          >
            <svg 
              className={`w-5 h-5 mr-2 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
              />
            </svg>
            {sortOrder === 'asc' ? 'A-Ž' : 'Ž-A'}
          </button>
        </div>
        
        {/* VKA specifinis grupių navigacijos komponentas */}
        {renderVkaGroups()}
        
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-4 overflow-x-auto pb-1">
            <button
              className={`pb-2 px-1 whitespace-nowrap ${
                activeTab === 'all'
                  ? 'text-teal dark:text-marine border-b-2 border-teal font-medium'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => handleTabChange('all')}
            >
              Visi
            </button>
            
            {community.categories
              .filter(category => !['elniai', 'apuokai', 'zirgai', 'lokiai'].includes(category.id) || community.id !== 'vka')
              .map((category) => (
                <button
                  key={category.id}
                  className={`pb-2 px-1 whitespace-nowrap ${
                    activeTab === category.id
                      ? 'text-teal dark:text-marine border-b-2 border-teal font-medium'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  onClick={() => handleTabChange(category.id)}
                >
                  {category.name}
                </button>
              ))}
          </div>
        </div>
        
        <div className="space-y-8">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <div key={category.id} className="animate-fade-in">
                <CategoryLabel name={category.name} />
                {console.log('Rendering category:', category.name, 'with', category.contacts.length, 'contacts')}
                
                {/* Grupuojame kontaktus pagal rolę - pirmiau rodome vadovus */}
                {category.contacts.some(c => c.role === "Vadovas") && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Grupės vadovai</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {category.contacts
                        .filter(contact => contact.role === "Vadovas")
                        .map((contact) => (
                          <ContactCard 
                            key={contact.id} 
                            contact={contact} 
                            categoryName={category.name}
                          />
                        ))}
                    </div>
                  </div>
                )}
                
                {/* Tada rodome likusius narius */}
                {category.contacts.some(c => c.role !== "Vadovas") && (
                  <div>
                    {category.contacts.some(c => c.role === "Vadovas") && (
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Nariai</h4>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {category.contacts
                        .filter(contact => contact.role !== "Vadovas")
                        .map((contact) => (
                          <ContactCard 
                            key={contact.id} 
                            contact={contact} 
                            categoryName={category.name}
                          />
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400 animate-fade-in">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">Kontaktų nerasta</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Pabandykite pakeisti paieškos užklausą arba pasirinkite kitą kategoriją.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ContactListPage; 