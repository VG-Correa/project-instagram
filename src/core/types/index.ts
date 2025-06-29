// Tipos de usuário
export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // senha em texto simples para demo
  avatar?: string;
  cover?: string; // nova propriedade para capa
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
  likedBy: string[]; // IDs dos usuários que curtiram
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
  likedBy: string[]; // IDs dos usuários que curtiram o comentário
  parentId?: string; // Para hierarquia de respostas
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
  UserProfile: { userId: string };
  PostDetail: { postId: string };
  Friends: undefined; // Adicionada rota de amigos
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

// Corrige import para o caminho correto:
import UserProfileScreen from '@/pages/Profile/UserProfileScreen';