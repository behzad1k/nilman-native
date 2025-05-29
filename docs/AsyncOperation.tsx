// @ts-nocheck
import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Button } from '../components/ui/Button';
import { useAsyncOperation } from '../hooks/useAsyncOperation';

// API simulation functions
const fetchUserData = async (userId: string) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  if (Math.random() > 0.7) throw new Error('Network error');
  return { id: userId, name: 'John Doe', email: 'john@example.com' };
};

const uploadFile = async (file: any) => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  if (Math.random() > 0.8) throw new Error('Upload failed');
  return { fileId: '123', url: 'https://example.com/file.jpg' };
};

export const AsyncOperationExamples: React.FC = () => {
  const [userId, setUserId] = useState('user123');

  // Example 1: Basic usage with global loading
  const {
    execute: fetchUser,
    loading: fetchingUser,
    error: fetchError,
    data: userData,
  } = useAsyncOperation({
    useGlobalLoading: true,
    loadingMessage: 'Loading user data...',
    onSuccess: (data) => {
      console.log('User loaded:', data);
    },
    onError: (error) => {
      Alert.alert('Failed to load user', error.message);
    },
  });

  // Example 2: With retry functionality
  const {
    execute: uploadWithRetry,
    loading: uploading,
    error: uploadError,
    retry: retryUpload,
  } = useAsyncOperation({
    maxRetries: 3,
    retryDelay: 2000,
    loadingMessage: 'Uploading file...',
    onSuccess: (result) => {
      Alert.alert('Success', `File uploaded: ${result.fileId}`);
    },
    onError: (error) => {
      console.error('Upload failed after retries:', error);
    },
  });

  // Example 3: Cancelable operation
  const {
    execute: longRunningTask,
    loading: taskRunning,
    cancel: cancelTask,
  } = useAsyncOperation({
    cancelable: true,
    useGlobalLoading: true,
    loadingMessage: 'Processing large dataset...',
  });

  // Example 4: Form submission with validation
  const {
    execute: submitForm,
    loading: submitting,
    error: submitError,
    reset: resetSubmission,
  } = useAsyncOperation({
    onSuccess: () => {
      Alert.alert('Success', 'Form submitted successfully!');
      // Reset form or navigate
    },
    onError: (error) => {
      // Error is automatically stored in state
      console.error('Submission failed:', error);
    },
  });

  const handleFetchUser = async () => {
    try {
      await fetchUser(() => fetchUserData(userId));
    } catch (error) {
      // Error already handled by the hook
    }
  };

  const handleUpload = async () => {
    try {
      await uploadWithRetry(() => uploadFile({ name: 'test.jpg' }));
    } catch (error) {
      // All retries failed
    }
  };

  const handleLongTask = async () => {
    try {
      await longRunningTask(async () => {
        // Simulate long running task
        for (let i = 0; i < 10; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log(`Step ${i + 1}/10`);
        }
        return 'Task completed';
      });
    } catch (error) {
      if (error.message === 'Operation cancelled') {
        Alert.alert('Cancelled', 'Task was cancelled');
      }
    }
  };

  const handleFormSubmit = async () => {
    try {
      await submitForm(async () => {
        // Validate form
        if (!userId) {
          throw new Error('User ID is required');
        }

        // Submit form
        await new Promise(resolve => setTimeout(resolve, 2000));
        return { success: true };
      });
    } catch (error) {
      // Error handling is done by the hook
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Async Operation Examples</Text>

      {/* Basic fetch with global loading */}
      <Button
        title="Fetch User Data"
        onPress={handleFetchUser}
        loading={fetchingUser}
        style={styles.button}
      />
      {userData && (
        <Text style={styles.result}>User: {userData.name}</Text>
      )}
      {fetchError && (
        <Text style={styles.error}>Error: {fetchError.message}</Text>
      )}

      {/* Upload with retry */}
      <Button
        title="Upload File (with retry)"
        onPress={handleUpload}
        loading={uploading}
        variant="secondary"
        style={styles.button}
      />
      {uploadError && (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>Upload failed: {uploadError.message}</Text>
          <Button
            title="Retry Upload"
            onPress={retryUpload}
            size="small"
            style={styles.retryButton}
          />
        </View>
      )}

      {/* Cancelable task */}
      <View style={styles.row}>
        <Button
          title="Start Long Task"
          onPress={handleLongTask}
          loading={taskRunning}
          variant="outline"
          style={styles.flexButton}
        />
        {taskRunning && (
          <Button
            title="Cancel"
            onPress={cancelTask}
            variant="danger"
            size="small"
            style={styles.cancelButton}
          />
        )}
      </View>

      {/* Form submission */}
      <Button
        title="Submit Form"
        onPress={handleFormSubmit}
        loading={submitting}
        variant="primary"
        style={styles.button}
      />
      {submitError && (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>Submit error: {submitError.message}</Text>
          <Button
            title="Reset"
            onPress={resetSubmission}
            variant="ghost"
            size="small"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    marginVertical: 8,
  },
  result: {
    color: 'green',
    marginTop: 8,
  },
  error: {
    color: 'red',
    marginTop: 8,
  },
  errorContainer: {
    marginTop: 8,
  },
  retryButton: {
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  flexButton: {
    flex: 1,
  },
  cancelButton: {
    marginLeft: 12,
  },
});
