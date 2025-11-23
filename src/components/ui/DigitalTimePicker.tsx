import TextView from '@/src/components/ui/TextView';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, } from 'react-native';

interface PickerComponentProps {
  minHour?: number;
  maxHour?: number;
  minMinute?: number;
  maxMinute?: number;
  initialHour?: number;
  initialMinute?: number;
  onTimeChange?: (hour: number, minute: number) => void;
  disabledHours?: number[];
  onDisabledHourSelected?: (disabledHour: number, closestAvailableHour: number) => void;
}

const DigitalTimePicker: React.FC<PickerComponentProps> = ({
                                                             minHour = 0,
                                                             maxHour = 23,
                                                             maxMinute = 60,
                                                             minMinute = 0,
                                                             initialHour = minHour,
                                                             initialMinute = minMinute,
                                                             onTimeChange,
                                                             disabledHours = [],
                                                             onDisabledHourSelected,
                                                           }) => {
  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);

  const hours = Array.from({ length: maxHour - minHour + 1 }, (_, i) => minHour + i);
  const minutes = Array.from({ length: maxMinute - minMinute + 1 }, (_, i) => minMinute + i);

  const availableHours = hours.filter(h => !disabledHours.includes(h));

  const findClosestAvailableHour = (targetHour: number): number => {
    if (!disabledHours.includes(targetHour)) {
      return targetHour;
    }

    let closestHour = availableHours[0];
    let minDistance = Math.abs(targetHour - closestHour);

    for (const availableHour of availableHours) {
      const distance = Math.abs(targetHour - availableHour);
      if (distance < minDistance) {
        minDistance = distance;
        closestHour = availableHour;
      }
    }

    return closestHour;
  };

  const itemHeight = 36;
  const visibleItems = 5;
  const pickerHeight = itemHeight * visibleItems;
  const paddingItems = Math.floor(visibleItems / 2);

  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);
  const hourScrollTimer = useRef<NodeJS.Timeout | null>(null);
  const minuteScrollTimer = useRef<NodeJS.Timeout | null>(null);

  // Initialize scroll positions
  useEffect(() => {
    const hourIndex = hours.indexOf(hour);
    const minuteIndex = minutes.indexOf(minute);

    setTimeout(() => {
      if (hourIndex >= 0) {
        hourScrollRef.current?.scrollTo({
          y: hourIndex * itemHeight,
          animated: false,
        });
      }
      if (minuteIndex >= 0) {
        minuteScrollRef.current?.scrollTo({
          y: minuteIndex * itemHeight,
          animated: false,
        });
      }
    }, 100);
  }, []);

  const handleHourScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / itemHeight);
    const clampedIndex = Math.max(0, Math.min(hours.length - 1, index));
    const selectedHour = hours[clampedIndex];

    if (selectedHour !== undefined && selectedHour !== hour) {
      setHour(selectedHour);
      onTimeChange?.(selectedHour, minute);
    }

    // Clear existing timer
    if (hourScrollTimer.current) {
      clearTimeout(hourScrollTimer.current);
    }

    // Set timer to snap when scrolling stops
    // @ts-ignore
    hourScrollTimer.current = setTimeout(() => {
      const snapY = clampedIndex * itemHeight;
      hourScrollRef.current?.scrollTo({
        y: snapY,
        animated: true,
      });

      // Check if the selected hour is disabled
      if (disabledHours.includes(selectedHour)) {
        const closestAvailableHour = findClosestAvailableHour(selectedHour);

        // Call the callback if provided
        if (onDisabledHourSelected) {
          onDisabledHourSelected(selectedHour, closestAvailableHour);
        }

        // Update to the closest available hour
        setHour(closestAvailableHour);
        onTimeChange?.(closestAvailableHour, minute);

        // Scroll to the closest available hour
        const closestHourIndex = hours.indexOf(closestAvailableHour);
        if (closestHourIndex >= 0) {
          hourScrollRef.current?.scrollTo({
            y: closestHourIndex * itemHeight,
            animated: true,
          });
        }
        return;
      }

    }, 150);
  };

  const handleMinuteScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / itemHeight);
    const clampedIndex = Math.max(0, Math.min(minutes.length - 1, index));
    const newMinute = minutes[clampedIndex];

    if (newMinute !== undefined && newMinute !== minute) {
      onTimeChange?.(hour, newMinute);
    }

    // Clear existing timer
    if (minuteScrollTimer.current) {
      clearTimeout(minuteScrollTimer.current);
    }
    setMinute(newMinute);
    // Set timer to snap when scrolling stops
    // @ts-ignore
    minuteScrollTimer.current = setTimeout(() => {
      const snapY = clampedIndex * itemHeight;
      minuteScrollRef.current?.scrollTo({
        y: snapY,
        animated: true,
      });
    }, 150);
    onTimeChange?.(hour, newMinute);
  };

  // Add padding items to allow centering
  const paddedHours = [
    ...Array(paddingItems).fill(null),
    ...hours,
    ...Array(paddingItems).fill(null),
  ];

  const paddedMinutes = [
    ...Array(paddingItems).fill(null),
    ...minutes,
    ...Array(paddingItems).fill(null),
  ];

  if (availableHours.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <TextView style={styles.emptyText}>
          No available hours for this date
        </TextView>
      </View>
    );
  }

  return (
    <View style={styles.digitalContainer}>
      <View style={styles.pickerRow}>
        <View style={[styles.pickerColumn, { height: pickerHeight }]}>
          <ScrollView
            ref={hourScrollRef}
            showsVerticalScrollIndicator={false}
            onScroll={handleHourScroll}
            scrollEventThrottle={16}
            snapToInterval={itemHeight}
            snapToAlignment="start"
            decelerationRate="fast"
            contentContainerStyle={styles.pickerScrollContent}
          >
            {paddedHours.map((h, index) => {
              const isDisabled = h !== null && disabledHours.includes(h);
              return (
                <View key={`hour-${index}`} style={[styles.pickerItem, { height: itemHeight }]}>
                  {h !== null && (
                    <TextView
                      style={[
                        styles.pickerItemText,
                        h === hour && styles.pickerItemTextSelected,
                        isDisabled && styles.pickerItemTextDisabled,
                      ]}
                    >
                      {h.toString().padStart(2, '0')}
                    </TextView>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>

        <Text style={styles.pickerSeparator}>:</Text>

        <View style={[styles.pickerColumn, { height: pickerHeight }]}>
          <ScrollView
            ref={minuteScrollRef}
            showsVerticalScrollIndicator={false}
            onScroll={handleMinuteScroll}
            scrollEventThrottle={16}
            snapToInterval={itemHeight}
            snapToAlignment="start"
            decelerationRate="fast"
            contentContainerStyle={styles.pickerScrollContent}
          >
            {paddedMinutes.map((m, index) => (
              <View key={`minute-${index}`} style={[styles.pickerItem, { height: itemHeight }]}>
                {m !== null && (
                  <TextView
                    style={[
                      styles.pickerItemText,
                      m === minute && styles.pickerItemTextSelected,
                    ]}
                  >
                    {m.toString().padStart(2, '0')}
                  </TextView>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      <View style={styles.pickerSelection} pointerEvents="none"/>
    </View>
  );
};

const styles = StyleSheet.create({
  digitalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerColumn: {
    overflow: 'hidden',
    width: 80,
  },
  pickerScrollContent: {
    paddingVertical: 0,
  },
  pickerItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerItemText: {
    fontSize: 20,
    color: '#CCC',
  },
  pickerItemTextSelected: {
    fontSize: 26,
    color: '#000',
    fontWeight: '600',
  },
  pickerItemTextDisabled: {
    color: '#E0E0E0',
    textDecorationLine: 'line-through',
  },
  pickerSeparator: {
    fontSize: 32,
    fontWeight: '600',
    marginHorizontal: 10,
    color: '#000',
  },
  pickerSelection: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 44,
    marginTop: -22,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
  },
  doneButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
});

export default DigitalTimePicker;