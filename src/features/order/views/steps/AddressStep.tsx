import SelectBoxView from '@/src/components/ui/SelectBoxView';
import TextView from '@/src/components/ui/TextView';
import { useAppSelector } from '@/src/configs/redux/hooks';
import { Addresses } from '@/src/features/address/views/Addresses';
import { Address } from '@/src/features/address/types';
import { Form } from '@/src/features/order/types';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { Theme } from '@/src/types/theme';
import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

interface AddressStepProps {
  selected: Form;
  setSelected: React.Dispatch<React.SetStateAction<Form>>;
  setIsNextStepAllowed: (value: boolean) => void;
}

const AddressStep = ({
                       selected,
                       setSelected,
                       setIsNextStepAllowed
                     }: AddressStepProps) => {
  const userReducer = useAppSelector(state => state.user);
  const styles = useThemedStyles(createStyles);
  const availableWorkers = useMemo(() => {
    return userReducer.workers.filter(worker =>
      Object.keys(selected.options).every(serviceId =>
        worker.services?.some(service => service.id.toString() === serviceId)
      )
    );
  }, [userReducer.workers, selected.options]);

  const handleSelectAddress = useCallback((address: Address) => {
    setSelected((prev: Form) => ({
      ...prev,
      address: address
    }));
    setIsNextStepAllowed(true);
  }, [setSelected, setIsNextStepAllowed]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {availableWorkers.length > 0 && userReducer.data?.isWorkerChoosable && (
          <View style={styles.workerSection}>
            <TextView style={styles.hintText}>انتخاب از استایلیست های پیشین</TextView>
            <SelectBoxView
              placeholder='انتخاب استایلیست'
              showDropdownIcon={false}
              options={[{value: null, label: 'انتخاب خودکار'} , ...availableWorkers.map(e => ({ label: `${e.name} ${e.lastName}`, value: e.id.toString()}))]}
              onChange={(value) => setSelected((prev) => ({ ...prev, worker: value ? value.toString(): null }))}
              value={selected.worker || null}
            />
          </View>
        )}

        <View style={styles.addressSection}>
          <TextView style={styles.hintText}>انتخاب آدرس</TextView>
          <View style={styles.addressContainer}>
            <Addresses onClick={handleSelectAddress} editable={true} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {},
  workerSection: {
    marginBottom: 24,
  },
  hintText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  addressSection: {
    backgroundColor: theme.background,
    flex: 1,
  },
  addressContainer: {
    backgroundColor: theme.background,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default AddressStep;