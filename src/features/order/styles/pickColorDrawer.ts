import { StyleSheet } from 'react-native';

export const PickColorDrawerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    gap: 16,
    height: 500
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  colorContainer: {
    flex: 1,
    gap: 8,
  },
  selectedIcon: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  colorSpan: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingVertical: 4,
    gap: 12,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#4b794b',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 8,

    justifyContent: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
});
