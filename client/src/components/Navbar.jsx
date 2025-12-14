import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Home, PlusSquare, LogOut, User } from 'lucide-react'; // Icons

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Don't show Navbar if not logged in
  if (!user) return null;

  return (
    <nav style={styles.nav}>
      <div style={{ ...styles.container, ...styles.navContainer }}>
        <Link to="/" style={styles.logo}>Instagram Clone</Link>
        
        <div style={styles.links}>
          <Link to="/" title="Home"><Home size={24} color="black" /></Link>
          <Link to="/create" title="Create Post"><PlusSquare size={24} color="black" /></Link>
          <button onClick={handleLogout} style={styles.logoutBtn} title="Logout">
            <LogOut size={24} color="black" />
          </button>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: { borderBottom: '1px solid #dbdbdb', backgroundColor: 'white', position: 'sticky', top: 0, zIndex: 10 },
  container: { maxWidth: '935px', margin: '0 auto', padding: '0 20px' },
  navContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' },
  logo: { fontFamily: 'cursive', fontSize: '1.5rem', textDecoration: 'none', color: 'black' },
  links: { display: 'flex', gap: '20px', alignItems: 'center' },
  logoutBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: 0 }
};

export default Navbar;