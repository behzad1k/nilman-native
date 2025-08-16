import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '@/src/styles/theme/colors'
const { width } = Dimensions.get('window');

export const orderStyles = StyleSheet.create({
  main: {
    flex: 1,
    paddingBottom: 65,
  },
  progressBackground: {
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressActive: {
    height: '100%',
    backgroundColor: colors.pink,
    borderRadius: 2,
    // transition: 'width 0.3s ease',
  },

  urgentWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  urgentWarningText: {
    flex: 1,
    fontSize: 12,
    color: '#856404',
    marginLeft: 12,
    textAlign: 'right',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonSection: {
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#28A745',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#28A745',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: colors.blue,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.blue,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#E5E5EA',
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledButtonText: {
    color: '#8E8E93',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  stepNumber: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'IRANSans',
  },
  // Additional styles for better UX
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 12,
    fontFamily: 'IRANSans',
  },
  errorContainer: {
    backgroundColor: '#F8D7DA',
    borderColor: '#F5C6CB',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  errorText: {
    color: '#721C24',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'IRANSans',
  },
  successContainer: {
    backgroundColor: '#D4EDDA',
    borderColor: '#C3E6CB',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  successText: {
    color: '#155724',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'IRANSans',
  },
  priceContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'IRANSans',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'IRANSans',
  },
  totalPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  totalPriceLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'IRANSans',
  },
  totalPriceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    fontFamily: 'IRANSans',
  },
  // Responsive styles
  tablet: {
    maxWidth: 600,
    alignSelf: 'center',
  },
  // Animation styles
  fadeIn: {
    opacity: 1,
  },
  fadeOut: {
    opacity: 0,
  },
  slideIn: {
    transform: [{ translateX: 0 }],
  },
  slideOut: {
    transform: [{ translateX: width }],
  },
});
