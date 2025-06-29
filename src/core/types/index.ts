// Tipos de usuário
export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // senha em texto simples para demo
  avatar?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  friends: string[]; // lista de IDs de amigos
}

// Tipos de post/foto
export interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  caption?: string;
  likes: number;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

// Tipos de comentário
export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User; // Para incluir dados do usuário que comentou
}

// Tipos de like
export interface Like {
  id: string;
  postId: string;
  userId: string;
  createdAt: Date;
}

// Tipos para navegação
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Profile: { userId?: string };
  Gallery: { userId?: string };
};

// Tipos para formulários
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Tipos para upload de imagens
export interface ImageUpload {
  uri: string;
  type: string;
  name: string;
}

// Tipos para contexto de autenticação
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterFormData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}