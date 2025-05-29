import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OTP_TIMER_KEY = 'otpTimer';
const INTERVAL = 120000; // 2 minutes

export const useOtpTimer = () => {
  const [startTime, setStartTime] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);

  // Load saved timer on mount
  useEffect(() => {
    const loadTimer = async () => {
      try {
        const saved = await AsyncStorage.getItem(OTP_TIMER_KEY);
        if (saved) {
          const savedTime = parseInt(saved, 10);
          const now = Date.now();
          const elapsed = now - savedTime;

          if (elapsed < INTERVAL) {
            setStartTime(savedTime);
            setTimeLeft(INTERVAL - elapsed);
            setIsActive(true);
          } else {
            // Timer expired, clean up
            await AsyncStorage.removeItem(OTP_TIMER_KEY);
          }
        }
      } catch (error) {
        console.log('Error loading timer:', error);
      }
    };
    loadTimer();
  }, []);

  // Update countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1000;
          if (newTime <= 0) {
            setIsActive(false);
            AsyncStorage.removeItem(OTP_TIMER_KEY);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const startTimer = useCallback(async () => {
    const now = Date.now();
    setStartTime(now);
    setTimeLeft(INTERVAL);
    setIsActive(true);

    try {
      await AsyncStorage.setItem(OTP_TIMER_KEY, now.toString());
    } catch (error) {
      console.log('Error saving timer:', error);
    }
  }, []);

  const resetTimer = useCallback(async () => {
    setStartTime(0);
    setTimeLeft(0);
    setIsActive(false);

    try {
      await AsyncStorage.removeItem(OTP_TIMER_KEY);
    } catch (error) {
      console.log('Error removing timer:', error);
    }
  }, []);

  const formatTime = useCallback((milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const canResend = timeLeft === 0;

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    isActive,
    canResend,
    startTimer,
    resetTimer,
  };
};
