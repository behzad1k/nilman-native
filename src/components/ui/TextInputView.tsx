import { FontFamilies } from '@/src/styles/theme/typography';
import React, { forwardRef } from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';

interface TextInputViewProps extends TextInputProps {
  error?: string;
}

const TextInputView = forwardRef<TextInput, TextInputViewProps>(
  ({ style, error, ...props }, ref) => {
    return (
      <View>
        <TextInput
          ref={ref}

          style={[
            {
              fontFamily: FontFamilies.vazir.medium,
              borderWidth: 1,
              borderColor: error ? 'red' : 'gray',
              padding: 10,
              borderRadius: 5,
            },
            style,
          ]}
          {...props}
        />
        {error && <Text style={{ color: 'red', fontSize: 12 }}>{error}</Text>}
      </View>
    );
  }
);

export default TextInputView;
