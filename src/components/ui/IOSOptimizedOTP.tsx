import React, { useRef, useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Platform } from "react-native";
import TextView from "@/src/components/ui/TextView";

interface IOSOptimizedOTPProps {
  onCodeReceived: (code: string) => void;
  disabled?: boolean;
}

/**
 * iOS Safari optimized OTP input
 * Works with SMS format: "کد ورود شما: 294285 ... @app.nilman.co #294285"
 */
export function IOSOptimizedOTP({
  onCodeReceived,
  disabled = false,
}: IOSOptimizedOTPProps) {
  const inputRef = useRef<any>(null);
  const [value, setValue] = useState("");
  const hasAutoFilled = useRef(false);

  const extractAndSubmitCode = (text: string) => {
    console.log("Processing text:", text);

    // Extract 6 digits
    const digits = text.replace(/\D/g, "");
    console.log("Extracted digits:", digits);

    if (digits.length >= 6 && !hasAutoFilled.current) {
      const code = digits.slice(0, 6);
      console.log("Submitting code:", code);
      hasAutoFilled.current = true;

      // Small delay to ensure state updates
      setTimeout(() => {
        onCodeReceived(code);
        hasAutoFilled.current = false;
      }, 100);
    }
  };

  const handleChange = (text: string) => {
    console.log("Input changed:", text);
    setValue(text);
    extractAndSubmitCode(text);
  };

  // Reset on mount
  useEffect(() => {
    hasAutoFilled.current = false;
    setValue("");
  }, []);

  // For web, add additional input event listener for better auto-fill detection
  useEffect(() => {
    if (Platform.OS === "web" && inputRef.current) {
      const input = inputRef.current;

      // Native input element for web
      const nativeInput = input._nativeTag
        ? document.querySelector(`[data-tag="${input._nativeTag}"]`)
        : input;

      if (nativeInput && nativeInput.addEventListener) {
        const handleInput = (e: any) => {
          const newValue = e.target.value;
          console.log("Native input event:", newValue);
          if (newValue && newValue !== value) {
            handleChange(newValue);
          }
        };

        nativeInput.addEventListener("input", handleInput);
        return () => {
          nativeInput.removeEventListener("input", handleInput);
        };
      }
    }
  }, [value]);

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={value}
        onChangeText={handleChange}
        placeholder="000000"
        placeholderTextColor="#999"
        keyboardType="number-pad"
        maxLength={8} // Allow a bit extra for auto-fill
        autoFocus
        editable={!disabled}
        selectTextOnFocus
        // iOS Safari auto-fill attributes
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        // Web-specific attributes
        {...(Platform.OS === "web" && {
          // @ts-ignore
          inputMode: "numeric",
          // @ts-ignore
          autocomplete: "one-time-code",
          // @ts-ignore
          name: "otp-code",
        })}
      />

      <TextView style={styles.hint}>
        کد از پیامک به صورت خودکار وارد می‌شود
      </TextView>

      <TextView style={styles.debugInfo}>
        Status: {value ? `Entered: ${value}` : "Waiting for SMS..."}
      </TextView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 20,
    width: "100%",
  },
  input: {
    width: "90%",
    maxWidth: 300,
    height: 55,
    borderWidth: 2,
    borderColor: "#e91e63",
    borderRadius: 8,
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    backgroundColor: "#fff",
    textAlign: "center",
    paddingHorizontal: 15,
    letterSpacing: 10,
  },
  hint: {
    fontSize: 13,
    color: "#666",
    marginTop: 12,
    textAlign: "center",
  },
  debugInfo: {
    fontSize: 11,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
    fontFamily: Platform.OS === "web" ? "monospace" : undefined,
  },
});
