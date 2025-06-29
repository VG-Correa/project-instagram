import React, { createContext, useContext, useState, ReactNode } from 'react';

export type FeedbackType = 'success' | 'error' | 'info' | 'warning';

interface Feedback {
  type: FeedbackType;
  message: string;
  visible: boolean;
}

interface FeedbackContextProps {
  feedback: Feedback;
  showFeedback: (type: FeedbackType, message: string) => void;
  hideFeedback: () => void;
}

const FeedbackContext = createContext<FeedbackContextProps | undefined>(undefined);

export const FeedbackProvider = ({ children }: { children: ReactNode }) => {
  const [feedback, setFeedback] = useState<Feedback>({
    type: 'info',
    message: '',
    visible: false,
  });

  const showFeedback = (type: FeedbackType, message: string) => {
    setFeedback({ type, message, visible: true });
  };

  const hideFeedback = () => {
    setFeedback(fb => ({ ...fb, visible: false }));
  };

  return (
    <FeedbackContext.Provider value={{ feedback, showFeedback, hideFeedback }}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) throw new Error('useFeedback deve ser usado dentro de um FeedbackProvider');
  return context;
};
