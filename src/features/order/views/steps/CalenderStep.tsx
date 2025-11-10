import TextView from '@/src/components/ui/TextView';
import { calenderStepStyles } from '@/src/features/order/styles/calenderStep';
import { Form, Step } from '@/src/features/order/types';
import { useLanguage } from '@/src/hooks/useLanguage';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { colors } from '@/src/styles/theme/colors';
import { Theme } from '@/src/types/theme';
import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Toast } from 'toastify-react-native';
import moment from 'jalali-moment';

interface Props {
  selected: Form;
  setSelected: React.Dispatch<React.SetStateAction<Form>>;
  setStep: React.Dispatch<React.SetStateAction<Step>>;
}

const CalendarStep = ({ setSelected, selected }: Props) => {
  const [calTab, setCalTab] = useState(0);
  const { t, isRTL } = useLanguage();
  const styles = useThemedStyles(createStyles);
  const scrollViewRef = useRef<ScrollView>(null);

  const calendarTabs = useMemo(() => {
    const calTabs = Array.from({ length: 37 }, (_, i) => {
      const day = moment().add(i, 'd').locale('fa');
      return {
        index: i,
        day,
        label: i === 0 ? 'امروز' : i === 1 ? 'فردا' : day.format('dddd'),
        date: day.format('DD'),
        month: day.format('MMMM')
      };
    });
    if (isRTL()) return calTabs.reverse()
    else return calTabs;
  }, []);

  // Scroll to the right (end) when component mounts
  useEffect(() => {
    if (scrollViewRef.current && isRTL()) {
      // Use a small timeout to ensure the ScrollView has rendered
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  }, [isRTL]);

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let i = 8; i < 22; i += 2) {
      const day = moment().add(calTab, 'day').format('jYYYY/jMM/jDD');
      const currentHour = Number(moment().format('HH'));

      const disabled =
        (!selected.isUrgent && (calTab === 0 || (calTab === 1 && currentHour > i))) ||
        (calTab === 0 && currentHour > (i - 5)) ||
        (selected.isUrgent && calTab === 0 && currentHour >= 0 && currentHour < 8 && (i === 8 || i === 10)) ||
        (calTab === 1 && currentHour >= 16 && currentHour < 18 && i < 10) ||
        (calTab === 1 && currentHour >= 18 && i < 12);

      const isSelected = selected.time === i && selected.date === day;

      slots.push({
        time: i,
        day,
        disabled,
        isSelected,
        label: `${i} - ${i + 2}`
      });
    }
    return slots;
  }, [calTab, selected.isUrgent, selected.time, selected.date]);

  const handleTabPress = useCallback((index: number) => {
    setCalTab(index);
  }, []);

  const handleTimeSlotPress = useCallback((timeSlot: any) => {
    if (timeSlot.disabled) {
      Toast.warn(t('error.noAvailableStylistInDateTime'));
    } else {
      setSelected(prev => ({
        ...prev,
        time: timeSlot.time,
        date: timeSlot.day
      }));
    }
  }, [setSelected]);

  const renderCalendarTabs = () => {
    return calendarTabs.map((tab) => (
      <TouchableOpacity
        key={tab.index}
        style={[
          styles.calTabCell,
          calTab === tab.index && styles.selectedTab
        ]}
        onPress={() => handleTabPress(tab.index)}
      >
        <TextView style={[
          styles.tabDayText,
          calTab === tab.index && styles.selectedTabText
        ]}>
          {tab.label}
        </TextView>
        <TextView style={[
          styles.tabDateText,
          calTab === tab.index && styles.selectedTabText
        ]}>
          {tab.date}
        </TextView>
        <TextView style={[
          styles.tabDayText,
          calTab === tab.index && styles.selectedTabText
        ]}>
          {tab.month}
        </TextView>
      </TouchableOpacity>
    ));
  };

  const renderTimeSlots = () => {
    return timeSlots.map((timeSlot) => (
      <TouchableOpacity
        key={timeSlot.time}
        style={[
          styles.timeSlot,
          timeSlot.isSelected && styles.selectedTimeSlot,
          timeSlot.disabled && styles.disabledTimeSlot
        ]}
        onPress={() => handleTimeSlotPress(timeSlot)}
      >
        <TextView style={[
          styles.timeSlotText,
          timeSlot.isSelected && styles.selectedTimeSlotText,
          timeSlot.disabled && styles.disabledTimeSlotText
        ]}>
          {timeSlot.label}
        </TextView>
      </TouchableOpacity>
    ));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={calenderStepStyles.content}>
        <TextView style={styles.hintText}>لطفا تاریخ و ساعت را انتخاب کنید</TextView>

        <View style={styles.calendarContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={true}
            style={[calenderStepStyles.calTabsContainer, isRTL() ? styles.rtlDir : {}]}
            contentContainerStyle={calenderStepStyles.calTabsContent}
          >
            {renderCalendarTabs()}
          </ScrollView>

          <View>
            <TextView style={styles.timeSlotsTitle}>انتخاب ساعت</TextView>
            <View style={calenderStepStyles.timeSlotGrid}>
              {renderTimeSlots()}
            </View>
          </View>
        </View>

        {!selected.isUrgent && (
          <View style={styles.urgentBox}>
            <TextView style={styles.urgentText}>
              جهت ثبت سفارش برای ۲۴ ساعت آینده حالت سفارش فوری را انتخاب کنید
            </TextView>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  discountInput: {
    backgroundColor: theme.primary,
    color: theme.text,
    textAlign: 'right',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
  },
  hintText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  calendarContainer: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calTabCell: {
    backgroundColor: theme.surface,
    borderRadius: 8,
    padding: 4,
    marginRight: 8,
    minWidth: 60,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 4
  },
  selectedTab: {
    backgroundColor: colors.pink,
    borderColor: colors.pink,
  },
  tabDateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
  },
  tabDayText: {
    fontSize: 16,
    color: theme.text,
  },
  selectedTabText: {
    color: theme.textSecondary,
  },
  timeSlotsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 12,
  },
  timeSlot: {
    backgroundColor: theme.surface,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    width: '48%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTimeSlot: {
    backgroundColor: colors.pink,
    borderColor: colors.pink,
  },
  disabledTimeSlot: {
    backgroundColor: theme.third,
    opacity: 0.8,
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
  },
  selectedTimeSlotText: {
    color: theme.textSecondary,
  },
  disabledTimeSlotText: {
    color: theme.text,
  },
  urgentBox: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  urgentText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
  },
  calTabsContent: {
    flexDirection: 'row',
    paddingRight: 16,
    paddingBottom: 10
  },
  rtlDir: {
    direction: 'rtl'
  }
});

export default CalendarStep;