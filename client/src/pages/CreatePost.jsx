import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';

const CreatePost = () => {
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageUrl) {
      return toast.error("Please provide an Image URL");
    }

    setLoading(true);
    try {
      // Send data to backend
      await API.post('/posts', {
        caption,
        imageUrl,
      });

      toast.success('Post shared successfully!');
      navigate('/'); // Redirect to Home Feed to see the new post
    } catch (error) {
      console.error(error);
      toast.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create New Post</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Image URL</label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
              style={styles.input}
            />
            <small style={{color: '#8e8e8e'}}>
              Tip: Right-click an image on Google and select "Copy Image Address"
            </small>
          </div>

          {/* Image Preview (Shows up if user pastes a link) */}
          {imageUrl && (
            <div style={styles.previewContainer}>
              <img src={imageUrl} alt="Preview" style={styles.previewImage} 
                   onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Caption</label>
            <textarea
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              style={styles.textarea}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Sharing...' : 'Share'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', marginTop: '40px' },
  card: { backgroundColor: 'white', border: '1px solid #dbdbdb', padding: '30px', width: '100%', maxWidth: '500px', borderRadius: '3px' },
  title: { textAlign: 'center', marginBottom: '20px', fontWeight: '600' },
  formGroup: { marginBottom: '15px' },
  label: { display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' },
  input: { width: '100%', padding: '10px', border: '1px solid #dbdbdb', borderRadius: '3px' },
  textarea: { width: '100%', padding: '10px', border: '1px solid #dbdbdb', borderRadius: '3px', minHeight: '80px', resize: 'vertical' },
  previewContainer: { margin: '10px 0', textAlign: 'center', backgroundColor: '#fafafa', padding: '10px' },
  previewImage: { maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }
};

export default CreatePost;