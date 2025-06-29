import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useFeedback } from '@/contexts/FeedbackContext';

const feedbackColors = {
  success: '#4BB543',
  error: '#FF3333',
  info: '#007AFF',
  warning: '#FF9500',
};

export const FeedbackModal: React.FC = () => {
  const { feedback, hideFeedback } = useFeedback();

  return (
    <Modal
      visible={feedback.visible}
      animationType="fade"
      transparent
      onRequestClose={hideFeedback}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { borderLeftColor: feedbackColors[feedback.type] }]}> 
          <Text style={[styles.title, { color: feedbackColors[feedback.type] }]}>
            {feedback.type === 'success' && 'Sucesso!'}
            {feedback.type === 'error' && 'Erro!'}
            {feedback.type === 'info' && 'Informação'}
            {feedback.type === 'warning' && 'Atenção!'}
          </Text>
          <Text style={styles.message}>{feedback.message}</Text>
          <TouchableOpacity style={styles.button} onPress={hideFeedback}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    elevation: 6,
    borderLeftWidth: 8,
    ...Platform.select({
      web: { boxShadow: '0 2px 16px rgba(0,0,0,0.15)' },
    }),
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
