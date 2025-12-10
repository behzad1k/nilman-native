import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Platform } from "react-native";
import TextView from "@/src/components/ui/TextView";

interface IOSOptimizedOTPProps {
  onCodeReceived: (code: string) => void;
  disabled?: boolean;
}

/**
 * Completely uncontrolled input for testing SMS auto-fill
 * No React state, pure DOM manipulation
 */
export function IOSOptimizedOTP({
  onCodeReceived,
  disabled = false,
}: IOSOptimizedOTPProps) {
  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (Platform.OS === "web" && inputRef.current) {
      // Get the actual DOM input element
      const getInputElement = () => {
        // Try different ways to get the DOM element
        if (inputRef.current.input) {
          return inputRef.current.input;
        }
        if (inputRef.current._inputRef) {
          return inputRef.current._inputRef;
        }
        // For React Native Web
        const domNode = inputRef.current;
        if (domNode && domNode.tagName === "INPUT") {
          return domNode;
        }
        return inputRef.current;
      };

      const inputElement = getInputElement();
      console.log("Input element:", inputElement);

      if (inputElement) {
        // Listen for input events
        const handleInput = (e: any) => {
          const value = e.target.value;
          console.log("Input event fired:", value);

          if (value) {
            // Extract digits
            const digits = value.replace(/\D/g, "");
            console.log("Extracted digits:", digits);

            if (digits.length >= 6) {
              const code = digits.slice(0, 6);
              console.log("Calling onCodeReceived with:", code);
              onCodeReceived(code);
            }
          }
        };

        const handleChange = (e: any) => {
          console.log("Change event fired:", e.target.value);
        };

        const handlePaste = (e: any) => {
          console.log("Paste event fired");
        };

        inputElement.addEventListener("input", handleInput);
        inputElement.addEventListener("change", handleChange);
        inputElement.addEventListener("paste", handlePaste);

        // Log when element is ready
        console.log("Event listeners attached to:", inputElement);

        return () => {
          inputElement.removeEventListener("input", handleInput);
          inputElement.removeEventListener("change", handleChange);
          inputElement.removeEventListener("paste", handlePaste);
        };
      }
    }
  }, [onCodeReceived]);

  // Create raw HTML input for web
  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <TextView style={styles.title}>Uncontrolled OTP Input Test</TextView>

        <div
          style={{
            width: "100%",
            maxWidth: "300px",
            margin: "20px auto",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            maxLength={10}
            autoFocus
            disabled={disabled}
            style={{
              width: "100%",
              height: "55px",
              border: "2px solid #e91e63",
              borderRadius: "8px",
              fontSize: "28px",
              fontWeight: "bold",
              color: "#333",
              backgroundColor: "#fff",
              textAlign: "center",
              letterSpacing: "10px",
              padding: "0 15px",
            }}
            onInput={(e: any) => {
              console.log("React onInput:", e.target.value);
            }}
            onChange={(e: any) => {
              console.log("React onChange:", e.target.value);
            }}
          />
        </div>

        <TextView style={styles.hint}>
          وقتی پیامک رسید، روی پیشنهاد کد بالای کیبورد بزنید
        </TextView>

        <View style={styles.infoBox}>
          <TextView style={styles.infoText}>📱 در Safari:</TextView>
          <TextView style={styles.infoText}>1. وقتی پیامک می‌رسد</TextView>
          <TextView style={styles.infoText}>
            2. بالای کیبورد "From Messages" نشان داده می‌شود
          </TextView>
          <TextView style={styles.infoText}>
            3. روی آن بزنید تا کد وارد شود
          </TextView>
        </View>

        <View style={styles.debugBox}>
          <TextView style={styles.debugText}>
            🔍 Debug: Check browser console
          </TextView>
          <TextView style={styles.debugText}>Domain: app.nilman.co</TextView>
          <TextView style={styles.debugText}>
            SMS Format: @app.nilman.co #123456
          </TextView>
        </View>
      </View>
    );
  }

  // Fallback for non-web platforms
  return (
    <View style={styles.container}>
      <TextView>This component is for web testing only</TextView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  hint: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginTop: 15,
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: "#f0f8ff",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  infoText: {
    fontSize: 13,
    color: "#333",
    marginBottom: 5,
    textAlign: "right",
  },
  debugBox: {
    backgroundColor: "#fff3cd",
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#ffc107",
  },
  debugText: {
    fontSize: 12,
    color: "#856404",
    marginBottom: 3,
    fontFamily: Platform.OS === "web" ? "monospace" : undefined,
  },
});
