import TextView from '@/src/components/ui/TextView';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { colors, Theme } from '@/src/styles/theme/colors';
import { spacing } from '@/src/styles/theme/spacing';
import { useNavigation } from '@react-navigation/native';
import { ArrowRight } from 'phosphor-react-native';
import React from 'react';
import { StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';

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
  const styles = useThemedStyles(createStyles);

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <>
      <StatusBar backgroundColor={colors.darkPink} barStyle="light-content"/>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          {showBackButton && (
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <ArrowRight size={24} color={colors.white}/>
            </TouchableOpacity>
          )}
        </View>
        <TextView variant={'h3'} style={styles.title}>{title}</TextView>
        <View style={styles.rightContainer}>
          {rightComponent || <View style={{ width: 24 }}/>}
        </View>
      </View>
    </>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      height: 70,
      backgroundColor: colors.logoPink,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
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
      color: theme.primary,
      fontSize: 28

    },
  });