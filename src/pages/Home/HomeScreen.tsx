import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Post } from '@/core/types';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/contexts/PostsContext';
import { useUsers } from '@/contexts/UsersContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

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
            <TouchableOpacity onPress={onComment}>
              <Text style={styles.moreComments}>
                Ver mais {post.comments.length - 2} comentários
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { posts, toggleLike, addPost } = usePosts();
  const { users } = useUsers();
  const [modalVisible, setModalVisible] = useState(false);
  const [newPostCaption, setNewPostCaption] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);

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

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setNewPostImage(result.assets[0].uri);
    }
  };

  const handleAddPost = () => {
    if (!user) return;
    if (!newPostCaption.trim()) {
      Alert.alert('Atenção', 'Digite uma legenda para a postagem!');
      return;
    }
    if (!newPostImage) {
      Alert.alert('Atenção', 'Selecione uma imagem para a postagem!');
      return;
    }
    addPost({
      userId: user.id,
      imageUrl: newPostImage,
      caption: newPostCaption,
      likedBy: [],
    });
    setNewPostCaption('');
    setNewPostImage(null);
    setModalVisible(false);
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
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            style={styles.headerIconButton}
          >
            <Text style={styles.headerIcon}>🏠</Text>
            <Text style={styles.headerIconLabel}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Friends')}
            style={styles.headerIconButton}
          >
            <Text style={styles.headerIcon}>👥</Text>
            <Text style={styles.headerIconLabel}>Amigos</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile', { userId: user?.id })}
            style={styles.headerIconButton}
          >
            <Text style={styles.headerIcon}>👤</Text>
            <Text style={styles.headerIconLabel}>Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.headerIconButton}>
            <Text style={styles.headerIcon}>🚪</Text>
            <Text style={styles.headerIconLabel}>Sair</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.headerIconButton}
          >
            <Text style={styles.headerIcon}>➕</Text>
            <Text style={styles.headerIconLabel}>Nova</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Modal de nova postagem */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Postagem</Text>
            <TouchableOpacity style={styles.imagePickerBtn} onPress={handlePickImage}>
              <Text style={styles.imagePickerBtnText}>Escolher imagem</Text>
            </TouchableOpacity>
            {newPostImage && (
              <Image
                source={{ uri: newPostImage }}
                style={styles.modalImage}
              />
            )}
            <TextInput
              style={styles.modalInput}
              placeholder="Digite uma legenda..."
              value={newPostCaption}
              onChangeText={setNewPostCaption}
              multiline
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => { setModalVisible(false); setNewPostImage(null); }}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleAddPost}>
                <Text style={styles.confirmButtonText}>Publicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingTop: 30,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 6,
    position: 'relative',
  },
  headerTitleWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: -1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#262626',
    textAlign: 'center',
  },
  headerIconButton: {
    alignItems: 'center',
    marginHorizontal: 4,
    padding: 4,
  },
  headerIcon: {
    fontSize: 22,
  },
  headerIconLabel: {
    fontSize: 11,
    color: '#444',
    marginTop: -2,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#262626',
  },
  modalImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#eee',
  },
  imagePickerBtn: {
    backgroundColor: '#0095f6',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  imagePickerBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    minHeight: 60,
    width: '100%',
    textAlignVertical: 'top',
    backgroundColor: '#fafafa',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dbdbdb',
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#8e8e93',
    fontSize: 16,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#0095f6',
    paddingVertical: 12,
    marginLeft: 10,
    borderRadius: 8,
  },
  confirmButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;