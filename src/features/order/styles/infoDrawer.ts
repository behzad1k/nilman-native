import { StyleSheet } from 'react-native';

export const infoDrawerStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  infoModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '100%',
    paddingTop: 20,
  },
  infoModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#333',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  infoRow: {
    alignItems: 'flex-end',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  attributeTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
    marginBottom: 4,
  },
  attributeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    textAlign: 'right'
  },
});
