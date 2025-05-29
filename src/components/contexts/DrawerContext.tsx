import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { DrawerContextType, DrawerConfig, DrawerInstance } from '@/src/types/drawer';

const defaultConfig: DrawerConfig = {
  position: 'bottom',
  transitionType: 'slide',
  transitionDuration: 300,
  overlayOpacity: 0.5,
  drawerWidth: 280,
  enableGestures: true,
  enableOverlay: true,
};

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

interface DrawerProviderProps {
  children: ReactNode;
  initialConfig?: Partial<DrawerConfig>;
}

export const DrawerProvider: React.FC<DrawerProviderProps> = ({
                                                                children,
                                                                initialConfig = {}
                                                              }) => {
  const [drawers, setDrawers] = useState<DrawerInstance[]>([]);
  const [config, setConfig] = useState<DrawerConfig>({
    ...defaultConfig,
    ...initialConfig,
  });

  const openDrawer = useCallback((
    id: string,
    content: ReactNode,
    drawerConfig?: Partial<DrawerConfig>
  ) => {
    setDrawers(prev => {
      // Remove existing drawer with same id if it exists
      const filtered = prev.filter(drawer => drawer.id !== id);

      // Calculate new z-index (highest existing + 1)
      const maxZIndex = filtered.length > 0
        ? Math.max(...filtered.map(d => d.zIndex))
        : 1000;

      const newDrawer: DrawerInstance = {
        id,
        content,
        config: { ...config, ...drawerConfig },
        zIndex: maxZIndex + 1,
      };

      return [...filtered, newDrawer];
    });
  }, [config]);

  const closeDrawer = useCallback((id?: string) => {
    setDrawers(prev => {
      if (prev.length === 0) return prev;

      if (id) {
        // Close specific drawer
        return prev.filter(drawer => drawer.id !== id);
      } else {
        // Close the topmost drawer (last opened)
        const sortedDrawers = [...prev].sort((a, b) => b.zIndex - a.zIndex);
        const topDrawer = sortedDrawers[0];
        return prev.filter(drawer => drawer.id !== topDrawer.id);
      }
    });
  }, []);

  const closeAllDrawers = useCallback(() => {
    setDrawers([]);
  }, []);

  const isDrawerOpen = useCallback((id: string) => {
    return drawers.some(drawer => drawer.id === id);
  }, [drawers]);

  const getTopDrawer = useCallback(() => {
    if (drawers.length === 0) return null;
    return drawers.reduce((top, current) =>
      current.zIndex > top.zIndex ? current : top
    );
  }, [drawers]);

  const updateDefaultConfig = useCallback((newConfig: Partial<DrawerConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  return (
    <DrawerContext.Provider
      value={{
        drawers,
        openDrawer,
        closeDrawer,
        closeAllDrawers,
        isDrawerOpen,
        getTopDrawer,
        defaultConfig: config,
        updateDefaultConfig,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};

// The useDrawer hook
export const useDrawer = (): DrawerContextType => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
};

// Export the context for advanced usage
export { DrawerContext };
