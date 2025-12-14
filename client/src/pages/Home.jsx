import { useEffect, useState } from 'react';
import API from '../api/axios';
import PostCard from '../components/PostCard';
import { Loader } from 'lucide-react';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await API.get('/posts/feed');
        setPosts(data);
      } catch (error) {
        console.error("Error fetching feed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div style={styles.container}>
      {loading ? (
        <div style={styles.loading}><Loader className="spin" /></div>
      ) : posts.length > 0 ? (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      ) : (
        <div style={styles.empty}>
          <h2>No posts yet!</h2>
          <p>Follow some users or create a post to see it here.</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '470px', margin: '30px auto' },
  loading: { display: 'flex', justifyContent: 'center', marginTop: '50px' },
  empty: { textAlign: 'center', marginTop: '50px', color: '#8e8e8e' }
};

export default Home;