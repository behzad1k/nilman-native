import TextView from '@/src/components/ui/TextView';
import { useAppSelector } from '@/src/configs/redux/hooks';
import { profileCardStyles } from '@/src/features/user/styles';
import React from 'react';
import {
  View,
  Text,
  Image,
} from 'react-native';

export function ProfileCard() {
  const profile = useAppSelector((state) => state.user.data);
  console.log(profile);
  return (
    <View style={profileCardStyles.infoBox}>
      <TextView style={profileCardStyles.profileTitle}>پروفایل</TextView>
      <View style={profileCardStyles.profileCardContainer}>
        <View style={profileCardStyles.profileCardPicture}>
          <View style={profileCardStyles.profilePicture}>
            <Image
              source={{
                uri: profile?.profilePic?.url || 'https://via.placeholder.com/80x80/cccccc/666666?text=User'
              }}
              style={profileCardStyles.profileImage}
              defaultSource={require('@/src/assets/images/girl.png')}
            />
          </View>
        </View>
        <View style={profileCardStyles.profileCardDetails}>
          <View style={profileCardStyles.iconInput}>
            <TextView style={profileCardStyles.inputText}>
              {profile?.name + " " + profile?.lastName || 'نام خانوادگی'}
            </TextView>
          </View>
          <View style={profileCardStyles.iconInput}>
            <TextView style={profileCardStyles.inputText}>
              {profile?.nationalCode || 'کد ملی'}
            </TextView>
          </View>
          <View style={profileCardStyles.iconInput}>
            <TextView style={profileCardStyles.inputText}>
              {profile?.phoneNumber || 'شماره تلفن'}
            </TextView>
          </View>
        </View>
      </View>
    </View>
  );
}
