import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Post, Comment, User } from '@/core/types';
import { defaultPosts } from '@/core/datadefault';

interface PostsContextType {
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'comments'>) => void;
  editPost: (postId: string, data: Partial<Omit<Post, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'comments' | 'likes'>>) => void;
  deletePost: (postId: string) => void;
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  toggleLike: (postId: string, userId: string) => void;
  getUserPosts: (userId: string) => Post[];
  toggleCommentLike: (postId: string, commentId: string, userId: string) => void;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

interface PostsProviderProps {
  children: ReactNode;
}

export const PostsProvider: React.FC<PostsProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>(defaultPosts.map(post => ({
    ...post,
    likedBy: post.likedBy || [],
    likes: post.likedBy ? post.likedBy.length : post.likes || 0,
  })));

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

  const addComment = (postId: string, commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'likedBy'>): void => {
    const newComment: Comment = {
      ...commentData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      likedBy: [],
      parentId: commentData.parentId,
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
        const alreadyLiked = post.likedBy.includes(userId);
        return {
          ...post,
          likedBy: alreadyLiked
            ? post.likedBy.filter(id => id !== userId)
            : [...post.likedBy, userId],
          likes: alreadyLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));
  };

  const toggleCommentLike = (postId: string, commentId: string, userId: string): void => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(comment => {
            if (comment.id === commentId) {
              const alreadyLiked = comment.likedBy.includes(userId);
              return {
                ...comment,
                likedBy: alreadyLiked
                  ? comment.likedBy.filter(id => id !== userId)
                  : [...comment.likedBy, userId],
              };
            }
            return comment;
          })
        };
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
    toggleCommentLike,
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