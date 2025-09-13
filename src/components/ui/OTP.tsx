import React, { ReactElement, useEffect, useRef, useState, useCallback } from 'react';
import { View, TextInput, StyleSheet, Clipboard, Platform } from 'react-native';

interface OTPProps {
  code: string[];
  setCode: React.Dispatch<React.SetStateAction<string[]>>;
  onComplete: () => void;
  disabled?: boolean;
}

export function OTP({ code, setCode, onComplete, disabled = false }: OTPProps) {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const hasTriggeredComplete = useRef<boolean>(false);
  const lastCompleteCode = useRef<string>('');
  const isAutoFilling = useRef<boolean>(false);

  const setCodeData = (value: string, index: number) => {
    if (disabled) return;

    // Handle multiple characters (paste scenario or auto-fill)
    if (value.length > 1) {
      const newCode = [...code];
      const chars = value.slice(0, 6).split('');

      // Clear existing code first
      for (let i = 0; i < 6; i++) {
        newCode[i] = '';
      }

      // Fill with new characters
      chars.forEach((char, i) => {
        if (i < 6) {
          newCode[i] = char;
        }
      });

      setCode(newCode);
      hasTriggeredComplete.current = false;

      // Focus on the last filled input
      const nextIndex = Math.min(chars.length - 1, 5);
      setTimeout(() => {
        inputRefs.current[nextIndex]?.focus();
      }, 100);
      return;
    }

    // Handle single character
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next input if value is entered and not the last input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (disabled) return;

    // Handle backspace
    if (key === 'Backspace') {
      const newCode = [...code];
      if (newCode[index]) {
        // Clear current input
        newCode[index] = '';
        setCode(newCode);
        hasTriggeredComplete.current = false;
      } else if (index > 0) {
        // Move to previous input and clear it
        newCode[index - 1] = '';
        setCode(newCode);
        inputRefs.current[index - 1]?.focus();
        hasTriggeredComplete.current = false;
      }
    }
  };

  const handlePaste = async () => {
    if (disabled) return;

    try {
      const clipboardContent = await Clipboard.getString();
      if (clipboardContent) {
        const pastedCode = clipboardContent.replace(/\D/g, '').slice(0, 6).split('');
        const newCode = new Array(6).fill('');
        pastedCode.forEach((char, i) => {
          if (i < 6) newCode[i] = char;
        });
        setCode(newCode);
        hasTriggeredComplete.current = false;

        const nextIndex = Math.min(pastedCode.length, 5);
        inputRefs.current[nextIndex]?.focus();
      }
    } catch (error) {
      console.log('Error reading clipboard:', error);
    }
  };

  // Enhanced completion handler
  const handleComplete = useCallback(() => {
    const currentCode = code.join('');

    if (
      code.length === 6 &&
      code.every(digit => digit !== '') &&
      !hasTriggeredComplete.current &&
      currentCode !== lastCompleteCode.current
    ) {
      hasTriggeredComplete.current = true;
      lastCompleteCode.current = currentCode;

      setTimeout(() => {
        onComplete();
      }, 100);
    }
  }, [code, onComplete]);

  // Handle auto-fill from SMS (iOS/Android)
  const handleAutoFill = useCallback((value: string, index: number) => {
    if (disabled) return;

    // Check if this is an auto-fill event (typically longer strings)
    if (value.length >= 6) {
      isAutoFilling.current = true;
      const digits = value.replace(/\D/g, '').slice(0, 6);
      const newCode = digits.split('');

      // Pad with empty strings if needed
      while (newCode.length < 6) {
        newCode.push('');
      }

      setCode(newCode);
      hasTriggeredComplete.current = false;

      // Focus on the last input
      setTimeout(() => {
        inputRefs.current[5]?.focus();
        isAutoFilling.current = false;
      }, 100);
    } else {
      // Handle normal single character input
      setCodeData(value, index);
    }
  }, [disabled, setCode]);

  const renderInputs = (): ReactElement[] => {
    const inputs: ReactElement[] = [];

    for (let index = 0; index < 6; index++) {
      const isFirstInput = index === 0;

      inputs.push(
        <TextInput
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          style={[
            styles.otpInput,
            focusedIndex === index && styles.otpInputFocused,
            disabled && styles.otpInputDisabled
          ]}
          value={code[index] || ''}
          onChangeText={(value) => {
            if (isFirstInput && value.length >= 6) {
              // This is likely auto-fill
              handleAutoFill(value, index);
            } else {
              setCodeData(value, index);
            }
          }}
          onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(-1)}
          keyboardType="number-pad"
          maxLength={isFirstInput ? 6 : 1} // Allow longer input on first field for auto-fill
          autoFocus={isFirstInput}
          selectTextOnFocus
          textAlign="center"
          // Enhanced auto-fill properties
          textContentType={isFirstInput ? "oneTimeCode" : undefined}
          autoComplete={isFirstInput ? "sms-otp" : "off"}
          // iOS specific properties
          {...(Platform.OS === 'ios' && {
            textContentType: isFirstInput ? 'oneTimeCode' : undefined,
            autoComplete: isFirstInput ? 'sms-otp' : 'off',
          })}
          // Android specific properties
          {...(Platform.OS === 'android' && {
            autoComplete: isFirstInput ? 'sms-otp' : 'off',
            textContentType: isFirstInput ? 'oneTimeCode' : undefined,
          })}
          editable={!disabled}
          // Additional properties for better auto-fill support
          importantForAutofill={isFirstInput ? 'yes' : 'no'}
          autoCorrect={false}
          spellCheck={false}
          contextMenuHidden={true}
        />
      );
    }
    return inputs;
  };

  // Trigger completion check when code changes
  useEffect(() => {
    handleComplete();
  }, [handleComplete]);

  // Reset completion flag when code is cleared or changed significantly
  useEffect(() => {
    const filledDigits = code.filter(digit => digit !== '').length;
    if (filledDigits < 6) {
      hasTriggeredComplete.current = false;
    }
  }, [code]);

  // Web-specific auto-fill handling
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleWebAutoFill = () => {
        // Add event listener for web auto-fill
        const firstInput = inputRefs.current[0];
        if (firstInput) {
          const handleInput = (event: any) => {
            const value = event.target.value;
            if (value.length >= 6) {
              handleAutoFill(value, 0);
            }
          };

          // Type assertion for web
          const webInput = firstInput as any;
          if (webInput.addEventListener) {
            webInput.addEventListener('input', handleInput);

            return () => {
              webInput.removeEventListener('input', handleInput);
            };
          }
        }
      };

      return handleWebAutoFill();
    }
  }, [handleAutoFill]);

  return (
    <View style={styles.otpContainer}>
      <View style={styles.inputsContainer}>
        {renderInputs()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  otpContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  inputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
  },
  otpInputFocused: {
    borderWidth: 2,
    backgroundColor: '#fff',
  },
  otpInputDisabled: {
    backgroundColor: '#f0f0f0',
    color: '#999',
  },
});