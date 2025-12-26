import TextView from "@/src/components/ui/TextView";
import { useAppDispatch, useAppSelector } from "@/src/configs/redux/hooks";
import { cart, order } from "@/src/configs/redux/slices/orderSlice";
import { services } from "@/src/configs/services";
import { useThemedStyles } from "@/src/hooks/useThemedStyles";
import { colors } from "@/src/styles/theme/colors";
import { Theme } from "@/src/types/theme";
import { PaymentMethods } from "@/src/utils/enums";
import { CheckCircle } from "phosphor-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  Alert,
  Linking,
} from "react-native";
import { Toast } from "toastify-react-native";

// Conditional import for WebView (only on native)
let WebView: any = null;
if (Platform.OS !== "web") {
  WebView = require("react-native-webview").default;
}

interface Props {
  finalPrice: number;
  isCredit: boolean;
  onPaymentComplete?: (result: PaymentResult) => void;
  onClose?: () => void;
}

interface PaymentResult {
  status: "success" | "failed" | "cancelled";
  method?: string;
  authority?: string;
  refId?: string;
  error?: string;
}

const PaymentOptions = {
  // ap: {
  //   title: 'آسان پرداخت',
  //   icon: require('@/src/assets/images/ap.png'),
  //   slug: 'ap',
  // },
  sep: {
    title: "بانک سامان",
    icon: require("@/src/assets/images/sep.png"),
    slug: "sep",
  },
  zarinpal: {
    title: "زرین پال",
    icon: require("@/src/assets/images/zarinpal.png"),
    slug: "zarinpal",
  },
};

