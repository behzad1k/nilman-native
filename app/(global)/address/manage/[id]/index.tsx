import { Header } from '@/src/components/layouts/Header';
import AddressManagePage from '@/src/features/address/views/manage';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { RootStackParamList } from '@/src/types/navigation';
import { Theme } from '@/src/types/theme';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

type AddressManageRouteProp = RouteProp<RootStackParamList, 'address/manage'>;
type AddressManageNavigationProp = StackNavigationProp<RootStackParamList, 'address/manage'>;

const EditAddress = () => {
  const navigation = useNavigation<AddressManageNavigationProp>();
  const route = useRoute<AddressManageRouteProp>();
  const styles = useThemedStyles(createStyles);

  return (
    <SafeAreaView style={styles.container}>
      <Header onBackPress={true}/>
      <AddressManagePage paramId={route.params?.id}/>
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primary,
  },
});

export default EditAddress;
