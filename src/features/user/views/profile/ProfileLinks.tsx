import { useAuth } from "@/src/components/contexts/AuthContext";
import TextView from "@/src/components/ui/TextView";
import { profileStyles } from "@/src/features/user/styles";
import { useThemedStyles } from "@/src/hooks/useThemedStyles";
import { MapPin, Shield, SignOut } from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Theme } from "@/src/types/theme";
import { useTheme } from "@/src/components/contexts/ThemeContext";
import { useRouter } from "expo-router";

const ProfileLinks = () => {
  const { logout } = useAuth();
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <View style={styles.infoBox}>
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => router.push("/privacy")}
      >
        <TextView style={profileStyles.profileButtonText}>حریم خصوصی</TextView>
        <Shield size={24} color={theme.text} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => router.push("/address")}
      >
        <TextView style={profileStyles.profileButtonText}>آدرس ها</TextView>
        <MapPin size={24} color={theme.text} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.profileButton, styles.lastProfile]}
        onPress={handleLogout}
      >
        <TextView
          style={[profileStyles.profileButtonText, profileStyles.logoutText]}
        >
          خروج از حساب
        </TextView>
        <SignOut size={20} color="#e85959" />
      </TouchableOpacity>
    </View>
  );
};

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
    profileButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 8,
      gap: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    lastProfile: {
      borderBottomWidth: 0,
    },
  });
export default ProfileLinks;
