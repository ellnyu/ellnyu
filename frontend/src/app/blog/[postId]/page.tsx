'use client';
import styles from './page.module.scss';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiGet } from '@/utils/api';
import { useRouter } from 'next/navigation';

type BlogPost = {
  id: number;
  title: string;
  content: string;
  images: string[]; // URLs of images
  author: string;
  createdAt: string;
  tags: string[];
  category: string;
};

export default function BlogPostPage() {
  const { postId } = useParams(); // dynamic route /blog/[postId]
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchPost = async () => {
    try {
      const data: BlogPost = await apiGet(`/blog/${postId}`);
      setPost(data);
    } catch (err) {
      console.error('Failed to fetch blog post', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  if (loading) return <p className={styles.loading}>Loading blog post...</p>;
  if (!post) return <p className={styles.notFound}>Blog post not found.</p>;

  return (
    <div className={styles.pageContainer}>
         <button
          className={styles.backButton}
          onClick={() => router.push('/blog')} // adjust to your blog overview route
        >
          ← Back to Blog Overview
        </button>   
      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className={styles.imagesContainer}>
            {post.images.map((imgUrl) => (
              <Image
                key={imgUrl}
                src={imgUrl}
                alt={`Blog image`}
                width={800}
                height={400}
                className={styles.blogImage}
              />
            ))}
       </div>
      )}

      {/* Title and metadata */}
      <h1 className={styles.blogTitle}>{post.title}</h1>
      <p className={styles.blogMeta}>
        By <strong>{post.author}</strong> |{' '}
        {new Date(post.createdAt).toLocaleDateString()} |{' '}
        <em>{post.category}</em>
      </p>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className={styles.tagsContainer}>
          {post.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <div className={styles.blogContent}>
        {post.content.split('\n').map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>
    </div>
  );
}

