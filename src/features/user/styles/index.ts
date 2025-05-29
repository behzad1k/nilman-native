import { StyleSheet } from 'react-native';
import { colors } from '@/src/styles/theme/colors'

export const profileStyles = StyleSheet.create({
  profileMain: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 25,
    paddingHorizontal: 16,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  justifyCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletBalance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  walletBalanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  walletBalanceText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  walletBalanceAmount: {
    fontSize: 16,
    color: colors.logoPink,
    fontWeight: 'bold',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileButtonText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  logoutText: {
    color: '#e85959',
  },
});

export const profileCardStyles = StyleSheet.create({
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  profileCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  profileCardDetails: {
    justifyContent: 'flex-start',
    width: '50%',
    gap: 12,
  },
  iconInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  inputText: {
    fontSize: 14,
    color: '#333',
  },
  profileCardPicture: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
