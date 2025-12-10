import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet, Platform } from "react-native";
import TextView from "@/src/components/ui/TextView";

interface DiagnosticInfo {
  hasOTPCredential: boolean;
  hasCredentials: boolean;
  hasNavigator: boolean;
  isSecureContext: boolean;
  protocol: string;
  hostname: string;
  userAgent: string;
}

export function OTPDiagnostic() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticInfo | null>(null);
  const [receivedCode, setReceivedCode] = useState<string>("");

  useEffect(() => {
    if (Platform.OS === "web") {
      const info: DiagnosticInfo = {
        hasOTPCredential: "OTPCredential" in window,
        hasCredentials: "credentials" in navigator,
        hasNavigator: typeof navigator !== "undefined",
        isSecureContext: window.isSecureContext,
        protocol: window.location.protocol,
        hostname: window.location.hostname,
        userAgent: navigator.userAgent,
      };

      setDiagnostics(info);
      console.log("=== OTP Diagnostics ===", info);
    }
  }, []);

  const handleInputChange = (text: string) => {
    console.log("Input received:", text);
    setReceivedCode(text);

    // Extract 6 digits
    const digits = text.replace(/\D/g, "");
    if (digits.length >= 6) {
      console.log("6-digit code detected:", digits.slice(0, 6));
    }
  };

  if (Platform.OS !== "web") {
    return (
      <View style={styles.container}>
        <TextView>This diagnostic is for web only</TextView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextView style={styles.title}>Web OTP Diagnostic</TextView>

      {diagnostics && (
        <View style={styles.diagnosticBox}>
          <TextView style={styles.diagnosticItem}>
            ✓ Navigator: {diagnostics.hasNavigator ? "✅" : "❌"}
          </TextView>
          <TextView style={styles.diagnosticItem}>
            ✓ Credentials API: {diagnostics.hasCredentials ? "✅" : "❌"}
          </TextView>
          <TextView style={styles.diagnosticItem}>
            ✓ OTPCredential: {diagnostics.hasOTPCredential ? "✅" : "❌"}
          </TextView>
          <TextView style={styles.diagnosticItem}>
            ✓ Secure Context: {diagnostics.isSecureContext ? "✅" : "❌"}
          </TextView>
          <TextView style={styles.diagnosticItem}>
            Protocol: {diagnostics.protocol}
          </TextView>
          <TextView style={styles.diagnosticItem}>
            Hostname: {diagnostics.hostname}
          </TextView>
          <TextView style={[styles.diagnosticItem, styles.userAgent]}>
            User Agent: {diagnostics.userAgent}
          </TextView>
        </View>
      )}

      <TextView style={styles.sectionTitle}>Test Input (autocomplete)</TextView>
      <TextInput
        style={styles.input}
        placeholder="Type or paste code"
        onChangeText={handleInputChange}
        value={receivedCode}
        autoComplete="one-time-code"
        inputMode="numeric"
        autoFocus
      />

      {receivedCode && (
        <TextView style={styles.receivedCode}>
          Received: {receivedCode}
        </TextView>
      )}

      <View style={styles.infoBox}>
        <TextView style={styles.infoTitle}>Requirements for Web OTP API:</TextView>
        <TextView style={styles.infoItem}>• HTTPS (secure context)</TextView>
        <TextView style={styles.infoItem}>• Chrome/Edge 93+ or Safari 14+</TextView>
        <TextView style={styles.infoItem}>• SMS must include @{diagnostics?.hostname}</TextView>
        <TextView style={styles.infoItem}>• SMS format: #123456</TextView>
        <TextView style={styles.infoItem}>• User interaction required</TextView>
      </View>

      <View style={styles.infoBox}>
        <TextView style={styles.infoTitle}>Your SMS should look like:</TextView>
        <TextView style={styles.smsExample}>
          کد ورود شما: 294285{"\n"}
          @{diagnostics?.hostname} #294285
        </TextView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  diagnosticBox: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  diagnosticItem: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: "monospace",
  },
  userAgent: {
    fontSize: 12,
    color: "#666",
  },
  input: {
    width: "100%",
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
  receivedCode: {
    marginTop: 10,
    fontSize: 16,
    color: "#28a745",
    fontWeight: "bold",
    textAlign: "center",
  },
  infoBox: {
    backgroundColor: "#e7f3ff",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoItem: {
    fontSize: 13,
    marginBottom: 5,
    paddingLeft: 10,
  },
  smsExample: {
    fontSize: 13,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 4,
    fontFamily: "monospace",
    marginTop: 5,
  },
});
