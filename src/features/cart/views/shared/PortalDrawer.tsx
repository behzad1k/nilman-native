import TextView from '@/src/components/ui/TextView';
import { useAppDispatch, useAppSelector } from '@/src/configs/redux/hooks';
import { services } from '@/src/configs/services';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { colors } from '@/src/styles/theme/colors';
import { Theme } from '@/src/types/theme';
import { PaymentMethods } from '@/src/utils/enums';
import { CheckCircle } from 'phosphor-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  Alert,
  Linking
} from 'react-native';
import Toast from 'react-native-toast-message';

// Conditional import for WebView (only on native)
let WebView: any = null;
if (Platform.OS !== 'web') {
  WebView = require('react-native-webview').default;
}

interface Props {
  openInExternalBrowser: any
  handleWebViewNavigationStateChange: any
}

interface PaymentResult {
  status: 'success' | 'failed' | 'cancelled';
  method?: string;
  authority?: string;
  refId?: string;
  error?: string;
}

const PaymentOptions = {
  ap: {
    title: 'آسان پرداخت',
    icon: require('@/src/assets/images/ap.png'),
    slug: 'ap',
  },
  sep: {
    title: 'بانک سامان',
    icon: require('@/src/assets/images/sep.png'),
    slug: 'sep',
  },
  zarinpal: {
    title: 'زرین پال',
    icon: require('@/src/assets/images/zarinpal.png'),
    slug: 'zarinpal',
  },
  credit: {
    title: 'کیف پول',
    icon: require('@/src/assets/images/wallet.png'),
    slug: 'credit',
  },
};

const PortalDrawer = ({
                        openInExternalBrowser,handleWebViewNavigationStateChange
                      }: Props) => {
  const styles = useThemedStyles(createStyles);
  const [portal, setPortal] = useState<keyof typeof PaymentOptions>(PaymentMethods.sep);
  const [showPaymentView, setShowPaymentView] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const webViewRef = useRef<any>(null);
  const userReducer = useAppSelector(state => state.user.data);

  // Platform-specific payment handling

  return (
    <View style={styles.webViewContainer}>
      <View style={styles.webViewHeader}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setShowPaymentView(false)}
        >
          <TextView style={styles.closeButtonText}>✕</TextView>
        </TouchableOpacity>
        <TextView style={styles.webViewTitle}>درگاه پرداخت</TextView>
        <TouchableOpacity
          style={styles.externalButton}
          onPress={openInExternalBrowser}
        >
          <TextView style={styles.externalButtonText}>↗</TextView>
        </TouchableOpacity>
      </View>
      <WebView
        ref={webViewRef}
        source={{ uri: paymentUrl }}
        style={styles.webView}
        onNavigationStateChange={handleWebViewNavigationStateChange}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        mixedContentMode="compatibility"
        userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15"
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error:', nativeEvent);
          Toast.show({
            type: 'error',
            text1: 'خطا در بارگذاری درگاه پرداخت',
          });
        }}
      />
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  drawerContainer: {
    flex: 1,
    height: 500,
    backgroundColor: theme.background,
    paddingHorizontal: 16,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    gap: 16,
    paddingTop: 16,
    paddingBottom: 24
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.text,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: theme.primary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  optionIcon: {
    width: 50,
    height: 50,
  },
  disabledIcon: {
    opacity: 0.5,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
  },
  balanceText: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 2,
  },
  selectedIcon: {
    marginRight: 'auto',
  },
  selectedOptionRow: {
    backgroundColor: theme.secondary,
    borderColor: colors.pink,
  },
  selectedOptionText: {
    color: theme.textSecondary,
    fontWeight: '700',
  },
  disabledOptionRow: {
    opacity: 0.6,
    backgroundColor: theme.third,
  },
  disabledOptionText: {
    color: theme.textSecondary,
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
  disabledButton: {
    backgroundColor: theme.textSecondary,
    opacity: 0.7,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: theme.background,
  },
  webViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: theme.primary,
  },
  closeButton: {
    padding: 8,
    borderRadius: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: theme.text,
  },
  webViewTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
    color: theme.text,
  },
  externalButton: {
    padding: 8,
    borderRadius: 4,
  },
  externalButtonText: {
    fontSize: 18,
    color: colors.pink,
  },
  webView: {
    flex: 1,
  },
});

export default PortalDrawer;