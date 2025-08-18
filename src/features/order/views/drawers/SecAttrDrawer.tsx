import { useDrawer } from '@/src/components/contexts/DrawerContext';
import TextView from '@/src/components/ui/TextView';
import { useAppSelector } from '@/src/configs/redux/hooks';
import { secAttrDrawerStyles } from '@/src/features/order/styles/secAttrDrawer';
import { Form, PickingColor } from '@/src/features/order/types';
import { Service } from '@/src/features/service/types';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { Theme } from '@/src/types/theme';
import { useTheme } from '@/src/components/contexts/ThemeContext';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ArrowLeft, Info, X } from 'react-native-feather';
import AddOnDrawer from './AddOnDrawer';
import InfoDrawer from './InfoDrawer';
import MediaDrawer from './MediaDrawer';
import PickColorDrawer from './PickColorDrawer';
import ServiceDrawer from './ServiceDrawer';

interface ISecAttrDrawerProps {
  visible: boolean;
  onClose: () => void;
  parent: Service;
  form: Form;
  setForm: React.Dispatch<React.SetStateAction<Form>>;
  setIsNextStepAllowed: (allowed: boolean) => void;
}

const SecAttrDrawer = ({
                         visible,
                         onClose,
                         parent,
                         form,
                         setForm,
                         setIsNextStepAllowed
                       }: ISecAttrDrawerProps) => {
  const colorsReducer = useAppSelector(state => state.global.colors);
  const services = useAppSelector(state => state.service);
  const { theme } = useTheme();
  const { openDrawer } = useDrawer();
  const styles = useThemedStyles(createStyles);

  const [selected, setSelected] = useState(form);
  const [currentParent, setCurrentParent] = useState<Service | undefined>(parent);
  const [currentAttribute, setCurrentAttribute] = useState<Service>(parent);
  const [page, setPage] = useState(1);
  const [shouldPickAddOns, setShouldPickAddOns] = useState(false);
  const [pickMedia, setPickMedia] = useState(false);
  const [pickingColor, setPickingColor] = useState<PickingColor>({
    attr: null,
    open: false,
  });

  const activeParent = useMemo(() => currentParent || parent, [currentParent, parent]);

  const handleCloseDrawer = useCallback(() => {
    setCurrentParent(undefined);
    setPage(1);
    setShouldPickAddOns(false);
    setPickingColor({ attr: null, open: false });
    setPickMedia(false);
    onClose();
  }, [onClose]);

  const handleGoBack = useCallback(() => {
    if (shouldPickAddOns) {
      setShouldPickAddOns(false);
    } else if (page > 1) {
      setPage(prev => prev - 1);
      setCurrentParent(prev =>
        services.allServices.find(e => e.id === prev?.parent?.id)
      );
    }
  }, [shouldPickAddOns, page, services.allServices]);

  const handleClickCard = useCallback((secAttr: Service) => {
    setCurrentAttribute(secAttr);

    if (secAttr.hasMedia) {
      setPickMedia(true);
      return;
    }

    if (secAttr.hasColor) {
      setPickingColor({ attr: secAttr, open: true });
      return;
    }

    if (secAttr.attributes?.length) {
      setCurrentParent(secAttr);
      setPage(prev => prev + 1);
    } else if (secAttr.addOns?.length > 0) {
      setShouldPickAddOns(true);
    } else {
      handleAddAttribute(secAttr);
    }
  }, []);

  const handleAddAttribute = useCallback((secAttr: Service | null, color?: string | null) => {
    if (!secAttr) return;

    const newAttr = { ...secAttr };
    if (color) newAttr.color = color;

    // Check if already selected
    if (Object.keys(selected.options).includes(secAttr.id.toString())) {
      setSelected(prev => {
        const newOptions = { ...prev.options };
        delete newOptions[secAttr.id];
        return { ...prev, options: newOptions };
      });
      return;
    }

    // Check multi-selection rules
    if (!selected.isMulti &&
      !activeParent.isMulti &&
      Object.keys(selected.options).some(e =>
        services.allServices?.find(j => e === j.id.toString())?.parent?.id === activeParent.id
      )) {
      // Show error toast
      return;
    }

    setSelected(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [newAttr.id.toString()]: { count: 1 }
      }
    }));

    setIsNextStepAllowed(true);
    setPickingColor({ attr: null, open: false });
  }, [selected, activeParent, services.allServices, setIsNextStepAllowed]);

  const deleteAttribute = useCallback((attrId: number) => {
    setSelected(prev => {
      const newOptions = { ...prev.options };
      delete newOptions[attrId];

      return {
        ...prev,
        options: newOptions,
        attributes: prev.attributes?.filter(e => e.id !== attrId) || []
      };
    });
  }, []);

  const renderContent = () => {
    if (pickingColor.open && currentAttribute) {
      return (
        <PickColorDrawer
          colors={colorsReducer}
          selected={selected}
          setSelected={setSelected}
          currentAttribute={currentAttribute}
          setPickingColor={setPickingColor}
          handleAddAttribute={handleAddAttribute}
        />
      );
    }

    if (shouldPickAddOns) {
      return (
        <AddOnDrawer
          currentAttribute={currentAttribute}
          selected={selected}
          setSelected={setSelected}
          setShouldPickAddOns={setShouldPickAddOns}
          setPickingColor={setPickingColor}
        />
      );
    }

    return (
      <ServiceDrawer
        currentParent={activeParent}
        selected={selected}
        setSelected={setSelected}
        handleClickCard={handleClickCard}
        deleteAttribute={deleteAttribute}
        onClose={handleCloseDrawer}
      />
    );
  };

  useEffect(() => {
    setForm(selected);
  }, [selected, setForm]);

  if (!selected || !activeParent) {
    return null;
  }

  return (
    <View>
      <View style={styles.drawerContainer}>
        <View style={secAttrDrawerStyles.header}>
          <View style={secAttrDrawerStyles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleCloseDrawer}
            >
              <X width={20} color={theme.text} />
            </TouchableOpacity>

            {(page > 1 || shouldPickAddOns) && (
              <TouchableOpacity
                style={styles.headerButton}
                onPress={handleGoBack}
              >
                <ArrowLeft width={20} color={theme.text} />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => openDrawer('infoDrawer', <InfoDrawer parent={activeParent} />)}
            >
              <TextView style={secAttrDrawerStyles.moreInfoText}>توضیحات</TextView>
              <Info width={16} color={theme.text} />
            </TouchableOpacity>
          </View>
          <TextView style={secAttrDrawerStyles.drawerTitle}>
            {activeParent.title}
          </TextView>
        </View>

        <View style={secAttrDrawerStyles.content}>
          {renderContent()}
        </View>
      </View>

      <MediaDrawer
        pickMedia={pickMedia}
        setPickMedia={setPickMedia}
        selected={selected}
        setSelected={setSelected}
        currentAttribute={currentAttribute}
      />
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  drawerContainer: {
    backgroundColor: theme.background,
    maxHeight: 700,
    minHeight: 500,
    flex: 1,
    height: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  headerButton: {
    backgroundColor: theme.primary,
    flexDirection: 'row',
    borderRadius: 30,
    alignItems: 'center',
    gap: 4,
    padding: 4,
  },
});

export default SecAttrDrawer;