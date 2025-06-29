import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/core/types';
import { usePosts } from '@/contexts/PostsContext';
import { useUsers } from '@/contexts/UsersContext';
import { useAuth } from '@/contexts/AuthContext';

// Tipagem de props
export type PostDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'PostDetail'>;

const PostDetailScreen: React.FC<PostDetailScreenProps> = ({ route, navigation }) => {
  const { postId } = route.params;
  const { posts, addComment, toggleLike, toggleCommentLike } = usePosts();
  const { users } = useUsers();
  const { user } = useAuth();
  const post = posts.find(p => p.id === postId);
  const [comment, setComment] = React.useState('');

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.notFound}>Postagem não encontrada.</Text>
      </SafeAreaView>
    );
  }

  const postUser = users.find(u => u.id === post.userId);
  const isLiked = post.likedBy.includes(user?.id ?? '');

  const handleSendComment = () => {
    if (comment.trim() && user) {
      addComment(post.id, {
        postId: post.id,
        userId: user.id,
        content: comment.trim(),
        likedBy: [],
      });
      setComment('');
    }
  };

  const renderComment = ({ item }: any) => {
    const commentUser = users.find(u => u.id === item.userId);
    const isCommentLiked = user && item.likedBy.includes(user.id);
    return (
      <View style={styles.commentItem}>
        <Image source={{ uri: commentUser?.avatar || 'https://via.placeholder.com/40' }} style={styles.commentAvatar} />
        <View style={styles.commentContent}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.commentUsername}>{commentUser?.username || 'Usuário'}</Text>
            <Text style={styles.commentDate}>{new Date(item.createdAt).toLocaleString()}</Text>
          </View>
          <Text style={styles.commentText}>{item.content}</Text>
          <View style={styles.commentActions}>
            <TouchableOpacity>
              <Text style={styles.commentActionBtn}>Responder</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => user && toggleCommentLike(post.id, item.id, user.id)}>
              <Text style={styles.commentActionBtn}>
                {isCommentLiked ? '❤️' : '🤍'} {item.likedBy.length}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backBtnText}>← Voltar</Text>
      </TouchableOpacity>
      <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
      <View style={styles.postHeader}>
        <Image source={{ uri: postUser?.avatar || 'https://via.placeholder.com/40' }} style={styles.avatar} />
        <Text style={styles.username}>{postUser?.username || 'Usuário'}</Text>
      </View>
      <Text style={styles.caption}>{post.caption}</Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity onPress={() => user && toggleLike(post.id, user.id)}>
          <Text style={styles.likeBtn}>{isLiked ? '❤️' : '🤍'} {post.likedBy.length}</Text>
        </TouchableOpacity>
        <Text style={styles.commentsCount}>💬 {post.comments.length}</Text>
      </View>
      <FlatList
        data={post.comments}
        renderItem={renderComment}
        keyExtractor={item => item.id}
        style={styles.commentsList}
        ListEmptyComponent={<Text style={styles.noComments}>Nenhum comentário ainda.</Text>}
      />
      <View style={styles.commentInputRow}>
        <TextInput
          style={styles.commentInput}
          placeholder="Adicionar um comentário..."
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity onPress={handleSendComment} style={styles.sendBtn}>
          <Text style={styles.sendBtnText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  notFound: { flex: 1, textAlign: 'center', textAlignVertical: 'center', fontSize: 18, color: '#8e8e93' },
  backBtn: { padding: 10 },
  backBtnText: { color: '#0095f6', fontSize: 16 },
  postImage: { width: '100%', height: 300, backgroundColor: '#eee' },
  postHeader: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  username: { fontWeight: 'bold', color: '#262626', fontSize: 16 },
  caption: { fontSize: 16, color: '#262626', paddingHorizontal: 10, marginBottom: 10 },
  actionsRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, marginBottom: 10 },
  likeBtn: { fontSize: 18, marginRight: 20 },
  commentsCount: { fontSize: 16, color: '#8e8e93' },
  commentsList: { flex: 1 },
  noComments: { color: '#8e8e93', textAlign: 'center', marginTop: 20 },
  commentItem: { flexDirection: 'row', alignItems: 'flex-start', padding: 10 },
  commentAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  commentContent: { flex: 1 },
  commentUsername: { fontWeight: 'bold', color: '#262626', marginRight: 8 },
  commentDate: { fontSize: 10, color: '#8e8e93' },
  commentText: { fontSize: 14, color: '#262626', marginTop: 2 },
  commentActions: { flexDirection: 'row', marginTop: 4 },
  commentActionBtn: { color: '#0095f6', fontSize: 12, marginRight: 16 },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#eee' },
  commentInput: { flex: 1, borderWidth: 1, borderColor: '#dbdbdb', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, fontSize: 14, backgroundColor: '#fafafa' },
  sendBtn: { marginLeft: 10, backgroundColor: '#0095f6', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16 },
  sendBtnText: { color: '#fff', fontWeight: 'bold' },
});

export default PostDetailScreen;
