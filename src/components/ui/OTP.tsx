import React, { ReactElement, useEffect, useRef, useState, useCallback } from 'react';
import { View, TextInput, StyleSheet, Clipboard } from 'react-native';

interface OTPProps {
  code: string[];
  setCode: React.Dispatch<React.SetStateAction<string[]>>;
  onComplete: () => void;
  disabled?: boolean; // Add this to prevent input during verification
}

export function OTP({ code, setCode, onComplete, disabled = false }: OTPProps) {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const hasTriggeredComplete = useRef<boolean>(false);
  const lastCompleteCode = useRef<string>('');

  const setCodeData = (value: string, index: number) => {
    if (disabled) return;

    // Handle multiple characters (paste scenario)
    if (value.length > 1) {
      const newCode = [...code];
      const chars = value.slice(0, 6).split('');
      chars.forEach((char, i) => {
        if (index + i < 6) {
          newCode[index + i] = char;
        }
      });
      setCode(newCode);
      // Focus on the next empty input or last input
      const nextIndex = Math.min(index + chars.length, 5);
      inputRefs.current[nextIndex]?.focus();
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
        // Reset completion flag when user modifies code
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
        hasTriggeredComplete.current = false; // Reset flag
        // Focus on the next empty input or last filled input
        const nextIndex = Math.min(pastedCode.length, 5);
        inputRefs.current[nextIndex]?.focus();
      }
    } catch (error) {
      console.log('Error reading clipboard:', error);
    }
  };

  // Debounced completion handler
  const handleComplete = useCallback(() => {
    const currentCode = code.join('');

    // Only trigger if:
    // 1. We have 6 digits
    // 2. All digits are filled
    // 3. We haven't already triggered for this code
    // 4. The code is different from the last completed code
    if (
      code.length === 6 &&
      code.every(digit => digit !== '') &&
      !hasTriggeredComplete.current &&
      currentCode !== lastCompleteCode.current
    ) {
      hasTriggeredComplete.current = true;
      lastCompleteCode.current = currentCode;

      // Add a small delay to prevent rapid-fire calls
      setTimeout(() => {
        onComplete();
      }, 100);
    }
  }, [code, onComplete]);

  const renderInputs = (): ReactElement[] => {
    const inputs: ReactElement[] = [];
    for (let index = 0; index < 6; index++) {
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
          onChangeText={(value) => setCodeData(value, index)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(-1)}
          keyboardType="number-pad"
          maxLength={6}
          autoFocus={index === 0}
          selectTextOnFocus
          textAlign="center"
          textContentType="oneTimeCode"
          autoComplete={index === 0 ? 'sms-otp' : 'off'}
          editable={!disabled}
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
