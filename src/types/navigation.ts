import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  'Order': {
    isUrgent?: boolean;
    isMulti?: boolean;
  };
  'privacy': undefined;
  'profile': undefined;
  'cart': undefined;
  'address': undefined;
  'address/manage': { id?: number} | undefined
};

export type OrderRouteProp = RouteProp<RootStackParamList, 'Order'>;
export type OrderNavigationProp = StackNavigationProp<RootStackParamList, 'Order'>;

type AddressRouteProp = RouteProp<RootStackParamList, 'address'>;
type AddressNavigationProp = StackNavigationProp<RootStackParamList, 'address'>;


type AddressManageRouteProp = RouteProp<RootStackParamList, 'address/manage'>;
type AddressManageNavigationProp = StackNavigationProp<RootStackParamList, 'address/manage'>;


export type NavigationProp = StackNavigationProp<RootStackParamList>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
