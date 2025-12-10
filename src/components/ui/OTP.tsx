import React, {
  ReactElement,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { View, TextInput, StyleSheet, Clipboard, Platform } from "react-native";

interface OTPProps {
  onComplete: (code: string) => void;
  disabled?: boolean;
}

export function OTP({ onComplete, disabled = false }: OTPProps) {
  // Web implementation - pure HTML with form wrapper
  if (Platform.OS === "web") {
    return <WebOTP onComplete={onComplete} disabled={disabled} />;
  }

  // Native implementation - keep existing logic
  return <NativeOTP onComplete={onComplete} disabled={disabled} />;
}

// Web-specific OTP component with form wrapper and uncontrolled inputs
function WebOTP({ onComplete, disabled }: OTPProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const hasSubmitted = useRef(false);

  const handleInput = (e: any, index: number) => {
    if (disabled || hasSubmitted.current) return;

    const value = e.target.value;
    console.log(`Input ${index} changed:`, value);

    // Handle auto-fill or paste (multiple characters)
    if (value.length > 1) {
      const digits = value.replace(/\D/g, "").slice(0, 6);
      console.log("Auto-fill/paste detected, digits:", digits);

      // Fill all inputs
      digits.split("").forEach((digit: any, i: number) => {
        if (inputRefs.current[i]) {
          inputRefs.current[i]!.value = digit;
        }
      });

      // Check if complete
      if (digits.length === 6) {
        hasSubmitted.current = true;
        console.log("Code complete:", digits);
        onComplete(digits);
        setTimeout(() => {
          hasSubmitted.current = false;
        }, 1000);
      } else {
        // Focus next empty input
        const nextIndex = Math.min(digits.length, 5);
        inputRefs.current[nextIndex]?.focus();
      }
      return;
    }

    // Handle single character input
    const digit = value.replace(/\D/g, "");
    if (digit) {
      e.target.value = digit;

      // Move to next input
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      // Check if all inputs are filled
      const allValues = inputRefs.current
        .map((input) => input?.value || "")
        .join("");

      if (allValues.length === 6 && !hasSubmitted.current) {
        hasSubmitted.current = true;
        console.log("Code complete:", allValues);
        onComplete(allValues);
        setTimeout(() => {
          hasSubmitted.current = false;
        }, 1000);
      }
    } else {
      e.target.value = "";
    }
  };

  const handleKeyDown = (e: any, index: number) => {
    if (disabled) return;

    // Handle backspace
    if (e.key === "Backspace") {
      const input = inputRefs.current[index];
      if (!input?.value && index > 0) {
        // If current input is empty, move to previous and clear it
        const prevInput = inputRefs.current[index - 1];
        if (prevInput) {
          prevInput.value = "";
          prevInput.focus();
        }
      }
    }
  };

  const handlePaste = (e: any) => {
    if (disabled) return;

    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").slice(0, 6);

    console.log("Paste detected, digits:", digits);

    // Fill inputs with pasted digits
    digits.split("").forEach((digit: any, i: number) => {
      if (inputRefs.current[i]) {
        inputRefs.current[i]!.value = digit;
      }
    });

    // Check if complete
    if (digits.length === 6 && !hasSubmitted.current) {
      hasSubmitted.current = true;
      console.log("Code complete from paste:", digits);
      onComplete(digits);
      setTimeout(() => {
        hasSubmitted.current = false;
      }, 1000);
    } else {
      // Focus next empty input
      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  useEffect(() => {
    // Reset on mount
    hasSubmitted.current = false;
    inputRefs.current.forEach((input) => {
      if (input) input.value = "";
    });
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            name={index === 0 ? "one-time-code" : `otp-${index}`}
            maxLength={index === 0 ? 10 : 1}
            autoFocus={index === 0}
            disabled={disabled}
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            onInput={(e) => handleInput(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            style={{
              width: "11%",
              height: "50px",
              border: "2px solid #ddd",
              borderRadius: "8px",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#333",
              backgroundColor: disabled ? "#f0f0f0" : "#f9f9f9",
              textAlign: "center",
              outline: "none",
              transition: "all 0.2s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#e91e63";
              e.target.style.backgroundColor = "#fff";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#ddd";
              e.target.style.backgroundColor = disabled ? "#f0f0f0" : "#f9f9f9";
            }}
          />
        ))}
      </form>
    </div>
  );
}

// Native OTP component - existing implementation
function NativeOTP({ onComplete, disabled }: OTPProps) {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const codeRef = useRef<string[]>(new Array(6).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [inputKeys, setInputKeys] = useState<number[]>([0, 1, 2, 3, 4, 5]);
  const hasTriggeredComplete = useRef<boolean>(false);
  const lastCompleteCode = useRef<string>("");

  const checkCompletion = useCallback(() => {
    const currentCode = codeRef.current.join("");
    if (
      codeRef.current.length === 6 &&
      codeRef.current.every((digit) => digit !== "") &&
      !hasTriggeredComplete.current &&
      currentCode !== lastCompleteCode.current
    ) {
      hasTriggeredComplete.current = true;
      lastCompleteCode.current = currentCode;
      setTimeout(() => {
        onComplete(currentCode);
      }, 100);
    }
  }, [onComplete]);

  const resetInputs = (newCode: string[]) => {
    codeRef.current = [...newCode];
    setInputKeys((prev) => prev.map((k) => k + 6));
    hasTriggeredComplete.current = false;
  };

  const setCodeData = (value: string, index: number) => {
    if (disabled) return;

    if (value.length > 1) {
      const chars = value.replace(/\D/g, "").slice(0, 6).split("");
      const newCode = new Array(6).fill("");

      chars.forEach((char, i) => {
        if (i < 6) {
          newCode[i] = char;
        }
      });

      resetInputs(newCode);

      const nextIndex = Math.min(chars.length, 5);
      setTimeout(() => {
        inputRefs.current[nextIndex]?.focus();
        checkCompletion();
      }, 50);
      return;
    }

    if (!value || /^\d$/.test(value)) {
      codeRef.current[index] = value;

      if (value && index < 5) {
        setTimeout(() => {
          inputRefs.current[index + 1]?.focus();
        }, 0);
      }

      checkCompletion();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (disabled) return;

    if (key === "Backspace") {
      if (codeRef.current[index]) {
        const newCode = [...codeRef.current];
        newCode[index] = "";
        resetInputs(newCode);
      } else if (index > 0) {
        const newCode = [...codeRef.current];
        newCode[index - 1] = "";
        resetInputs(newCode);
        setTimeout(() => {
          inputRefs.current[index - 1]?.focus();
        }, 50);
      }
    }
  };

  const renderInputs = (): ReactElement[] => {
    const inputs: ReactElement[] = [];

    for (let index = 0; index < 6; index++) {
      const isFirstInput = index === 0;

      inputs.push(
        <TextInput
          key={`${inputKeys[index]}`}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          style={[
            styles.otpInput,
            focusedIndex === index && styles.otpInputFocused,
            disabled && styles.otpInputDisabled,
          ]}
          defaultValue={codeRef.current[index] || ""}
          onChangeText={(value) => {
            if (isFirstInput && value.length > 1) {
              const digits = value.replace(/\D/g, "").slice(0, 6);
              const newCode = new Array(6).fill("");
              digits.split("").forEach((char, i) => {
                if (i < 6) {
                  newCode[i] = char;
                }
              });
              resetInputs(newCode);
              setTimeout(() => {
                inputRefs.current[5]?.focus();
                checkCompletion();
              }, 50);
            } else {
              setCodeData(value, index);
            }
          }}
          onKeyPress={({ nativeEvent }) =>
            handleKeyPress(nativeEvent.key, index)
          }
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(-1)}
          keyboardType="number-pad"
          maxLength={isFirstInput ? 6 : 1}
          autoFocus={isFirstInput && index === 0}
          selectTextOnFocus
          textAlign="center"
          textContentType={isFirstInput ? "oneTimeCode" : undefined}
          autoComplete={isFirstInput ? "one-time-code" : "off"}
          {...(Platform.OS === "ios" && {
            textContentType: isFirstInput ? "oneTimeCode" : undefined,
          })}
          {...(Platform.OS === "android" && {
            autoComplete: isFirstInput ? "sms-otp" : "off",
          })}
          editable={!disabled}
          importantForAutofill={isFirstInput ? "yes" : "no"}
          autoCorrect={false}
          spellCheck={false}
          contextMenuHidden={true}
        />,
      );
    }

    return inputs;
  };

  return (
    <View style={styles.otpContainer}>
      <View style={styles.inputsContainer}>{renderInputs()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  otpContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  inputsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 8,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  },
  otpInputFocused: {
    borderWidth: 2,
    backgroundColor: "#fff",
  },
  otpInputDisabled: {
    backgroundColor: "#f0f0f0",
    color: "#999",
  },
});
