import React from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Image,
} from 'react-native';
import { Share, PlusSquare, DownloadSimple } from 'phosphor-react-native';
import TextView from '@/src/components/ui/TextView';
import ButtonView from '@/src/components/ui/ButtonView';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { colors } from '@/src/styles/theme/colors';
import { spacing } from '@/src/styles/theme/spacing';
import { Theme } from '@/src/types/theme';
import { useInstallPrompt } from '@/src/hooks/useInstallPrompt';

const InstallPrompt: React.FC = () => {
  const {
    showPrompt,
    dismissPrompt,
    installApp,
    isIOS,
    isAndroid,
    supportsNativeInstall
  } = useInstallPrompt();
  const styles = useThemedStyles(createStyles);

  if (!showPrompt) return null;

  const handleInstall = async () => {
    if (supportsNativeInstall) {
      // Use Chrome's native install prompt
      await installApp();
    } else {
      // Show manual instructions
      // Instructions are already displayed
    }
  };

  return (
    <Modal
      visible={showPrompt}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={dismissPrompt}
    >
      <TouchableWithoutFeedback onPress={dismissPrompt}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.promptContainer}>
              {/* App Icon */}
              <View style={styles.iconContainer}>
                <Image
                  source={require('@/src/assets/images/newLogo.png')}
                  style={styles.appIcon}
                  resizeMode="contain"
                />
              </View>

              {/* Content */}
              <View style={styles.content}>
                <TextView variant="h3" style={styles.title}>
                  وب اپلیکیشن نیلمان را روی دستگاه خود نصب کنید
                </TextView>

                {supportsNativeInstall && isAndroid ? (
                  // Chrome Android - Show simple install button
                  <View style={styles.nativeInstallContainer}>
                    <TextView style={styles.nativeInstallText}>
                      برای نصب سریع، روی دکمه زیر کلیک کنید:
                    </TextView>
                    <ButtonView
                      style={styles.installButton}
                      onPress={handleInstall}
                    >
                      <DownloadSimple size={20} color="#fff" weight="bold" />
                      <TextView style={styles.installButtonText}>
                        نصب اپلیکیشن
                      </TextView>
                    </ButtonView>
                  </View>
                ) : isIOS ? (
                  // iOS Safari - Manual instructions
                  <>
                    {/* Step 1 - Share Button */}
                    <View style={styles.stepRow}>
                      <View style={styles.iconWrapper}>
                        <Image source={require('@/src/assets/images/ios-share.png')}  style={styles.shareIcon} />
                      </View>
                      <TextView style={styles.stepText}>
                        ۱- در نوار پایین روی دکمه Share بزنید.
                      </TextView>
                    </View>

                    {/* Step 2 - Add to Home Screen */}
                    <View style={styles.stepRow}>
                      <View style={styles.iconWrapper}>
                        <PlusSquare size={28} color={colors.pink} weight="regular" />
                      </View>
                      <TextView style={styles.stepText}>
                        ۲- در منو باز شده گزینه "Add to Home Screen" را انتخاب کنید.
                      </TextView>
                    </View>

                    {/* Step 3 - Add Button */}
                    <View style={styles.stepRow}>
                      <View style={[styles.iconWrapper, styles.addButton]}>
                        <TextView style={styles.addButtonText}>Add</TextView>
                      </View>
                      <TextView style={styles.stepText}>
                        ۳- در نهایت از منو بالا روی گزینه "Add" بزنید.
                      </TextView>
                    </View>
                  </>
                ) : isAndroid ? (
                  // Android (non-Chrome) - Manual instructions
                  <>
                    {/* Step 1 - Menu */}
                    <View style={styles.stepRow}>
                      <View style={styles.iconWrapper}>
                        <TextView style={styles.menuIcon}>⋮</TextView>
                      </View>
                      <TextView style={styles.stepText}>
                        ۱- روی منوی سه نقطه (⋮) در نوار بالا بزنید.
                      </TextView>
                    </View>

                    {/* Step 2 - Add to Home Screen */}
                    <View style={styles.stepRow}>
                      <View style={styles.iconWrapper}>
                        <PlusSquare size={28} color={colors.pink} weight="regular" />
                      </View>
                      <TextView style={styles.stepText}>
                        ۲- گزینه "Add to Home screen" یا "افزودن به صفحه اصلی" را انتخاب کنید.
                      </TextView>
                    </View>

                    {/* Step 3 - Add Button */}
                    <View style={styles.stepRow}>
                      <View style={[styles.iconWrapper, styles.addButton]}>
                        <TextView style={styles.addButtonText}>Add</TextView>
                      </View>
                      <TextView style={styles.stepText}>
                        ۳- روی دکمه "Add" یا "افزودن" بزنید.
                      </TextView>
                    </View>
                  </>
                ) : (
                  <View style={styles.stepRow}>
                    <TextView style={styles.stepText}>
                      این دستگاه از نصب PWA پشتیبانی نمی‌کند. لطفاً از مرورگر موبایل خود استفاده کنید.
                    </TextView>
                  </View>
                )}
              </View>

              {/* Dismiss Button */}
              <ButtonView
                style={styles.dismissButton}
                onPress={dismissPrompt}
              >
                <TextView style={styles.dismissButtonText}>
                  {supportsNativeInstall && isAndroid ? 'بستن' : 'متوجه شدم'}
                </TextView>
              </ButtonView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    promptContainer: {
      backgroundColor: theme.background,
      borderRadius: 16,
      padding: spacing.lg,
      maxWidth: 500,
      width: '100%',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    iconContainer: {
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    shareIcon: {
      width: 30,
      height: 30,
      tintColor: colors.pink
    },
    appIcon: {
      width: 80,
      height: 80,
      borderRadius: 16,
    },
    content: {
      marginBottom: spacing.lg,
    },
    title: {
      textAlign: 'center',
      marginBottom: spacing.lg,
      color: theme.text,
    },
    nativeInstallContainer: {
      alignItems: 'center',
      paddingVertical: spacing.md,
    },
    nativeInstallText: {
      textAlign: 'center',
      marginBottom: spacing.md,
      fontSize: 16,
      color: theme.text,
    },
    installButton: {
      backgroundColor: colors.pink,
      borderRadius: 12,
      paddingVertical: spacing.sm + 4,
      paddingHorizontal: spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    installButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    stepRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: spacing.md,
      gap: spacing.sm,
    },
    iconWrapper: {
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      backgroundColor: theme.primary,
    },
    stepText: {
      flex: 1,
      fontSize: 14,
      lineHeight: 22,
      color: theme.text,
      textAlign: 'right',
    },
    addButton: {
      backgroundColor: colors.pink,
      paddingHorizontal: spacing.xs,
    },
    addButtonText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
    },
    menuIcon: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.pink,
    },
    dismissButton: {
      backgroundColor: colors.pink,
      borderRadius: 12,
      paddingVertical: spacing.sm + 4,
      alignItems: 'center',
    },
    dismissButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

export default InstallPrompt;