import TextInputView from '@/src/components/ui/TextInputView';
import TextView from '@/src/components/ui/TextView';
import { mediaDrawerStyles } from '@/src/features/order/styles/mediaDrawer';
import { Form } from '@/src/features/order/types';
import { Service } from '@/src/features/service/types';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { colors } from '@/src/styles/theme/colors';
import { Theme } from '@/src/types/theme';
import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  ScrollView, StyleSheet,
} from 'react-native';
import { launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { Upload } from 'react-native-feather';

interface IMediaDrawerProps {
  pickMedia: boolean;
  setPickMedia: (value: boolean) => void;
  selected: Form;
  setSelected: (callback: (prev: Form) => Form) => void;
  currentAttribute?: Service;
}

const MediaDrawer = ({
                       pickMedia,
                       setPickMedia,
                       selected,
                       setSelected,
                       currentAttribute
                     }: IMediaDrawerProps) => {

  const styles = useThemedStyles(createStyles);
  const handleImagePicker = useCallback(() => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets?.[0] && currentAttribute) {
        const asset = response.assets[0];
        setSelected(prev => {
          const newOptions = { ...prev.options };

          if (!newOptions[currentAttribute.id]) {
            newOptions[currentAttribute.id] = {
              count: 1,
              colors: [],
              pinterest: ''
            };
          }

          newOptions[currentAttribute.id].media = {
            data: asset,
            preview: asset.uri,
          };

          return { ...prev, options: newOptions };
        });
      }
    });
  }, [currentAttribute, setSelected]);

  const handlePinterestChange = useCallback((text: string) => {
    if (!currentAttribute) return;

    setSelected(prev => {
      const newOptions = { ...prev.options };

      if (!newOptions[currentAttribute.id]) {
        newOptions[currentAttribute.id] = {
          count: 1,
          colors: [],
          media: undefined,
          pinterest: ''
        };
      }

      newOptions[currentAttribute.id].pinterest = text;
      return { ...prev, options: newOptions };
    });
  }, [currentAttribute, setSelected]);

  const handleClose = useCallback(() => {
    setPickMedia(false);
  }, [setPickMedia]);

  const currentMediaData = currentAttribute ? selected?.options[currentAttribute.id] : null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={pickMedia}
      onRequestClose={handleClose}
    >
      <View style={mediaDrawerStyles.modalOverlay}>
        <View style={styles.mediaModal}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <TextView style={styles.description}>
              اگر طرح خاصی برای خدمت انتخابی خود در نظر دارید عکس آن را در اینجا بارگزاری نمایید و یا لینک پینترست آن را وارد کنید
            </TextView>

            <View style={mediaDrawerStyles.inputContainer}>
              {/* <TextView style={mediaDrawerStyles.inputLabel}>لینک Pinterest</TextView> */}
              <TextInputView
                style={styles.textInput}
                value={currentMediaData?.pinterest || ''}
                onChangeText={handlePinterestChange}
                placeholder="لینک Pinterest را وارد کنید"
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleImagePicker}
            >
              <Upload width={20} color="#007AFF" />
              <TextView style={styles.uploadButtonText}>بارگزاری تصویر</TextView>
            </TouchableOpacity>

            <View style={mediaDrawerStyles.imagePreviewContainer}>
              <Image
                source={{
                  uri: currentMediaData?.media?.preview ||
                    'https://via.placeholder.com/400x300/f0f0f0/999999?text=No+Image'
                }}
                style={styles.previewImage}
                alt={'mm'}
                resizeMode="cover"
              />
            </View>

            <View style={mediaDrawerStyles.buttonContainer}>
              <TouchableOpacity
                style={mediaDrawerStyles.confirmButton}
                onPress={handleClose}
              >
                <TextView style={mediaDrawerStyles.confirmButtonText}>تایید</TextView>
              </TouchableOpacity>

              <TouchableOpacity
                style={mediaDrawerStyles.cancelButton}
                onPress={handleClose}
              >
                <TextView style={styles.cancelButtonText}>بازگشت</TextView>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  mediaModal: {
    backgroundColor: theme.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  attrBox: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 2,
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderColor: 'transparent',
    backgroundColor: theme.primary
  },
  currency: {
    fontSize: 14,
    color: theme.text,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
  },
  attrTitle: {
    fontSize: 17,
    color: theme.text,
    fontWeight: '600',
  },
  selectedAttrBox: {
    borderColor: colors.pink,
  },
  selectedIcon: {
    width: 18,
    height: 18,
    borderRadius: 10,
    backgroundColor: colors.pink,
  },

  textInput: {
    borderWidth: 1,
    borderColor: theme.secondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    textAlign: 'right',
    writingDirection: 'rtl',
    color: '#333',
    backgroundColor: theme.primary,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
    borderWidth: 2,
    borderColor: theme.secondary,
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    fontSize: 16,
    color: theme.text,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: theme.text,
    lineHeight: 22,
    marginBottom: 20,
    // textAlign: 'center',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: theme.primary,
  },
  cancelButtonText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '500',
  }
});

export default MediaDrawer;