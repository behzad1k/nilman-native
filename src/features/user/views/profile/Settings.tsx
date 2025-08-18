import { useDrawer } from '@/src/components/contexts/DrawerContext';
import LanguageSwitcher from '@/src/features/user/views/shared/LanguageSwitcher';
import TextView from '@/src/components/ui/TextView';
import { profileStyles } from '@/src/features/user/styles';
import ThemeSwitcher from '@/src/features/user/views/shared/ThemeSwitcher';
import { useLanguage } from '@/src/hooks/useLanguage';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { PaintBrush, Translate } from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Theme } from '@/src/types/theme'
import { useTheme } from '@/src/components/contexts/ThemeContext'

const Settings = () => {
  const { t } = useLanguage();
  const { openDrawer } = useDrawer();
  const styles = useThemedStyles(createStyles)
  const { theme } = useTheme();

  return (
    <View style={styles.infoBox}>
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => openDrawer('changeLanguage', <LanguageSwitcher/>, { drawerHeight: 200 })}
      >
        <TextView style={profileStyles.profileButtonText}>{t('general.changeLanguage')}</TextView>
        <Translate size={24} color={theme.text}/>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.profileButton, styles.lastProfile]}
        onPress={() => openDrawer('changeTheme', <ThemeSwitcher/>, { drawerHeight: 250 })}
      >
        <TextView style={profileStyles.profileButtonText}>{t('general.changeTheme')}</TextView>
        <PaintBrush size={24} color={theme.text}/>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  infoBox: {
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
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  lastProfile: {
    borderBottomWidth: 0
  }
})
export default Settings;