import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogApi } from '../utils/blogApi';
import { estimateReadTime } from '../utils/blogUtils';

function RelatedPosts({ tags = [], currentBlogId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRelated = async () => {
      if (!tags?.length) {
        setPosts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const tag = String(tags[0]).trim();
        if (!tag) {
          setPosts([]);
          return;
        }

        const data = await blogApi.listPublished({ tag });
        const related = (data.blogs || [])
          .filter((post) => post.id !== currentBlogId)
          .slice(0, 4);

        setPosts(related);
      } catch (err) {
        setError(err.message || 'Could not load related posts.');
      } finally {
        setLoading(false);
      }
    };
    fetchRelated();
  }, [tags, currentBlogId]);

  if (!tags?.length || (!loading && posts.length === 0 && !error)) {
    return null;
  }

  return (
    <section className="related-posts-section">
      <div className="related-posts-heading">
        <h2>Related posts</h2>
        <p>More published stories that share the same tag.</p>
      </div>
      {loading && <div className="related-posts-loading">Loading related posts…</div>}
      {error && <div className="error-message related-posts-error">{error}</div>}
      {posts.length > 0 && (
        <div className="related-posts-list">
          {posts.map((post) => (
            <article key={post.id} className="related-post-card">
              <Link to={`/blogs/public/${post.id}`} className="related-post-card-link">
                {post.thumbnailUrl ? (
                  <div className="related-post-thumb">
                    <img src={post.thumbnailUrl} alt={post.title} />
                  </div>
                ) : (
                  <div className="related-post-thumb related-post-thumb-fallback" />
                )}
                <div className="related-post-card-body">
                  <div className="related-post-card-meta">
                    <span className="related-post-readtime">{estimateReadTime(post)} min read</span>
                    <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <h3>{post.title || 'Untitled post'}</h3>
                  <p>{post.summary || 'No summary available.'}</p>
                  {post.tags?.length > 0 && (
                    <div className="related-post-card-tags">
                      <span className="tag-chip">{post.tags[0]}</span>
                    </div>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default RelatedPosts;
