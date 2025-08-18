import { useLoading } from '@/src/components/contexts/LoadingContext';
import React from 'react';
import {
  View,
  Modal,
  ActivityIndicator,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  transparent?: boolean;
  color?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
                                                                visible,
                                                                message,
                                                                transparent = true,
                                                                color = '#007AFF',
                                                              }) => {
  return (
    <Modal
      transparent={transparent}
      animationType="fade"
      visible={visible}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={color} />
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
      </View>
    </Modal>
  );
};

export const LoadingGlobal: React.FC = () => {
  const { isLoading, loadingMessage } = useLoading();

  return (
    <LoadingOverlay
      visible={isLoading}
      message={loadingMessage}
    />
  );
};


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 120,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  message: {
    marginTop: 15,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    maxWidth: Dimensions.get('window').width * 0.7,
  },
});
