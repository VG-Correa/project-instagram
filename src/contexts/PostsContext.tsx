import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Post, Comment, User } from '@/core/types';

interface PostsContextType {
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'comments'>) => void;
  editPost: (postId: string, data: Partial<Omit<Post, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'comments' | 'likes'>>) => void;
  deletePost: (postId: string) => void;
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  toggleLike: (postId: string, userId: string) => void;
  getUserPosts: (userId: string) => Post[];
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

interface PostsProviderProps {
  children: ReactNode;
}

export const PostsProvider: React.FC<PostsProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([
    // Posts de exemplo
    {
      id: '1',
      userId: '1',
      imageUrl: 'https://via.placeholder.com/400x400',
      caption: 'Primeira foto! 📸',
      likes: 5,
      comments: [
        {
          id: '1',
          postId: '1',
          userId: '2',
          content: 'Muito legal!',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      userId: '2',
      imageUrl: 'https://via.placeholder.com/400x400/ff6b6b',
      caption: 'Outro dia incrível!',
      likes: 3,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]);

  const addPost = (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'comments'>): void => {
    const newPost: Post = {
      ...postData,
      id: Date.now().toString(),
      likes: 0,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const editPost = (postId: string, data: Partial<Omit<Post, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'comments' | 'likes'>>) => {
    setPosts(prev => prev.map(post =>
      post.id === postId ? { ...post, ...data, updatedAt: new Date() } : post
    ));
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  const addComment = (postId: string, commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): void => {
    const newComment: Comment = {
      ...commentData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    ));
  };

  const toggleLike = (postId: string, userId: string): void => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        // Like/unlike real: só permite um like por usuário
        const liked = post.comments.some(c => c.userId === userId && c.content === '__LIKE__');
        if (liked) {
          // Remove like
          return {
            ...post,
            likes: Math.max(0, post.likes - 1),
            comments: post.comments.filter(c => !(c.userId === userId && c.content === '__LIKE__')),
          };
        } else {
          // Adiciona like
          return {
            ...post,
            likes: post.likes + 1,
            comments: [...post.comments, { id: Date.now().toString(), postId, userId, content: '__LIKE__', createdAt: new Date(), updatedAt: new Date() }],
          };
        }
      }
      return post;
    }));
  };

  const getUserPosts = (userId: string): Post[] => {
    return posts.filter(post => post.userId === userId);
  };

  const value: PostsContextType = {
    posts,
    addPost,
    editPost,
    deletePost,
    addComment,
    toggleLike,
    getUserPosts,
  };

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = (): PostsContextType => {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts deve ser usado dentro de um PostsProvider');
  }
  return context;
};