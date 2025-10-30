import AddressManagePage from '@/src/features/address/views/manage';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { RootStackParamList } from '@/src/types/navigation';
import { Theme } from '@/src/types/theme';
import { RouteProp, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

type AddressManageRouteProp = RouteProp<RootStackParamList, 'address/manage'>;
type AddressManageNavigationProp = StackNavigationProp<RootStackParamList, 'address/manage'>;

const AddAddress = () => {
  const route = useRoute<AddressManageRouteProp>();
  const styles = useThemedStyles(createStyles);

  route.params?.id;

  return (
    <SafeAreaView style={styles.container}>
      <AddressManagePage />
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primary,
  },
});

export default AddAddress;
