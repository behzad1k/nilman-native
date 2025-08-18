import TextView from '@/src/components/ui/TextView';
import { useAppSelector } from '@/src/configs/redux/hooks';
import { profileCardStyles } from '@/src/features/user/styles';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import React from 'react';
import {
  View,
  Text,
  Image, StyleSheet,
} from 'react-native';
import { colors } from '@/src/styles/theme/colors'
import { Theme } from '@/src/types/theme'

export function ProfileCard() {
  const profile = useAppSelector((state) => state.user.data);
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.container}>
      <TextView style={profileCardStyles.profileTitle}>پروفایل</TextView>
      <View style={profileCardStyles.profileCardContainer}>
        <View style={profileCardStyles.profileCardPicture}>
          <View style={profileCardStyles.profilePicture}>
            <Image
              // source={{
              //   uri: profile?.profilePic?.url
              // }}
              style={styles.profileImage}
              source={require('@/src/assets/images/girl.png')}
            />
          </View>
        </View>
        <View style={profileCardStyles.profileCardDetails}>
          <View style={styles.iconInput}>
            <TextView style={styles.inputText}>
              {profile?.name + " " + profile?.lastName || 'نام خانوادگی'}
            </TextView>
          </View>
          <View style={styles.iconInput}>
            <TextView style={styles.inputText}>
              {profile?.nationalCode || 'کد ملی'}
            </TextView>
          </View>
          <View style={styles.iconInput}>
            <TextView style={styles.inputText}>
              {profile?.phoneNumber || 'شماره تلفن'}
            </TextView>
          </View>
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },

    iconInput: {
      backgroundColor: theme.background,
      borderRadius: 8,
      padding: 8,
      borderColor: '#e9ecef',
    },
    inputText: {
      fontSize: 14,
      color: theme.text,
    },
    profileImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      backgroundColor: theme.background,
    },
  })