import React, { useEffect } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDrawer } from '@/src/components/contexts/DrawerContext';
import { DrawerInstance } from '@/src/types/drawer';
import {
  getDrawerTransform,
  getContentTransform,
  createTimingConfig
} from '@/src/utils/drawerAnimations';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface DrawerProps {
  children: React.ReactNode;
}

interface SingleDrawerProps {
  drawer: DrawerInstance;
  isTopmost: boolean;
  onClose: () => void;
}

const SingleDrawer: React.FC<SingleDrawerProps> = ({ drawer, isTopmost, onClose }) => {
  const insets = useSafeAreaInsets();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, createTimingConfig(drawer.config.transitionDuration));
    return () => {
      progress.value = withTiming(0, createTimingConfig(drawer.config.transitionDuration));
    };
  }, [drawer.config.transitionDuration]);

  // Gesture handling - only for the topmost drawer
  const panGesture = Gesture.Pan()
  .enabled(drawer.config.enableGestures && isTopmost)
  .onUpdate((event) => {
    if (!drawer.config.enableGestures || !isTopmost) return;

    const { translationX, translationY } = event;
    const thresholdX = drawer.config.drawerWidth * 0.3;
    const thresholdY = (drawer.config.drawerHeight || 400) * 0.3;

    if (drawer.config.position === 'left') {
      if (translationX < -thresholdX) {
        runOnJS(onClose)();
      }
    } else if (drawer.config.position === 'right') {
      if (translationX > thresholdX) {
        runOnJS(onClose)();
      }
    } else if (drawer.config.position === 'top') {
      if (translationY < -thresholdY) {
        runOnJS(onClose)();
      }
    } else if (drawer.config.position === 'bottom') {
      if (translationY > thresholdY) {
        runOnJS(onClose)();
      }
    }
  });

  const tapGesture = Gesture.Tap()
  .enabled(isTopmost)
  .onEnd(() => {
    if (isTopmost) {
      runOnJS(onClose)();
    }
  });

  // Animated styles
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: drawer.config.enableOverlay
      ? interpolate(
        progress.value,
        [0, 1],
        [0, drawer.config.overlayOpacity],
        Extrapolate.CLAMP
      )
      : 0,
    pointerEvents: 'auto',
  }));

  const drawerStyle = useAnimatedStyle(() =>
    getDrawerTransform(
      progress,
      drawer.config.transitionType,
      drawer.config.position,
      drawer.config.drawerWidth,
      drawer.config.drawerHeight
    )
  );

  // Dynamic container style based on position
  const getDrawerContainerStyle = () => {
    const baseStyle = {
      backgroundColor: 'white',
      elevation: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      zIndex: drawer.zIndex + 1,
    };

    if (drawer.config.position === 'left' || drawer.config.position === 'right') {
      return [
        styles.drawerContainer,
        baseStyle,
        {
          width: drawer.config.drawerWidth,
          [drawer.config.position]: 0,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          top: 0,
          bottom: 0,
        },
        drawerStyle,
      ];
    } else {
      // top or bottom
      return [
        styles.drawerContainerHorizontal,
        baseStyle,
        {
          width: drawer.config.drawerWidth || SCREEN_WIDTH,
          height: drawer.config.drawerHeight || 400,
          [drawer.config.position]: 0,
          left: drawer.config.position === 'top' || drawer.config.position === 'bottom'
            ? (SCREEN_WIDTH - (drawer.config.drawerWidth || SCREEN_WIDTH)) / 2
            : 0,
          ...(drawer.config.position === 'top' && { paddingTop: insets.top }),
          ...(drawer.config.position === 'bottom' && { paddingBottom: insets.bottom }),
        },
        drawerStyle,
      ];
    }
  };

  const overlayContainerStyle = [
    styles.overlay,
    {
      zIndex: drawer.zIndex,
    },
    overlayStyle,
  ];

  return (
    <>
      {/* Overlay */}
      {drawer.config.enableOverlay && (
        <GestureDetector gesture={tapGesture}>
          <Animated.View style={overlayContainerStyle} />
        </GestureDetector>
      )}

      {/* Drawer */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={getDrawerContainerStyle()}>
          {drawer.content}
        </Animated.View>
      </GestureDetector>
    </>
  );
};

export const Drawer: React.FC<DrawerProps> = ({ children }) => {
  const { drawers, closeDrawer, getTopDrawer } = useDrawer();
  const topDrawer = getTopDrawer();

  // Content transform only applies to the topmost drawer if it's a push transition
  const contentProgress = useSharedValue(0);

  useEffect(() => {
    if (topDrawer && topDrawer.config.transitionType === 'push') {
      contentProgress.value = withTiming(1, createTimingConfig(topDrawer.config.transitionDuration));
    } else {
      contentProgress.value = withTiming(0, createTimingConfig(300));
    }
  }, [topDrawer]);

  const contentStyle = useAnimatedStyle(() => {
    if (!topDrawer || topDrawer.config.transitionType !== 'push') {
      return { transform: [{ translateX: 0 }, { translateY: 0 }] };
    }
    return getContentTransform(
      contentProgress,
      topDrawer.config.transitionType,
      topDrawer.config.position,
      topDrawer.config.drawerWidth,
      topDrawer.config.drawerHeight
    );
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Main Content */}
      <Animated.View style={[styles.content, contentStyle]}>
        {children}
      </Animated.View>

      {/* Render all drawers */}
      {drawers.map((drawer) => (
        <SingleDrawer
          key={drawer.id}
          drawer={drawer}
          isTopmost={topDrawer?.id === drawer.id}
          onClose={() => closeDrawer(drawer.id)}
        />
      ))}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  drawerContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  drawerContainerHorizontal: {
    position: 'absolute',
    backgroundColor: 'white',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
