import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import CategoryLabel from '../components/CategoryLabel';
import ContactCard from '../components/ContactCard';
import contactsData from '../data/contacts.json';

const ContactListPage = () => {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' arba 'desc'
  
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
        
        // Rūšiuojame kontaktus pagal abėcėlę
        filteredContacts = filteredContacts.sort((a, b) => {
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
      <div className="min-h-screen flex items-center justify-center bg-beige">
        <div className="animate-spin h-8 w-8 border-4 border-marine border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  // VKA bendruomenės specilinių grupių navigacija
  const renderVkaGroups = () => {
    if (community.id !== 'vka') return null;
    
    const groupIds = ['elniai', 'apuokai', 'zirgai', 'lokiai'];
    
    return (
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-harbor font-medium mb-3">Grupės</h3>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
              !groupIds.includes(activeTab)
                ? 'bg-teal text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                    ? 'bg-teal text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
    <div className="min-h-screen bg-beige">
      <header className="bg-white shadow-sm py-4">
        <div className="container-wide flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={community.logoPath} 
              alt={`${community.name} logotipas`} 
              className="h-8 mr-3"
            />
            <h1 className="text-xl font-semibold text-harbor">{community.name}</h1>
          </div>
          <button 
            onClick={handleLogout}
            className="text-gray-500 hover:text-gray-700"
          >
            Atsijungti
          </button>
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
            className="flex items-center px-4 py-2.5 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 text-sm font-medium text-gray-700"
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
        
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-4 overflow-x-auto pb-1">
            <button
              className={`pb-2 px-1 whitespace-nowrap ${
                activeTab === 'all'
                  ? 'text-teal border-b-2 border-teal font-medium'
                  : 'text-gray-500 hover:text-gray-700'
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
                      ? 'text-teal border-b-2 border-teal font-medium'
                      : 'text-gray-500 hover:text-gray-700'
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
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {category.contacts.map((contact) => (
                    <ContactCard 
                      key={contact.id} 
                      contact={contact} 
                      categoryName={category.name}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500 animate-fade-in">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
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
              <h3 className="mt-2 text-lg font-medium text-gray-900">Kontaktų nerasta</h3>
              <p className="mt-1 text-sm text-gray-500">
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