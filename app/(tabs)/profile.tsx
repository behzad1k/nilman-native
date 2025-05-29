import { Header } from '@/src/components/layouts/Header';
import TextView from '@/src/components/ui/TextView';
import { useAppSelector } from '@/src/configs/redux/hooks';
import { services } from '@/src/configs/services';
import { profileStyles } from '@/src/features/user/styles';
import { ProfileCard } from '@/src/features/user/views/shared/ProfileCard';
import { formatPrice } from '@/src/utils/funs';
import { useNavigation } from '@react-navigation/native';
import { MapPin, Shield, SignOut, Wallet } from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { colors } from '@/src/styles/theme/colors'

export default function Profile() {
  const userReducer = useAppSelector((state) => state.user);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogout = async () => {
    // Alert.alert(
    //   'خروج از حساب',
    //   'آیا مطمئن هستید که می‌خواهید خارج شوید؟',
    //   [
    //     {
    //       text: 'لغو',
    //       style: 'cancel',
    //     },
    //     {
    //       text: 'خروج',
    //       style: 'destructive',
    //       onPress: async () => {
    //         await removeNewOrder();
    //         await removeStep();
    //         logout(dispatch);
    //         navigation.navigate('Home' as never);
    //       },
    //     },
    //   ]
    // );
  };

  useEffect(() => {
    (async () => {
      setIsLoggedIn(await services.auth.isAuthenticated());
    });
  }, []);
  return (
    <>
      <Header/>
      <ScrollView style={profileStyles.profileMain} showsVerticalScrollIndicator={false}>
        <ProfileCard />

        <View style={[profileStyles.infoBox, profileStyles.justifyCenter]}>
          <View style={profileStyles.walletBalance}>
            <TextView style={profileStyles.walletBalanceAmount}>
              {formatPrice(userReducer.data?.walletBalance)} تومان
            </TextView>
            <View style={profileStyles.walletBalanceLeft}>
              <TextView style={profileStyles.walletBalanceText}>موجودی کیف پول</TextView>
              <Wallet size={24} color={colors.logoPink} />
            </View>
          </View>
        </View>

        <View style={profileStyles.infoBox}>
          <TouchableOpacity
            style={profileStyles.profileButton}
            onPress={() => navigation.navigate('Privacy' as never)}
          >
            <Shield size={24} color="#666" />
            <TextView style={profileStyles.profileButtonText}>حریم خصوصی</TextView>
          </TouchableOpacity>

          <TouchableOpacity
            style={profileStyles.profileButton}
            onPress={() => navigation.navigate('Address' as never)}
          >
            <MapPin size={24} color="#666" />
            <TextView style={profileStyles.profileButtonText}>آدرس ها</TextView>
          </TouchableOpacity>

          <TouchableOpacity
            style={profileStyles.profileButton}
            onPress={handleLogout}
          >
            <SignOut size={20} color="#e85959" />
            <TextView style={[profileStyles.profileButtonText, profileStyles.logoutText]}>خروج از حساب</TextView>
          </TouchableOpacity>
        </View>
      </ScrollView>

    </>
  );
}
