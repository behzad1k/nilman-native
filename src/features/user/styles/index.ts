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
    fontWeight: '500',
  },
  walletBalanceAmount: {
    fontSize: 16,
    color: colors.pink,
    fontWeight: 'bold',
  },
  profileButtonText: {
    fontSize: 16,
    flex: 1,
  },
  logoutText: {
    color: '#e85959',
  },
});

export const profileCardStyles = StyleSheet.create({
  profileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
});
