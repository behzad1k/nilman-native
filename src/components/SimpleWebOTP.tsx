import React, { useRef, useState } from "react";
import { View, TextInput, StyleSheet, Platform } from "react-native";
import TextView from "@/src/components/ui/TextView";

interface SimpleWebOTPProps {
  onCodeReceived: (code: string) => void;
  disabled?: boolean;
}

/**
 * Simple OTP input optimized for web SMS auto-fill
 * Uses standard autocomplete="one-time-code" which is more widely supported
 * than the Web OTP API (OTPCredential)
 */
export function SimpleWebOTP({
  onCodeReceived,
  disabled = false,
}: SimpleWebOTPProps) {
  const inputRef = useRef<TextInput | null>(null);
  const [value, setValue] = useState("");

  const handleChange = (text: string) => {
    console.log("OTP input changed:", text);
    setValue(text);

    // Extract only digits
    const digits = text.replace(/\D/g, "");

    // If we have 6 digits, trigger the callback
    if (digits.length >= 6) {
      const code = digits.slice(0, 6);
      console.log("Valid 6-digit code detected:", code);
      onCodeReceived(code);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={value}
        onChangeText={handleChange}
        placeholder="کد 6 رقمی"
        keyboardType="number-pad"
        maxLength={10}
        autoFocus
        editable={!disabled}
        // Critical attributes for SMS auto-fill
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        // For web specifically
        {...(Platform.OS === "web" && {
          // @ts-ignore - web-specific
          inputMode: "numeric",
          // @ts-ignore - web-specific
          autoComplete: "one-time-code",
        })}
      />
      <TextView style={styles.hint}>
        کد از پیامک به صورت خودکار وارد می‌شود
      </TextView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 20,
  },
  input: {
    width: "100%",
    maxWidth: 300,
    height: 55,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 8,
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
    paddingHorizontal: 10,
    letterSpacing: 8,
  },
  hint: {
    fontSize: 12,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
  },
});
