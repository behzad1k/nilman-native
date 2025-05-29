import { StyleSheet } from 'react-native';
import { colors } from './theme/colors'
import { spacing } from './theme/spacing'
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};

export const shadows = {
  small: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  medium: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  large: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  cardLarge: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCenter: {
    textAlign: 'center',
  },
  textRight: {
    textAlign: 'right',
  },
  textLeft: {
    textAlign: 'left',
  },
  flex1: {
    flex: 1,
  },
  marginBottom: {
    marginBottom: spacing.md,
  },
  marginTop: {
    marginTop: spacing.md,
  },
  marginHorizontal: {
    marginHorizontal: spacing.md,
  },
  marginVertical: {
    marginVertical: spacing.md,
  },
  paddingHorizontal: {
    paddingHorizontal: spacing.md,
  },
  paddingVertical: {
    paddingVertical: spacing.md,
  },
  button: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.secondary,
  },
  buttonSuccess: {
    backgroundColor: colors.success,
  },
  buttonDanger: {
    backgroundColor: colors.danger,
  },
  buttonDisabled: {
    backgroundColor: colors.gray400,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  buttonTextDisabled: {
    color: colors.gray500,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray400,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.sm + 2,
    fontSize: 16,
    color: colors.gray900,
    backgroundColor: colors.white,
    minHeight: 44,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  inputError: {
    borderColor: colors.danger,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray700,
    marginBottom: spacing.xs + 4,
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    marginTop: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray200,
    marginVertical: spacing.md,
  },
  dividerThick: {
    height: 2,
    backgroundColor: colors.gray300,
    marginVertical: spacing.md,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    margin: spacing.lg,
    maxHeight: '80%',
    ...shadows.large,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.lg,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  listItemLast: {
    borderBottomWidth: 0,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray300,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm + 4,
  },
  avatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: spacing.md,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray100,
  },
  iconButtonPrimary: {
    backgroundColor: colors.primary,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    paddingBottom: spacing.xs,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  tabItemActive: {
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
});
