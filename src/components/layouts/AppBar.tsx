
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { House, Clipboard, PlusCircle, User } from 'phosphor-react-native';
import { colors } from '@/src/styles/theme/colors';
import { spacing } from '@/src/styles/theme/spacing';

export const AppBar: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const userReducer: any = undefined;
  // const userReducer = useAppSelector((state) => state.userReducer);

  const currentRoute = route.name;

  const isActive = (routeName: string) => {
    return currentRoute === routeName;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate('Home' as never)}      >
        <House
          weight={isActive('Home') ? 'fill' : 'regular'}
          color={colors.white}
          size={24}
        />
        <Text style={styles.tabText}>خانه</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate('Orders' as never)}
      >
        <Clipboard
          weight={isActive('Orders') ? 'fill' : 'regular'}
          color={colors.white}
          size={24}
        />
        <Text style={styles.tabText}>سفارش ها</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate('NewOrder' as never)}
      >

      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() =>
          navigation.navigate((userReducer.isLoggedIn ? 'Profile' : 'Login') as never)
        }
      >
        <User
          weight={isActive('Profile') || isActive('Login') ? 'fill' : 'regular'}
          color={colors.white}
          size={24}
        />
        <Text style={styles.tabText}>
          {userReducer.isLoggedIn ? 'پروفایل' : 'ورود'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.midPink,
    height: 75,
    width: width,
    position: 'absolute',
    bottom: 0,
    paddingBottom: 13,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    // fontFamily: typography.fontFamily.regular,
    // fontSize: typography.fontSize.xs,
    color: colors.white,
    marginTop: spacing.xs,
  },
});
