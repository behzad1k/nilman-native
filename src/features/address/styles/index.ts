import { StyleSheet } from 'react-native';

export const addressesStyles = StyleSheet.create({
  addressSection: {
    gap: 12,
  },
  addAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addAddressText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
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
    color: '#333',
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
    color: '#333',
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
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  deleteModal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    alignItems: 'center',
  },
  deleteModalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  deleteModalButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  confirmDeleteButton: {
    backgroundColor: '#ffe6e6',
  },
  deleteModalButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  confirmDeleteText: {
    color: '#e85959',
  },
});

export const addressRowStyles = StyleSheet.create({
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
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
  addressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  addressDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  addressDots: {
    padding: 8,
  },
});
