import { Heart, MessageCircle, Send } from 'lucide-react';
import { useContext, useState } from 'react';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PostCard = ({ post }) => {
  const { user } = useContext(AuthContext);
  
  // State for Likes
  const [likes, setLikes] = useState(post.likes || []);
  const [isLiked, setIsLiked] = useState(post.likes.includes(user?._id || user?.id));
  
  // State for Comments (New additions)
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);

  // --- LIKE LOGIC ---
  const handleLike = async () => {
    try {
      // Optimistic UI Update (Update screen instantly)
      if (isLiked) {
        setLikes(likes.filter(id => id !== user._id));
      } else {
        setLikes([...likes, user._id]);
      }
      setIsLiked(!isLiked);

      // Send to Backend
      await API.put(`/posts/${post._id}/like`);
    } catch (error) {
      // Revert if error
      setIsLiked(!isLiked);
      console.error("Error liking post", error);
    }
  };

  // --- COMMENT LOGIC ---
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      // Send comment to backend
      await API.post(`/posts/${post._id}/comment`, { text: commentText });
      
      // Create a "fake" comment object to show immediately without refreshing
      const newComment = {
        user: { username: user.username }, 
        text: commentText,
      };

      setComments([...comments, newComment]);
      setCommentText(''); // Clear input
      toast.success('Comment added!');
    } catch (error) {
      console.error("Error commenting", error);
      toast.error("Failed to add comment");
    }
  };

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <img 
          src={post.author?.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
          alt="avatar" 
          style={styles.avatar} 
        />
        <span style={styles.username}>{post.author?.username || "Unknown"}</span>
      </div>

      {/* Image */}
      <img src={post.imageUrl} alt="post" style={styles.image} />

      {/* Action Buttons */}
      <div style={styles.actions}>
        <button onClick={handleLike} style={styles.actionBtn} title="Like">
          <Heart size={28} fill={isLiked ? "#ed4956" : "none"} color={isLiked ? "#ed4956" : "black"} />
        </button>
        
        {/* Toggle Comment Box on Click */}
        <button onClick={() => setShowCommentBox(!showCommentBox)} style={styles.actionBtn} title="Comment">
          <MessageCircle size={28} />
        </button>
      </div>

      {/* Post Content */}
      <div style={styles.content}>
        <div style={styles.likes}>{likes.length} likes</div>
        
        <div style={styles.caption}>
          <span style={styles.username}>{post.author?.username}</span> {post.caption}
        </div>

        {/* --- Display Comments List --- */}
        {comments.length > 0 && (
            <div style={styles.commentSection}>
                {comments.map((c, index) => (
                    <div key={index} style={styles.commentRow}>
                        <span style={styles.commentUser}>{c.user?.username}</span> {c.text}
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* --- Comment Input Box (Hidden by default) --- */}
      {showCommentBox && (
        <form onSubmit={handleCommentSubmit} style={styles.commentForm}>
          <input 
            type="text" 
            placeholder="Add a comment..." 
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            style={styles.commentInput}
          />
          <button type="submit" style={styles.postBtn} disabled={!commentText.trim()}>
            Post
          </button>
        </form>
      )}
    </div>
  );
};

// Styles
const styles = {
  card: { backgroundColor: 'white', border: '1px solid #dbdbdb', borderRadius: '3px', marginBottom: '20px' },
  header: { padding: '14px', display: 'flex', alignItems: 'center' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', marginRight: '10px', objectFit: 'cover' },
  username: { fontWeight: '600', fontSize: '14px', color: '#262626' },
  image: { width: '100%', display: 'block' },
  actions: { padding: '10px 16px', display: 'flex', gap: '15px' },
  actionBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: 0 },
  content: { padding: '0 16px 16px' },
  likes: { fontWeight: '600', marginBottom: '8px' },
  caption: { fontSize: '14px', marginBottom: '8px' },
  
  // New Styles for Comments
  commentSection: { marginTop: '10px', fontSize: '14px' },
  commentRow: { marginBottom: '4px' },
  commentUser: { fontWeight: '600', marginRight: '5px' },
  
  commentForm: { display: 'flex', borderTop: '1px solid #efefef', padding: '10px' },
  commentInput: { flex: 1, border: 'none', outline: 'none', fontSize: '14px' },
  postBtn: { background: 'none', border: 'none', color: '#0095f6', fontWeight: '600', cursor: 'pointer' }
};

export default PostCard;