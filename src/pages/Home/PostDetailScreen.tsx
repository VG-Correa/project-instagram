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
  KeyboardAvoidingView,
  Platform,
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
  const [replyTo, setReplyTo] = React.useState<string | null>(null);
  const [inputHeight, setInputHeight] = React.useState(40);

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
        parentId: replyTo || undefined,
      });
      setComment('');
      setReplyTo(null);
    }
  };

  // Função para renderizar comentários em árvore
  const renderCommentsTree = (parentId: string | null = null, level = 0) => {
    return post.comments
      .filter(c => (c.parentId ?? null) === parentId)
      .map((item) => {
        const commentUser = users.find(u => u.id === item.userId);
        const isCommentLiked = user && item.likedBy.includes(user.id);
        return (
          <View key={item.id} style={[styles.commentItem, { marginLeft: level * 24 }]}> 
            <Image source={{ uri: commentUser?.avatar || 'https://via.placeholder.com/40' }} style={styles.commentAvatar} />
            <View style={styles.commentContent}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.commentUsername}>{commentUser?.username || 'Usuário'}</Text>
                <Text style={styles.commentDate}>{new Date(item.createdAt).toLocaleString()}</Text>
              </View>
              <Text style={styles.commentText}>{item.content}</Text>
              <View style={styles.commentActions}>
                <TouchableOpacity onPress={() => setReplyTo(item.id)}>
                  <Text style={styles.commentActionBtn}>Responder</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => user && toggleCommentLike(post.id, item.id, user.id)}>
                  <Text style={styles.commentActionBtn}>
                    {isCommentLiked ? '❤️' : '🤍'} {item.likedBy.length}
                  </Text>
                </TouchableOpacity>
              </View>
              {/* Renderiza respostas recursivamente */}
              {renderCommentsTree(item.id, level + 1)}
            </View>
          </View>
        );
      });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
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
        <View style={styles.commentsList}>
          {post.comments.length === 0 ? (
            <Text style={styles.noComments}>Nenhum comentário ainda.</Text>
          ) : (
            renderCommentsTree()
          )}
        </View>
        <View style={styles.commentInputRow}>
          {replyTo && (
            <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', top: -22, left: 0, right: 0 }}>
              <Text style={{ color: '#0095f6', fontSize: 13, textAlign: 'left', marginBottom: 2 }}>
                Respondendo comentário
              </Text>
              <TouchableOpacity onPress={() => setReplyTo(null)}>
                <Text style={{ color: '#f44336', marginLeft: 10, fontSize: 13, fontWeight: 'bold' }}>(Cancelar)</Text>
              </TouchableOpacity>
            </View>
          )}
          <TextInput
            style={[styles.commentInput, { minHeight: 48, maxHeight: 120, height: Math.max(48, inputHeight) }]}
            placeholder={replyTo ? 'Responder comentário...' : 'Adicionar um comentário...'}
            value={comment}
            onChangeText={setComment}
            multiline
            onContentSizeChange={e => setInputHeight(e.nativeEvent.contentSize.height)}
            textAlignVertical="top"
          />
          <TouchableOpacity onPress={handleSendComment} style={styles.sendBtn}>
            <Text style={styles.sendBtnText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fafbfc',
    minHeight: 60,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: '#fff',
    marginRight: 8,
    minHeight: 40,
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: '#0095f6',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  sendBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});

export default PostDetailScreen;
