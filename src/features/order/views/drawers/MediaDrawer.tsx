import { mediaDrawerStyles } from '@/src/features/order/styles/mediaDrawer';
import { Form } from '@/src/features/order/types';
import { Service } from '@/src/features/service/types';
import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  ScrollView,
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
        <View style={mediaDrawerStyles.mediaModal}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={mediaDrawerStyles.description}>
              اگر طرح خاصی برای خدمت انتخابی خود در نظر دارید عکس آن را در اینجا بارگزاری نمایید و یا لینک پینترست آن را وارد کنید
            </Text>

            <View style={mediaDrawerStyles.inputContainer}>
              <Text style={mediaDrawerStyles.inputLabel}>لینک Pinterest</Text>
              <TextInput
                style={mediaDrawerStyles.textInput}
                value={currentMediaData?.pinterest || ''}
                onChangeText={handlePinterestChange}
                placeholder="لینک Pinterest را وارد کنید"
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity
              style={mediaDrawerStyles.uploadButton}
              onPress={handleImagePicker}
            >
              <Upload width={20} color="#007AFF" />
              <Text style={mediaDrawerStyles.uploadButtonText}>بارگزاری تصویر</Text>
            </TouchableOpacity>

            <View style={mediaDrawerStyles.imagePreviewContainer}>
              <Image
                source={{
                  uri: currentMediaData?.media?.preview ||
                    'https://via.placeholder.com/400x300/f0f0f0/999999?text=No+Image'
                }}
                style={mediaDrawerStyles.previewImage}
                resizeMode="cover"
              />
            </View>

            <View style={mediaDrawerStyles.buttonContainer}>
              <TouchableOpacity
                style={mediaDrawerStyles.confirmButton}
                onPress={handleClose}
              >
                <Text style={mediaDrawerStyles.confirmButtonText}>تایید</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={mediaDrawerStyles.cancelButton}
                onPress={handleClose}
              >
                <Text style={mediaDrawerStyles.cancelButtonText}>بازگشت</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default MediaDrawer;