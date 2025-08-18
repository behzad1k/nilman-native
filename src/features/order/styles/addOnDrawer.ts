import { Dimensions, StyleSheet } from 'react-native';

export const addOnDrawerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    maxHeight: 400
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addOnsList: {
    gap: 8,
    marginBottom: 24,
  },
  attrBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAttrBox: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  attrContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attrTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  selectedIcon: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  priceContainer: {
    alignItems: 'flex-end',
    gap: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  currency: {
    fontSize: 14,
    color: '#666',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quantityButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityInput: {
    width: 40,
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
    paddingVertical: 4,
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    bottom: 16,
    // width: Dimensions.get('screen').width - 80,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
