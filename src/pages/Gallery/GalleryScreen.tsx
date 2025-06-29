import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Post } from '@/core/types';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/contexts/PostsContext';

type GalleryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Gallery'>;
type GalleryScreenRouteProp = RouteProp<RootStackParamList, 'Gallery'>;

interface GalleryScreenProps {
  navigation: GalleryScreenNavigationProp;
  route: GalleryScreenRouteProp;
}

const GalleryScreen: React.FC<GalleryScreenProps> = ({ navigation, route }) => {
  const { user } = useAuth();
  const { getUserPosts, addPost } = usePosts();
  const [modalVisible, setModalVisible] = useState(false);
  const [newPostCaption, setNewPostCaption] = useState('');
  
  const userId = route.params?.userId || user?.id;
  const userPosts = userId ? getUserPosts(userId) : [];

  const handleAddPost = () => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para adicionar posts');
      return;
    }

    // Simulação de upload de imagem
    const newPost = {
      userId: user.id,
      imageUrl: 'https://via.placeholder.com/400x400/4ecdc4',
      caption: newPostCaption,
      likes: 0,
      comments: [],
    };

    addPost(newPost);
    setNewPostCaption('');
    setModalVisible(false);
    Alert.alert('Sucesso', 'Post adicionado com sucesso!');
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
      {item.caption && (
        <View style={styles.captionContainer}>
          <Text style={styles.captionText}>{item.caption}</Text>
        </View>
      )}
      <View style={styles.postStats}>
        <Text style={styles.statText}>❤️ {item.likes}</Text>
        <Text style={styles.statText}>💬 {item.comments.length}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Galeria</Text>
        {user?.id === userId && (
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.addButton}>+</Text>
          </TouchableOpacity>
        )}
      </View>

      {userPosts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nenhuma foto ainda</Text>
          {user?.id === userId && (
            <TouchableOpacity
              style={styles.addFirstButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.addFirstButtonText}>Adicionar primeira foto</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={userPosts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.galleryList}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Nova Foto</Text>
            
            <View style={styles.imagePreview}>
              <Image
                source={{ uri: 'https://via.placeholder.com/300x300/4ecdc4' }}
                style={styles.previewImage}
              />
            </View>

            <TextInput
              style={styles.captionInput}
              placeholder="Adicione uma legenda..."
              value={newPostCaption}
              onChangeText={setNewPostCaption}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleAddPost}
              >
                <Text style={styles.confirmButtonText}>Publicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
  },
  backButton: {
    fontSize: 16,
    color: '#0095f6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#262626',
  },
  addButton: {
    fontSize: 24,
    color: '#0095f6',
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#8e8e93',
    marginBottom: 20,
  },
  addFirstButton: {
    backgroundColor: '#0095f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addFirstButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  galleryList: {
    padding: 10,
  },
  postItem: {
    marginBottom: 20,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 300,
  },
  captionContainer: {
    padding: 15,
  },
  captionText: {
    fontSize: 14,
    color: '#262626',
  },
  postStats: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#dbdbdb',
  },
  statText: {
    fontSize: 14,
    color: '#8e8e93',
    marginRight: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#262626',
  },
  imagePreview: {
    alignItems: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  captionInput: {
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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

export default GalleryScreen; 