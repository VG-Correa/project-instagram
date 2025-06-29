import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Post } from '@/core/types';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/contexts/PostsContext';
import { useUsers } from '@/contexts/UsersContext';
import { SafeAreaView } from 'react-native-safe-area-context';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
}

const PostCard: React.FC<{ post: Post; onLike: () => void; onComment: () => void; onUserPress: (userId: string) => void; user: { avatar?: string; username: string }; isLiked: boolean; onImagePress: () => void }> = ({
  post,
  onLike,
  onComment,
  onUserPress,
  user,
  isLiked,
  onImagePress,
}) => {
  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => onUserPress(post.userId)}>
          <Image
            source={{ uri: user.avatar || 'https://via.placeholder.com/40' }}
            style={styles.avatar}
          />
          <Text style={styles.username}>{user.username}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onImagePress} activeOpacity={0.8}>
        <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
      </TouchableOpacity>
      <View style={styles.postActions}>
        <TouchableOpacity onPress={onLike} style={styles.actionButton}>
          <Text style={styles.actionText}>
            {isLiked ? '❤️' : '🤍'} {post.likedBy ? post.likedBy.length : 0}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onComment} style={styles.actionButton}>
          <Text style={styles.actionText}>💬 {post.comments.length}</Text>
        </TouchableOpacity>
      </View>
      {post.caption && (
        <View style={styles.caption}>
          <Text style={styles.captionText}>{post.caption}</Text>
        </View>
      )}
      {post.comments.length > 0 && (
        <View style={styles.comments}>
          {post.comments.slice(0, 2).map((comment) => (
            <Text key={comment.id} style={styles.commentText}>
              <Text style={styles.username}>comentário</Text> {comment.content}
            </Text>
          ))}
          {post.comments.length > 2 && (
            <Text style={styles.moreComments}>
              Ver mais {post.comments.length - 2} comentários
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { posts, toggleLike } = usePosts();
  const { users } = useUsers();

  // IDs dos amigos do usuário logado
  const friendIds = user?.friends || [];
  // Inclui o próprio usuário no feed
  const feedUserIds = [user?.id, ...friendIds].filter(Boolean);
  // Filtra posts dos amigos e do próprio usuário
  const feedPosts = posts.filter(post => feedUserIds.includes(post.userId));

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  const handleLike = (postId: string) => {
    if (user) {
      toggleLike(postId, user.id);
    }
  };

  const handleComment = (postId: string) => {
    // Implementar modal de comentários ou navegação para detalhes
    navigation.navigate('PostDetail', { postId });
  };

  const handleUserPress = (userId: string) => {
    if (userId === user?.id) {
      navigation.navigate('Profile', { userId });
    } else {
      navigation.navigate('UserProfile', { userId });
    }
  };

  const handleImagePress = (postId: string) => {
    navigation.navigate('PostDetail', { postId });
  };

  const renderPost = ({ item }: { item: Post }) => {
    const postUser = users.find(u => u.id === item.userId) || { username: 'Usuário', avatar: undefined };
    const isLiked = item.likedBy ? item.likedBy.includes(user?.id || '') : false;
    return (
      <PostCard
        post={item}
        onLike={() => handleLike(item.id)}
        onComment={() => handleComment(item.id)}
        onUserPress={handleUserPress}
        user={postUser}
        isLiked={isLiked}
        onImagePress={() => handleImagePress(item.id)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Instagram Clone</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile', { userId: user?.id })}
              style={styles.headerButton}
            >
              <Text style={styles.headerButtonText}>👤</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>🚪</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {feedPosts.length === 0 ? (
        <View style={styles.emptyFeedContainer}>
          <Text style={styles.emptyFeedText}>Nenhuma publicação encontrada dos seus amigos.</Text>
        </View>
      ) : (
        <FlatList
          data={feedPosts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.feed}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerWrapper: {
    backgroundColor: '#fff',
    paddingTop: 30, // aumenta o padding para evitar sobreposição com notch/câmera
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#262626',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 15,
  },
  headerButtonText: {
    fontSize: 20,
  },
  feed: {
    paddingBottom: 20,
  },
  postCard: {
    marginBottom: 20,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: '600',
    color: '#262626',
  },
  postImage: {
    width: '100%',
    height: 400,
  },
  postActions: {
    flexDirection: 'row',
    padding: 10,
  },
  actionButton: {
    marginRight: 15,
  },
  actionText: {
    fontSize: 16,
  },
  caption: {
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  captionText: {
    fontSize: 14,
    color: '#262626',
  },
  comments: {
    paddingHorizontal: 10,
  },
  commentText: {
    fontSize: 14,
    color: '#262626',
    marginBottom: 2,
  },
  moreComments: {
    fontSize: 14,
    color: '#8e8e93',
    marginTop: 2,
  },
  emptyFeedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyFeedText: {
    fontSize: 18,
    color: '#8e8e93',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default HomeScreen;