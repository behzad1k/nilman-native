import React, { useEffect, useRef } from "react";
import { View, TextInput, StyleSheet, Platform } from "react-native";
import TextView from "@/src/components/ui/TextView";

interface TestOTPAutoFillProps {
  onCodeReceived?: (code: string) => void;
}

export function TestOTPAutoFill({ onCodeReceived }: TestOTPAutoFillProps) {
  const inputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    if (Platform.OS === "web") {
      console.log("Setting up Web OTP API...");

      // Check if OTPCredential is available
      if ("OTPCredential" in window) {
        console.log("OTPCredential API is available");

        const abortController = new AbortController();

        navigator.credentials
          .get({
            // @ts-ignore - Web OTP API
            otp: { transport: ["sms"] },
            signal: abortController.signal,
          })
          .then((otp: any) => {
            console.log("OTP received from Web OTP API:", otp);
            if (otp && otp.code) {
              const otpCode = otp.code;
              console.log("Extracted code:", otpCode);

              // Set the value in the input
              if (inputRef.current) {
                // @ts-ignore
                inputRef.current.value = otpCode;
              }

              if (onCodeReceived) {
                onCodeReceived(otpCode);
              }
            }
          })
          .catch((err: Error) => {
            console.log("Web OTP API error:", err);
          });

        return () => {
          abortController.abort();
        };
      } else {
        console.log("OTPCredential API is NOT available");
      }
    }
  }, [onCodeReceived]);

  const handleChange = (text: string) => {
    console.log("Input changed:", text);
    if (text.length >= 6) {
      const digits = text.replace(/\D/g, "").slice(0, 6);
      console.log("Extracted digits:", digits);
      if (onCodeReceived && digits.length === 6) {
        onCodeReceived(digits);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextView style={styles.title}>Test OTP Auto-Fill (Web)</TextView>
      <TextView style={styles.subtitle}>
        Send SMS and check if auto-fill works
      </TextView>

      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="Enter or wait for SMS code"
        onChangeText={handleChange}
        keyboardType="number-pad"
        autoComplete={Platform.OS === "web" ? "one-time-code" : "sms-otp"}
        textContentType="oneTimeCode"
        autoFocus
        maxLength={20}
      />

      <TextView style={styles.info}>
        Check browser console for debug logs
      </TextView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    maxWidth: 300,
    height: 50,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 8,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  info: {
    fontSize: 12,
    color: "#999",
    marginTop: 20,
    textAlign: "center",
  },
});
