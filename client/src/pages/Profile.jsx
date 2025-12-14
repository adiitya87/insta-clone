import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { User, Grid } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { username } = useParams(); // Get username from URL (e.g. /profile/john)
  const { user: currentUser } = useContext(AuthContext);
  
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  // If no username in URL, assume it's "my" profile
  const targetUsername = username || currentUser?.username;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // We need a backend endpoint to search by username. 
        // NOTE: For this mini-clone, we might need to adjust the backend to find by username 
        // or just pass ID. To keep it simple, let's assume we pass ID in URL or fetch 'me'.
        
        // For now, let's fetch "all users" and find this one (Simple hack for mini-projects)
        // OR better: Create a specific endpoint. 
        // Let's rely on the Feed for now, but here is a simple structure:
        
        // fetching dummy data structure for UI demonstration since we didn't make a specific "Get User Profile" API
        // In a real app, you would do: await API.get(`/users/${targetUsername}`);
        console.log("Fetching profile for", targetUsername);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [targetUsername]);

  const handleFollow = async () => {
    // Logic to call API.put(`/users/follow/${profileUser._id}`)
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? "Unfollowed" : "Followed");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.picPlaceholder}><User size={50} /></div>
        <div style={styles.info}>
          <h2 style={styles.username}>{targetUsername}</h2>
          <div style={styles.stats}>
            <span><b>{posts.length}</b> posts</span>
            <span><b>0</b> followers</span>
            <span><b>0</b> following</span>
          </div>
          
          {targetUsername !== currentUser?.username && (
            <button onClick={handleFollow} className="btn-primary" style={styles.followBtn}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
      </div>
      
      <hr style={{borderTop: '1px solid #dbdbdb', margin: '20px 0'}} />
      
      <div style={styles.grid}>
         {/* Posts grid would go here */}
         <div style={styles.emptyState}>
            <Grid size={40} color="#ccc" />
            <p>No posts yet</p>
         </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '935px', margin: '0 auto', padding: '30px 20px' },
  header: { display: 'flex', alignItems: 'center', marginBottom: '40px' },
  picPlaceholder: { width: '150px', height: '150px', borderRadius: '50%', background: '#dbdbdb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '50px' },
  info: { flex: 1 },
  username: { fontSize: '28px', fontWeight: '300', marginBottom: '20px' },
  stats: { display: 'flex', gap: '20px', marginBottom: '20px', fontSize: '16px' },
  followBtn: { maxWidth: '100px' },
  grid: { display: 'flex', justifyContent: 'center' },
  emptyState: { textAlign: 'center', color: '#8e8e8e' }
};

export default Profile;