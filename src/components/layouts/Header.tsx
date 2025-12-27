import LogoIcon from "@/src/components/icons/LogoIcon";
import ThemeSwitchButton from "@/src/components/ui/DarkModeButton";
import LanguageSwitchButton from "@/src/components/ui/LanguageSwitchButton";
import TextView from "@/src/components/ui/TextView";
import ChristmasHeaderDecoration from "@/src/components/ui/ChristmasHeaderDecoration";
import ChristmasSparkle from "@/src/components/ui/ChristmasSparkle";
import { useLanguage } from "@/src/hooks/useLanguage";
import { useThemedStyles } from "@/src/hooks/useThemedStyles";
import { colors } from "@/src/styles/theme/colors";
import { spacing } from "@/src/styles/theme/spacing";
import { Theme } from "@/src/types/theme";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ArrowLeft, ArrowRight } from "react-native-feather";

interface HeaderProps {
  title?: string;
  onBackPress?: (() => void) | true;
}

export const Header: React.FC<HeaderProps> = ({
  title = "nilman",
  onBackPress = undefined,
}) => {
  const navigation = useNavigation();
  const styles = useThemedStyles(createStyles);
  const { currentLanguage } = useLanguage();
  const handleBackPress = () => {
    if (typeof onBackPress === "function") {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View>
      {/* Christmas Lights Decoration */}

      <View style={styles.container}>
        <View style={styles.rightContainer}>
          {/* <LanguageSwitchButton/> */}
          <ThemeSwitchButton />
        </View>
        <ChristmasSparkle>
          <View style={styles.titleContainer}>
            <LogoIcon width={35} height={35} fill={colors.pink} />
            <TextView style={styles.title}>
              {currentLanguage == "fa" ? "نیلمان" : "nilman"}
            </TextView>
          </View>
        </ChristmasSparkle>

        <View style={styles.leftContainer}>
          {onBackPress != undefined && (
            <TouchableOpacity
              onPress={handleBackPress}
              style={styles.backButton}
            >
              <ArrowRight width={24} color={colors.pink} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      height: 50,
      backgroundColor: theme.primary,
      paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomWidth: 0.5,
      borderBottomColor: theme.border,
      borderStyle: "solid",
    },
    leftContainer: {
      width: 60,
      justifyContent: "center",
    },
    titleContainer: {
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
      height: "auto",
      justifyContent: "center",
      flex: 1,
    },
    rightContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    backButton: {
      padding: spacing.xs,
      alignItems: "flex-end",
    },
    title: {
      color: colors.pink,
      fontSize: 25,
      height: "100%",
    },
  });
