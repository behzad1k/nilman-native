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
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const codeRef = useRef<string[]>(new Array(6).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [inputKeys, setInputKeys] = useState<number[]>([0, 1, 2, 3, 4, 5]); // Force re-render by changing keys
  const hasTriggeredComplete = useRef<boolean>(false);
  const lastCompleteCode = useRef<string>("");
  const isAutoFilling = useRef<boolean>(false);

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
    // Force re-render by updating keys
    setInputKeys((prev) => prev.map((k) => k + 6));
    hasTriggeredComplete.current = false;
  };

  const setCodeData = (value: string, index: number) => {
    if (disabled) return;

    // Handle multiple characters (paste scenario or auto-fill)
    if (value.length > 1) {
      const chars = value.replace(/\D/g, "").slice(0, 6).split("");
      const newCode = new Array(6).fill("");

      // Fill with new characters
      chars.forEach((char, i) => {
        if (i < 6) {
          newCode[i] = char;
        }
      });

      resetInputs(newCode);

      // Focus on the next empty input or last filled input
      const nextIndex = Math.min(chars.length, 5);
      setTimeout(() => {
        inputRefs.current[nextIndex]?.focus();
        checkCompletion();
      }, 50);
      return;
    }

    // Handle single character
    if (!value || /^\d$/.test(value)) {
      codeRef.current[index] = value;

      // Move to next input if value is entered and not the last input
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

    // Handle backspace
    if (key === "Backspace") {
      if (codeRef.current[index]) {
        // Clear current input
        const newCode = [...codeRef.current];
        newCode[index] = "";
        resetInputs(newCode);
      } else if (index > 0) {
        // Move to previous input and clear it
        const newCode = [...codeRef.current];
        newCode[index - 1] = "";
        resetInputs(newCode);
        setTimeout(() => {
          inputRefs.current[index - 1]?.focus();
        }, 50);
      }
    }
  };

  const handlePaste = async () => {
    if (disabled) return;

    try {
      const clipboardContent = await Clipboard.getString();
      if (clipboardContent) {
        const pastedCode = clipboardContent
          .replace(/\D/g, "")
          .slice(0, 6)
          .split("");
        const newCode = new Array(6).fill("");

        pastedCode.forEach((char, i) => {
          if (i < 6) {
            newCode[i] = char;
          }
        });

        resetInputs(newCode);

        const nextIndex = Math.min(pastedCode.length, 5);
        setTimeout(() => {
          inputRefs.current[nextIndex]?.focus();
          checkCompletion();
        }, 50);
      }
    } catch (error) {
      console.log("Error reading clipboard:", error);
    }
  };

  // Handle auto-fill from SMS (iOS/Android)
  const handleAutoFill = useCallback(
    (value: string, index: number) => {
      if (disabled) return;

      // Check if this is an auto-fill event (typically longer strings)
      if (value.length >= 6) {
        isAutoFilling.current = true;
        const digits = value.replace(/\D/g, "").slice(0, 6);
        const newCode = new Array(6).fill("");

        // Fill with auto-filled code
        digits.split("").forEach((char, i) => {
          if (i < 6) {
            newCode[i] = char;
          }
        });

        resetInputs(newCode);

        // Focus on the last input
        setTimeout(() => {
          inputRefs.current[5]?.focus();
          isAutoFilling.current = false;
          checkCompletion();
        }, 50);
      } else {
        // Handle normal single character input
        setCodeData(value, index);
      }
    },
    [disabled, checkCompletion],
  );

  const renderInputs = (): ReactElement[] => {
    const inputs: ReactElement[] = [];

    for (let index = 0; index < 6; index++) {
      const isFirstInput = index === 0;

      inputs.push(
        <TextInput
          key={`${inputKeys[index]}`} // Use dynamic key to force re-mount
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
            // When pasting into first input, it receives the full code
            if (isFirstInput && value.length > 1) {
              handleAutoFill(value, index);
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
            autoComplete: isFirstInput ? "one-time-code" : "off",
          })}
          {...(Platform.OS === "android" && {
            autoComplete: isFirstInput ? "sms-otp" : "off",
            textContentType: isFirstInput ? "oneTimeCode" : undefined,
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

  // Web-specific auto-fill handling with Web OTP API
  useEffect(() => {
    if (Platform.OS === "web") {
      const handleWebAutoFill = () => {
        if ("OTPCredential" in window) {
          const abortController = new AbortController();

          navigator.credentials
            .get({
              // @ts-ignore - Web OTP API
              otp: { transport: ["sms"] },
              signal: abortController.signal,
            })
            .then((otp: any) => {
              if (otp && otp.code) {
                const otpCode = otp.code;
                if (otpCode.length === 6) {
                  const newCode = otpCode.split("");
                  resetInputs(newCode);

                  setTimeout(() => {
                    checkCompletion();
                  }, 50);
                }
              }
            })
            .catch((err: Error) => {
              console.log("Web OTP API error:", err);
            });

          return () => {
            abortController.abort();
          };
        }

        const firstInput = inputRefs.current[0];
        if (firstInput) {
          const handleInput = (event: any) => {
            const value = event.target.value;
            if (value.length >= 6) {
              handleAutoFill(value, 0);
            }
          };

          const webInput = firstInput as any;
          if (webInput.addEventListener) {
            webInput.addEventListener("input", handleInput);
            return () => {
              webInput.removeEventListener("input", handleInput);
            };
          }
        }
      };

      return handleWebAutoFill();
    }
  }, [handleAutoFill, checkCompletion]);

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
