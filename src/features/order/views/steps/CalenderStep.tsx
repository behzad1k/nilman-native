import DigitalTimePicker from "@/src/components/ui/DigitalTimePicker";
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner";
import TextView from "@/src/components/ui/TextView";
import { useAppSelector } from "@/src/configs/redux/hooks";
import { services } from "@/src/configs/services";
import { calenderStepStyles } from "@/src/features/order/styles/calenderStep";
import { Form, Step } from "@/src/features/order/types";
import { useAsyncOperation } from "@/src/hooks/useAsyncOperation";
import { useLanguage } from "@/src/hooks/useLanguage";
import { useThemedStyles } from "@/src/hooks/useThemedStyles";
import { colors } from "@/src/styles/theme/colors";
import { Theme } from "@/src/types/theme";
import moment from "jalali-moment";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Toast } from "toastify-react-native";

interface Props {
  selected: Form;
  setSelected: React.Dispatch<React.SetStateAction<Form>>;
  setStep: React.Dispatch<React.SetStateAction<Step>>;
}

const CalendarStep = ({ setSelected, selected }: Props) => {
  const [calTab, setCalTab] = useState(0);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [schedules, setSchedules] = useState<any>(undefined);
  const userReducer = useAppSelector((state) => state.user);
  const selectedTimeRef = useRef<number | null>(null);
  const { t, isRTL } = useLanguage();
  const styles = useThemedStyles(createStyles);
  const scrollViewRef = useRef<ScrollView>(null);
  const { execute: fetchWorkers, loading: fetchWorkersLoading } =
    useAsyncOperation();
  const fetchWorkerOffs = async () => {
    const workerOffs = await fetchWorkers(() =>
      services.order.fetchWorkerOffs(
        Object.keys(selected.options),
        selected.address?.id || userReducer?.addresses[0]?.id,
        parseInt(selected.worker || ""),
      ),
    );
    setSchedules(workerOffs.data);
  };

  useEffect(() => {
    fetchWorkerOffs();
  }, []);

  const calendarTabs = useMemo(() => {
    const calTabs = Array.from({ length: 37 }, (_, i) => {
      const day = moment().add(i, "d").locale("fa");
      return {
        index: i,
        day,
        label: i === 0 ? "امروز" : i === 1 ? "فردا" : day.format("dddd"),
        date: day.format("DD"),
        month: day.format("MMMM"),
      };
    });
    if (isRTL()) return calTabs.reverse();
    else return calTabs;
  }, []);

  useEffect(() => {
    if (scrollViewRef.current && isRTL()) {
      setTimeout(() => {
        console.log("hi");
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 150);
    }
  }, [scrollViewRef.current]);

  const timeSlots = useMemo(() => {
    if (fetchWorkersLoading && !schedules) return [];
    const slots = [];
    let section = 1;
    const currentHour = parseInt(moment().format("HH"));
    const currentSection = currentHour < 8 ? 0 : Math.floor(currentHour) - 7;
    for (let i = 8; i < 21; i += 1) {
      const day = moment().add(calTab, "day").format("jYYYY/jMM/jDD");
      const disabled =
        (calTab === 0 && section - currentSection <= 3) ||
        (schedules && schedules[day] ? schedules[day].includes(i) : false) ||
        (!selected.isUrgent && calTab === 0 && section - currentSection <= 7) ||
        (!selected.isUrgent &&
          calTab === 1 &&
          (currentHour > 20 ? 20 : currentHour) - i >= 7) ||
        (calTab === 1 && (currentHour > 20 ? 20 : currentHour) - i >= 10);

      const isSelected = selected.time === i && selected.date === day;

      slots.push({
        time: i,
        day,
        disabled,
        isSelected,
        label: `${i} - ${i + 1}`,
      });
      ++section;
    }
    return slots;
  }, [calTab, selected.isUrgent, selected.time, selected.date, schedules]);

  const disabledHours = timeSlots.filter((e) => e.disabled).map((e) => e.time);

  const changeDay = useCallback((index: number = 0) => {
    setCalTab(index);
    setSelected((prev) => ({
      ...prev,
      date: moment().add(index, "day").format("jYYYY/jMM/jDD"),
    }));
  }, []);

  useEffect(() => {
    if (timeSlots.length) {
      if (timeSlots.filter((e) => !e.disabled).length) {
        const closestHour = timeSlots.filter((e) => !e.disabled)[0]?.time;
        if (disabledHours.includes(hour) || hour > closestHour || hour == 0)
          selectedTimeRef.current = closestHour;
      } else {
        changeDay(calTab + 1);
      }
      setSelected((prev) => ({
        ...prev,
        time: hour,
      }));
    }
  }, [hour, timeSlots]);

  useEffect(() => {
    if (selectedTimeRef.current) {
      setHour(selectedTimeRef.current);
    }
  }, [selectedTimeRef.current]);

  const renderCalendarTabs = () => {
    return calendarTabs.map((tab) => (
      <TouchableOpacity
        key={tab.index}
        style={[styles.calTabCell, calTab === tab.index && styles.selectedTab]}
        onPress={() => changeDay(tab.index)}
      >
        <TextView
          style={[
            styles.tabDayText,
            calTab === tab.index && styles.selectedTabText,
          ]}
        >
          {tab.label}
        </TextView>
        <TextView
          style={[
            styles.tabDateText,
            calTab === tab.index && styles.selectedTabText,
          ]}
        >
          {tab.date}
        </TextView>
        <TextView
          style={[
            styles.tabDayText,
            calTab === tab.index && styles.selectedTabText,
          ]}
        >
          {tab.month}
        </TextView>
      </TouchableOpacity>
    ));
  };

  const renderTimeSlots = useCallback(() => {
    // return timeSlots.map((timeSlot) => (
    //   <TouchableOpacity
    //     key={timeSlot.time}
    //     style={[
    //       styles.timeSlot,
    //       timeSlot.isSelected && styles.selectedTimeSlot,
    //       timeSlot.disabled && styles.disabledTimeSlot
    //     ]}
    //     onPress={() => handleTimeSlotPress(timeSlot)}
    //   >
    //     <TextView style={[
    //       styles.timeSlotText,
    //       timeSlot.isSelected && styles.selectedTimeSlotText,
    //       timeSlot.disabled && styles.disabledTimeSlotText
    //     ]}>
    //       {timeSlot.label}
    //     </TextView>
    //   </TouchableOpacity>
    // ));
  }, [timeSlots, hour]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={calenderStepStyles.content}>
        <TextView style={styles.hintText}>
          لطفا تاریخ و ساعت را انتخاب کنید
        </TextView>

        <View style={styles.calendarContainer}>
          {fetchWorkersLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={true}
                style={[calenderStepStyles.calTabsContainer]}
                contentContainerStyle={calenderStepStyles.calTabsContent}
              >
                {renderCalendarTabs()}
              </ScrollView>

              <View>
                <TextView style={styles.timeSlotsTitle}>انتخاب ساعت</TextView>
                <View style={calenderStepStyles.timeSlotGrid}>
                  <DigitalTimePicker
                    hour={hour}
                    setHour={setHour}
                    minute={minute}
                    setMinute={setMinute}
                    onTimeChange={(hour: number, _minute: number) =>
                      setSelected((prev) => ({
                        ...prev,
                        time: hour,
                      }))
                    }
                    minHour={8}
                    maxHour={20}
                    maxMinute={0}
                    disabledHours={timeSlots
                      .filter((e) => e.disabled)
                      .map((e) => e.time)}
                    onDisabledHourSelected={() => {
                      console.log("h: ", hour);
                      console.log("c: ", calTab);
                      Toast.show({
                        type: "error",
                        text1: t("error.noAvailableStylistInDateTime"),
                        position: "top",
                      });
                    }}
                  />
                </View>
              </View>
            </>
          )}
        </View>

        {!selected.isUrgent && (
          <View style={styles.urgentBox}>
            <TextView style={styles.urgentText}>
              جهت ثبت سفارش برای ۴ سانس آینده حالت سفارش فوری را انتخاب کنید
            </TextView>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    discountInput: {
      backgroundColor: theme.primary,
      color: theme.text,
      textAlign: "right",
      borderRadius: 10,
      borderWidth: 1,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 14,
    },
    hintText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
      textAlign: "center",
      marginBottom: 20,
    },
    calendarContainer: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
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
      alignItems: "center",
      borderWidth: 2,
      borderColor: "transparent",
      gap: 4,
    },
    selectedTab: {
      backgroundColor: colors.pink,
      borderColor: colors.pink,
    },
    tabDateText: {
      fontSize: 18,
      fontWeight: "bold",
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
      fontWeight: "600",
      color: theme.text,
    },
    timeSlot: {
      backgroundColor: theme.surface,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      width: "48%",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "transparent",
    },
    selectedTimeSlot: {
      backgroundColor: colors.pink,
      borderColor: colors.pink,
    },
    disabledTimeSlot: {
      backgroundColor: theme.third,
      opacity: 0.3,
    },
    timeSlotText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.text,
    },
    selectedTimeSlotText: {
      color: theme.textSecondary,
    },
    disabledTimeSlotText: {
      color: theme.text,
    },
    urgentBox: {
      backgroundColor: "#fff3cd",
      borderRadius: 8,
      padding: 16,
      borderLeftWidth: 4,
      borderLeftColor: "#ffc107",
    },
    urgentText: {
      fontSize: 14,
      color: "#856404",
      textAlign: "center",
    },
    calTabsContent: {
      flexDirection: "row",
      paddingRight: 16,
      paddingBottom: 10,
    },
  });

export default CalendarStep;
