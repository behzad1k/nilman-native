import { StyleSheet } from 'react-native';

export const serviceStepStyles = StyleSheet.create({
  cardsContainer: {
    padding: 4,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 35
  }
});

export const sharedOrderStyles = StyleSheet.create({
  drawerContainer:{
    flex: 1,
    height: '100%',
    paddingHorizontal: 4
  },
  attrBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderWidth: 2,
    justifyContent: 'space-between',
    flexDirection: 'row',
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
    width: '100%'
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
    position: 'static',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

})
