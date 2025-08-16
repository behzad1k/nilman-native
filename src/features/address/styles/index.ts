import { StyleSheet } from 'react-native';

export const addressesStyles = StyleSheet.create({
  addressModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  addressModalButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ffe6e6',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButtonText: {
    color: '#e85959',
  },
  cancelButton: {
    backgroundColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteModalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  confirmDeleteText: {
    color: '#e85959',
  },
});

export const addressRowStyles = StyleSheet.create({
  selectionIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  addressSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  addressNotSelected: {
    backgroundColor: 'transparent',
    borderColor: '#ccc',
  },
  addressDetails: {
    alignItems: 'flex-end',
    flex: 1,
    gap: 8,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressDots: {
    padding: 8,
  },
});
