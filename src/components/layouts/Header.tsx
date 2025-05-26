import TextView from '@/src/components/ui/TextView';
import Typography from '@/src/styles/theme/typography';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowRight } from 'phosphor-react-native';
import { colors } from '@/src/styles/theme/colors';
import { spacing } from '@/src/styles/theme/spacing';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
                                                title = 'nilman',
                                                showBackButton = false,
                                                onBackPress,
                                                rightComponent,
                                              }) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <>
      <StatusBar backgroundColor={colors.midPink} barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          {showBackButton && (
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <ArrowRight size={24} color={colors.white} />
            </TouchableOpacity>
          )}
        </View>
        <TextView variant={'h2'}>{title}</TextView>
        <View style={styles.rightContainer}>
          {rightComponent || <View style={{ width: 24 }} />}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: colors.midPink,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.m,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  leftContainer: {
    width: 60,
    justifyContent: 'center',
  },
  rightContainer: {
    width: 60,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    fontFamily: 'poppins',
    fontWeight: 'bold',
    color: colors.white,
  },
});