const PortalPickerDrawer = ({
  finalPrice,
  isCredit,
  onPaymentComplete,
  onClose,
}: Props) => {
  const styles = useThemedStyles(createStyles);
  const [portal, setPortal] = useState<keyof typeof PaymentOptions>(
    PaymentMethods.sep,
  );
  const [showPaymentView, setShowPaymentView] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const webViewRef = useRef<any>(null);
  const userReducer = useAppSelector((state) => state.user.data);
  const dispatch = useAppDispatch();
  // Platform-specific payment handling
  const generatePaymentHTML = useCallback((portalData: any) => {
    const { authority, method } = portalData;

    if (method === PaymentMethods.sep) {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>درگاه پرداخت بانک سامان</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              margin: 0;
              padding: 20px;
              min-height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
              direction: rtl;
            }
            .container {
              background: white;
              padding: 40px 20px;
              border-radius: 20px;
              box-shadow: 0 15px 35px rgba(0,0,0,0.1);
              text-align: center;
              max-width: 400px;
              width: 100%;
            }
            .logo {
              width: 80px;
              height: 80px;
              margin: 0 auto 20px;
              background: #667eea;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 24px;
              font-weight: bold;
            }
            h2 {
              color: #333;
              margin: 20px 0;
              font-size: 24px;
            }
            .spinner {
              border: 4px solid #f3f3f3;
              border-top: 4px solid #667eea;
              border-radius: 50%;
              width: 50px;
              height: 50px;
              animation: spin 1s linear infinite;
              margin: 20px auto;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .progress {
              width: 100%;
              height: 8px;
              background: #f0f0f0;
              border-radius: 4px;
              overflow: hidden;
              margin: 20px 0;
            }
            .progress-bar {
              width: 0%;
              height: 100%;
              background: linear-gradient(90deg, #667eea, #764ba2);
              animation: progress 3s ease-in-out;
            }
            @keyframes progress {
              0% { width: 0%; }
              100% { width: 100%; }
            }
            p {
              color: #666;
              margin: 10px 0;
              line-height: 1.6;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">🏦</div>
            <h2>انتقال به بانک سامان</h2>
            <div class="spinner"></div>
            <div class="progress">
              <div class="progress-bar"></div>
            </div>
            <p>در حال اتصال به درگاه امن بانک...</p>
            <p><small>این فرآیند چند ثانیه طول می‌کشد</small></p>
          </div>
          <form id="bankForm" action="https://sep.shaparak.ir/OnlinePG/OnlinePG" method="post">
            <input type="hidden" name="Token" value="${authority}" />
            <input type="hidden" name="GetMethod" value="true" />
          </form>
          <script>
            setTimeout(() => {
              document.getElementById('bankForm').submit();
            }, 3000);
          </script>
        </body>
        </html>
      `;
    } else if (method === PaymentMethods.ap) {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>درگاه آسان پرداخت</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
              margin: 0;
              padding: 20px;
              min-height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
              direction: rtl;
            }
            .container {
              background: white;
              padding: 40px 20px;
              border-radius: 20px;
              box-shadow: 0 15px 35px rgba(0,0,0,0.1);
              text-align: center;
              max-width: 400px;
              width: 100%;
            }
            .logo {
              width: 80px;
              height: 80px;
              margin: 0 auto 20px;
              background: #4facfe;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 24px;
              font-weight: bold;
            }
            h2 {
              color: #333;
              margin: 20px 0;
              font-size: 24px;
            }
            .spinner {
              border: 4px solid #f3f3f3;
              border-top: 4px solid #4facfe;
              border-radius: 50%;
              width: 50px;
              height: 50px;
              animation: spin 1s linear infinite;
              margin: 20px auto;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">💳</div>
            <h2>انتقال به آسان پرداخت</h2>
            <div class="spinner"></div>
            <p>در حال اتصال به درگاه امن...</p>
          </div>
          <form id="bankForm" action="https://asan.shaparak.ir" method="post">
            <input type="hidden" name="RefID" value="${authority}" />
          </form>
          <script>
            setTimeout(() => {
              document.getElementById('bankForm').submit();
            }, 3000);
          </script>
        </body>
        </html>
      `;
    }

    return "";
  }, []);

  // Web-specific form submission
  const handleWebPayment = useCallback(
    (portalData: any) => {
      const { authority, method, url } = portalData;

      if (
        (method === PaymentMethods.zarinpal || method === PaymentMethods.sep) &&
        url
      ) {
        window.open(url, "_self");
        onClose?.();
        return;
      } else {
        //error
      }

      // Create and submit forms for banks
      const form = document.createElement("form");
      form.method = "post";
      form.style.display = "none";

      if (method === PaymentMethods.ap) {
        form.action = "https://asan.shaparak.ir";

        const refIdInput = document.createElement("input");
        refIdInput.type = "hidden";
        refIdInput.name = "RefID";
        refIdInput.value = authority;
        form.appendChild(refIdInput);
      }

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
      onClose?.();
    },
    [onClose],
  );

  // Native-specific WebView handling
  const handleNativePayment = useCallback(
    (portalData: any) => {
      const { authority, method, url } = portalData;

      if (method === PaymentMethods.ap) {
        const formHTML = generatePaymentHTML({ authority, method });
        const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(formHTML)}`;
        setPaymentUrl(dataUrl);
      } else {
        setPaymentUrl(url);
      }

      setShowPaymentView(true);
    },
    [generatePaymentHTML],
  );

  // Handle payment navigation changes (native only)
  const handleWebViewNavigationStateChange = useCallback(
    (navState: any) => {
      const { url } = navState;
      console.log(url);
      // Check for payment result URLs
      if (url.includes("payment/verify")) {
        setShowPaymentView(false);

        try {
          const urlParams = new URLSearchParams(url.split("?")[1] || "");
          const status =
            urlParams.get("status") ||
            urlParams.get("Status") ||
            urlParams.get("State");
          const authority =
            urlParams.get("authority") || urlParams.get("Authority");
          const refId = urlParams.get("RefId") || urlParams.get("refId");
          console.log(status, authority, refId);
          if (status === "OK" || status === "success" || refId) {
            Toast.show({
              type: "success",
              text1: "پرداخت با موفقیت انجام شد",
            });
            onPaymentComplete?.({
              status: "success",
              authority: authority || "",
              refId: refId || "",
              method: portal,
            });
          } else {
            Toast.show({
              type: "error",
              text1: "پرداخت ناموفق بود",
            });
            onPaymentComplete?.({
              status: "failed",
              error: status || "",
              method: portal,
            });
          }
        } catch (error) {
          console.warn("Error parsing payment result:", error);
          // Ask user about payment status
          Alert.alert("وضعیت پرداخت", "آیا پرداخت شما با موفقیت انجام شد؟", [
            {
              text: "خیر",
              onPress: () =>
                onPaymentComplete?.({ status: "failed", method: portal }),
            },
            {
              text: "بله",
              onPress: () =>
                onPaymentComplete?.({ status: "success", method: portal }),
            },
          ]);
        }

        onClose?.();
      }
    },
    [portal, onPaymentComplete, onClose],
  );

  // Main payment handler
  const pay = async () => {
    if (!portal) {
      Toast.show({
        type: "error",
        text1: "لطفا یکی از درگاه های زیر را انتخاب کنید",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await services.cart.sendPortal({
        isCredit: isCredit,
        method: portal,
      });

      if (res.code === 200) {
        // Platform-specific handling
        if (Platform.OS === "web") {
          handleWebPayment({
            authority: res.data.authority,
            method: portal,
            url: res.data?.url,
          });
        } else {
          handleNativePayment({
            authority: res.data.authority,
            method: portal,
            url: res.data?.url,
          });
        }
      } else if (res.code == 1015) {
        Toast.show({
          type: "error",
          text1: "از ثبت سفارش شما بیش از یک ساعت گذشته لطفا دوباره ثبت کنید",
        });
        dispatch(cart());
        dispatch(order());
        return;
      } else {
        Toast.show({
          type: "error",
          text1: "مشکلی پیش آمده، لطفا مجددا امتحان کنید",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "خطا در برقراری ارتباط با سرور",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Open in external browser (native only)
  const openInExternalBrowser = useCallback(async () => {
    if (paymentUrl && Platform.OS !== "web") {
      const supported = await Linking.canOpenURL(paymentUrl);
      if (supported) {
        await Linking.openURL(paymentUrl);
        setShowPaymentView(false);
        onClose?.();
      }
    }
  }, [paymentUrl, onClose]);

  // Render WebView for native platforms
  if (showPaymentView && Platform.OS !== "web" && WebView) {
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
          onError={(syntheticEvent: any) => {
            const { nativeEvent } = syntheticEvent;
            console.warn("WebView error:", nativeEvent);
            Toast.show({
              type: "error",
              text1: "خطا در بارگذاری درگاه پرداخت",
            });
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.drawerContainer}>
      <TextView style={styles.title}>روش های پرداخت</TextView>

      {Object.values(PaymentOptions).map((e) => {
        const isSelected = e.slug === portal;
        const isDisabled =
          e.slug === PaymentMethods.credit &&
          (!isCredit || userReducer?.walletBalance < finalPrice);

        return (
          <TouchableOpacity
            style={[
              styles.optionRow,
              isSelected && styles.selectedOptionRow,
              isDisabled && styles.disabledOptionRow,
            ]}
            key={e.slug}
            onPress={() =>
              !isDisabled && setPortal(e.slug as keyof typeof PaymentOptions)
            }
            disabled={isDisabled}
          >
            {isSelected && (
              <CheckCircle
                style={styles.selectedIcon}
                color={colors.pink}
                size={40}
              />
            )}
            <View style={styles.optionContent}>
              <TextView
                style={[
                  styles.optionText,
                  isSelected && styles.selectedOptionText,
                  isDisabled && styles.disabledOptionText,
                ]}
              >
                {e.title}
              </TextView>
              {e.slug === PaymentMethods.credit &&
                userReducer?.walletBalance && (
                  <TextView style={styles.balanceText}>
                    موجودی: {userReducer.walletBalance.toLocaleString()} تومان
                  </TextView>
                )}
            </View>
            <Image
              style={[styles.optionIcon, isDisabled && styles.disabledIcon]}
              source={e.icon}
            />
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        style={[styles.payButton, isLoading && styles.disabledButton]}
        onPress={pay}
        disabled={isLoading}
      >
        <TextView style={styles.payButtonText}>
          {isLoading
            ? "در حال پردازش..."
            : `پرداخت ${finalPrice.toLocaleString()} تومان`}
        </TextView>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    drawerContainer: {
      flex: 1,
      height: "auto",
      backgroundColor: theme.background,
      paddingHorizontal: 16,
      borderTopRightRadius: 24,
      borderTopLeftRadius: 24,
      gap: 16,
      paddingTop: 16,
      paddingBottom: 24,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      color: theme.text,
    },
    optionRow: {
      flexDirection: "row",
      gap: 16,
      alignItems: "center",
      justifyContent: "flex-end",
      backgroundColor: theme.primary,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 2,
      borderColor: "transparent",
    },
    optionContent: {
      flex: 1,
      alignItems: "flex-end",
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
      fontWeight: "600",
      color: theme.text,
    },
    balanceText: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 2,
    },
    selectedIcon: {
      marginRight: "auto",
    },
    selectedOptionRow: {
      borderColor: colors.pink,
    },
    selectedOptionText: {},
    disabledOptionRow: {
      opacity: 0.6,
      backgroundColor: theme.third,
    },
    disabledOptionText: {
      color: theme.textSecondary,
    },
    payButton: {
      width: "100%",
      backgroundColor: colors.green,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
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
      fontSize: 18,
      color: colors.white,
    },
    webViewContainer: {
      height: 700,
      flex: 1,
      backgroundColor: theme.background,
    },
    webViewHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
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
      fontWeight: "500",
      flex: 1,
      textAlign: "center",
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

export default PortalPickerDrawer;
