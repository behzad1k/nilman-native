import React, { useRef } from "react";
import { Platform } from "react-native";

interface IOSOptimizedOTPProps {
  onCodeReceived: (code: string) => void;
  disabled?: boolean;
}

export function IOSOptimizedOTP({
  onCodeReceived,
  disabled = false,
}: IOSOptimizedOTPProps) {
  const hasSubmitted = useRef(false);

  const handleInput = (e: any) => {
    const value = e.target.value;
    console.log("📱 Input:", value);

    if (value && !hasSubmitted.current) {
      const digits = value.replace(/\D/g, "");

      if (digits.length >= 6) {
        const code = digits.slice(0, 6);
        console.log("✅ Code:", code);
        hasSubmitted.current = true;
        onCodeReceived(code);
        setTimeout(() => {
          hasSubmitted.current = false;
        }, 1000);
      }
    }
  };

  if (Platform.OS !== "web") {
    return null;
  }

  return (
    <div style={{ width: "100%", padding: "0 10px" }}>
      {/* CRITICAL: Form wrapper for iOS AutoFill */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        style={{
          width: "100%",
          maxWidth: "300px",
          margin: "20px auto",
        }}
      >
        <input
          // Identity
          id="one-time-code"
          name="one-time-code"
          // Type
          type="text"
          // AutoFill attributes - CRITICAL
          autoComplete="one-time-code"
          inputMode="numeric"
          // Disable interfering features
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          // Limits
          maxLength={10}
          placeholder="000000"
          // Behavior
          autoFocus
          disabled={disabled}
          // Handler
          onInput={handleInput}
          // Styling
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
            boxSizing: "border-box",

            // Remove any outline on focus
            outline: "none",
          }}
        />
      </form>

      <div
        style={{
          textAlign: "center",
          fontSize: "12px",
          color: "#999",
          marginTop: "10px",
          fontFamily: "monospace",
        }}
      >
        Check console for logs
      </div>
    </div>
  );
}
