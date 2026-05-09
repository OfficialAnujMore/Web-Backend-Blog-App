import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { blogApi } from '../utils/blogApi';
import { estimateReadTime } from '../utils/blogUtils';

function TagBrowse() {
  const { tag } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBlogs = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await blogApi.listPublished({ tag: tag || '' });
        setBlogs(data.blogs || []);
      } catch (err) {
        setError(err.message || 'Failed to load posts for this tag.');
      } finally {
        setLoading(false);
      }
    };
    loadBlogs();
  }, [tag]);

  return (
    <main className="page-content blog-page tag-browse-page">
      <section className="tag-browse-header">
        <div className="tag-browse-top-row">
          <Link to="/" className="btn-browse-link">← Back to Home</Link>
          <div>
            <h1>{tag ? `Tag: ${tag}` : 'Browse Posts by Tag'}</h1>
            <p className="section-subtitle">
              {tag
                ? `Published posts tagged with “${tag}”.`
                : 'Find published posts using any tag from the site.'}
            </p>
          </div>
        </div>
      </section>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="home-published-empty">
          <div className="loading-spinner" />
          <p>Loading posts…</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="home-published-empty">
          <div className="empty-icon">🔎</div>
          <h3>{tag ? `No posts found for “${tag}”` : 'No published posts found.'}</h3>
          <p>
            {tag
              ? 'Try a different tag or return to the homepage to explore more stories.'
              : 'There are currently no published posts available.'}
          </p>
        </div>
      ) : (
        <div className="tag-browse-grid">
          {blogs.map((blog) => (
            <article key={blog.id} className="tag-browse-card">
              {blog.thumbnailUrl && (
                <div className="tag-browse-thumb">
                  <img src={blog.thumbnailUrl} alt={blog.title} />
                </div>
              )}
              <div className="tag-browse-card-body">
                <div className="tag-browse-card-meta">
                  <span>{estimateReadTime(blog)} min read</span>
                  <span className="meta-dot">·</span>
                  <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                </div>
                <h2>{blog.title}</h2>
                <p>{blog.summary || 'No summary available.'}</p>
                <div className="tag-browse-footer-row">
                  <div className="tag-browse-tags">
                    {blog.tags?.slice(0, 2).map((item) => (
                      <Link key={item} to={`/tags/${item}`} className="tag-chip tag-chip-link">
                        {item}
                      </Link>
                    ))}
                  </div>
                  <Link to={`/blogs/public/${blog.id}`} className="btn-link">Read story</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default TagBrowse;
