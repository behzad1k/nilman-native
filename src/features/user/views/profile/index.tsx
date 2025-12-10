import { useAuth } from "@/src/components/contexts/AuthContext";
import { useTheme } from "@/src/components/contexts/ThemeContext";
import TextView from "@/src/components/ui/TextView";
import { useAppSelector } from "@/src/configs/redux/hooks";
import { profileStyles } from "@/src/features/user/styles";
import { ProfileCard } from "@/src/features/user/views/profile/ProfileCard";
import ProfileLinks from "@/src/features/user/views/profile/ProfileLinks";
import Settings from "@/src/features/user/views/profile/Settings";
import { useThemedStyles } from "@/src/hooks/useThemedStyles";
import { colors } from "@/src/styles/theme/colors";
import { Theme } from "@/src/types/theme";
import { formatPrice } from "@/src/utils/funs";
import { useRouter } from "expo-router";
import { Wallet } from "phosphor-react-native";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const ProfilePage = () => {
  const { isAuthenticated } = useAuth();
  const userReducer = useAppSelector((state) => state.user);
  const styles = useThemedStyles(createStyles);
  const theme = useTheme();
  const router = useRouter();

  if (!isAuthenticated) {
    router.push("/");
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: theme.theme.background }}
    >
      <View style={styles.profileMain}>
        <ProfileCard />
        <View style={[styles.infoBox, profileStyles.justifyCenter]}>
          <View style={profileStyles.walletBalance}>
            <TextView style={profileStyles.walletBalanceAmount}>
              {formatPrice(userReducer.data?.walletBalance)} تومان
            </TextView>
            <View style={profileStyles.walletBalanceLeft}>
              <TextView style={profileStyles.walletBalanceText}>
                موجودی کیف پول
              </TextView>
              <Wallet size={24} color={colors.pink} />
            </View>
          </View>
        </View>
        <Settings />
        <ProfileLinks />
      </View>
    </ScrollView>
  );
};

export default ProfilePage;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    infoBox: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    profileMain: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: 25,
      paddingHorizontal: 16,
      paddingBottom: 70,
    },
  });
