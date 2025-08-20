import { colors } from '@/src/styles/theme/colors';
import { spacing } from '@/src/styles/theme/spacing';
import typography from '@/src/styles/theme/typography';
import { StyleSheet } from 'react-native';

export const orderStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },

  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 12,
    elevation: 5,
    gap: spacing.sm
  },
  selectedTab: {
    backgroundColor: colors.pink,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedTabText: {
    color: '#fff',
  },
  tabBadge: {
    backgroundColor: colors.lightPink,
    borderRadius: 12,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  selectedTabBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  selectedTabBadgeText: {
    color: '#fff',
  },
  cartContainer: {
    gap: spacing.sm,
    flex: 1,
  },

  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    paddingVertical: 8,
  },
  orderInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    marginLeft: 'auto'
  },
  orderInfoTitleBold: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderInfoText: {
    fontSize: 14,
  },
  orderInfoPrice: {
    fontSize: 14,
    fontWeight: '500',
  },
  dashedBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    borderStyle: 'dashed',
    paddingBottom: 12,
    marginBottom: 8,
  },
  finalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.pink,
  },
  walletText: {
    fontSize: 14,
    fontWeight: '500',
  },
  payButton: {
    width: '100%',
    backgroundColor: colors.green,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },

  orderCardContainer: {
    gap: spacing.md,
    paddingBottom: 20
  }
});

export const orderCardStyles = StyleSheet.create({
  orderCardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    gap: 16,
  },
  orderCardInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
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
  orderCardInfoHeader: {
    alignItems: 'flex-end',
    flex: 1,
    gap: 4,
  },
  serviceTitle: {
    fontSize: 18,
    ...typography.weights.bold
  },
  orderCardDate: {
    fontSize: 12,
    lineHeight: 18,
  },
  orderCardAddress: {
    fontSize: 14,
    lineHeight: 18,
  },
  isUrgent: {
    backgroundColor: '#ff4444',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  isUrgentText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  orderCardSecRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderCardService: {
    flexDirection: 'row',
    gap: 8,
  },
  orderCardServiceIcon: {
    alignItems: 'center',
    gap: 4,
  },
  serviceCountBadge: {
    backgroundColor: colors.pink,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  serviceCountText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  finalPriceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.pink,
  },
  orderCardButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  viewInvoiceButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.pink,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewInvoiceButtonText: {
    color: colors.pink,
    fontSize: 14,
    fontWeight: '500',
  },
  reOrderButton: {
    flex: 1,
    backgroundColor: colors.pink,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reOrderButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export const cartItemStyle = StyleSheet.create({
  cartItemContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    gap: 12,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  orderInfoBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  orderInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  isUrgent: {
    backgroundColor: '#ff4444',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  isUrgentText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  trashCart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  deleteText: {
    color: '#ff4444',
    fontSize: 12,
  },
  orderInfoAddon: {
    gap: 4,
  },
  orderInfoTitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right'
  },
  addOnText: {
    textAlign: 'right',
    fontSize: 12,
    color: '#666',
    paddingLeft: 8,
  },
  orderInfoDelete: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 14,
  },
  orderInfoText: {
    fontSize: 14,
  },
  discountText: {
    fontSize: 14,
    color: '#ff4444',
    fontWeight: '500',
  },
  dashedBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#686868',
    borderStyle: 'solid',
    paddingBottom: 12,
    marginBottom: 8,
  },
  totalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  finalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.pink,
  },
  orderInfoIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addressText: {
    fontSize: 14,
  },
  orderInfoCol: {
    gap: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'red',
    flex: 1,
  },
  dateTimeText: {
    fontSize: 14,
  },
  timerIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
  }
});
