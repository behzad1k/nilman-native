import { spacing } from '@/src/styles/theme/spacing';
import { StyleSheet } from 'react-native';
import { colors } from '@/src/styles/theme/colors';

export const orderStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 20,
    paddingBottom: 60,
    paddingHorizontal: 16,
    gap: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 12,
    paddingVertical: 4,
    elevation: 5,
    gap: spacing.sm
  },
  tab: {
    backgroundColor: colors.whitePink,
    borderStyle: 'solid',
    borderColor: colors.logoPink,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: spacing.xs,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
  },
  selectedTab: {
    backgroundColor: colors.logoPink,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
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
    gap: 16,
  },
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
    paddingVertical: 8,
  },
  orderInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  orderInfoTitleBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderInfoText: {
    fontSize: 14,
    color: '#666',
  },
  orderInfoPrice: {
    fontSize: 14,
    color: '#333',
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
    color: colors.logoPink,
  },
  cartIsCredit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  walletText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  payButton: {
    backgroundColor: colors.logoPink,
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
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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

  orderCardContainer:{
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
    flex: 1,
    gap: 4,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderCardDate: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  orderCardAddress: {
    fontSize: 12,
    color: '#666',
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
    backgroundColor: colors.logoPink,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  serviceCountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  serviceIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  finalPriceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.logoPink,
  },
  orderCardButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  viewInvoiceButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.logoPink,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewInvoiceButtonText: {
    color: colors.logoPink,
    fontSize: 14,
    fontWeight: '500',
  },
  reOrderButton: {
    flex: 1,
    backgroundColor: colors.logoPink,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reOrderButtonText: {
    color: '#fff',
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
  orderInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
    color: '#333',
    fontWeight: '500',
  },
  addOnText: {
    fontSize: 12,
    color: '#666',
    paddingLeft: 8,
  },
  orderInfoDelete: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  orderInfoText: {
    fontSize: 14,
    color: '#666',
  },
  discountText: {
    fontSize: 14,
    color: '#ff4444',
    fontWeight: '500',
  },
  dashedBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    borderStyle: 'dashed',
    paddingBottom: 12,
    marginBottom: 8,
  },
  totalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  finalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.logoPink,
  },
  orderInfoIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  orderInfoCol: {
    gap: 8,
    alignItems: 'flex-end',
  },
  dateTimeText: {
    fontSize: 14,
    color: '#666',
  },
  timerIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#666',
    borderRadius: 10,
    // You can replace this with an actual timer icon component
  }
});
