import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../core/types';
import { defaultUsers } from '@/core/datadefault';

interface UsersContextProps {
  users: User[];
  getUsers: () => User[];
  getUserById: (id: string) => User | undefined;
  createUser: (user: Omit<User, 'id' | 'friends'>) => User;
  updateUser: (id: string, data: Partial<User>) => User | undefined;
  deleteUser: (id: string) => void;
  addFriend: (userId: string, friendId: string) => void;
  removeFriend: (userId: string, friendId: string) => void;
}

const UsersContext = createContext<UsersContextProps | undefined>(undefined);

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>(defaultUsers);

  const getUsers = () => users;

  const getUserById = (id: string) => users.find(u => u.id === id);

  const createUser = (user: Omit<User, 'id' | 'friends'>): User => {
    const newUser: User = { ...user, id: Date.now().toString(), friends: [] };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const updateUser = (id: string, data: Partial<User>): User | undefined => {
    let updatedUser: User | undefined;
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        updatedUser = { ...u, ...data };
        return updatedUser;
      }
      return u;
    }));
    return updatedUser;
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const addFriend = (userId: string, friendId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId && !u.friends.includes(friendId)) {
        return { ...u, friends: [...u.friends, friendId] };
      }
      return u;
    }));
  };

  const removeFriend = (userId: string, friendId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, friends: u.friends.filter(fid => fid !== friendId) };
      }
      return u;
    }));
  };

  return (
    <UsersContext.Provider value={{ users, getUsers, getUserById, createUser, updateUser, deleteUser, addFriend, removeFriend }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) throw new Error('useUsers must be used within a UsersProvider');
  return context;
};
