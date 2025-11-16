import { Header } from '@/src/components/layouts/Header';
import TextView from '@/src/components/ui/TextView';
import { useThemedStyles } from '@/src/hooks/useThemedStyles';
import { spacing } from '@/src/styles/theme/spacing';
import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Theme } from '@/src/types/theme';

const Privacy = () => {
  const styles = useThemedStyles(createStyles);
  return (
    <SafeAreaView style={styles.container}>
      <Header onBackPress={true}/>
      <TextView variant='h1'>
        حریم خصوصی
      </TextView>
      <TextView style={styles.mainText}>
        حفظ امنیت اطلاعات شخصی و احترام به حریم خصوصی کاربران از چارچوب های اصلی نیلمان می باشد و نیلمان متعهد است که از تمامی اطلاعات کاربران تمام و کمال محافظت کرده و به هیچ عنوان آنها را در اختیار هیچ مجموعه یا شخص
        ثالثی قرار ندهد مگر در مواردی که طبق قوانین جمهوری اسلامی ایران و بنا به درخواست ارگان ها و سازمان های دولتی ذیصلاح موظف به ارائه این اطلاعات باشد.
        اطلاعات هویتی دریافتی از کاربران اعم از شماره تلفن و کد ملی فقط جهت احراز هویت کاربر در مرحله ثبت نام دریافت میگردد. شماره تلفن کاربر برای اطلاع رسانی از پیشرفت مراحل سفارش به کاربر از طریق پیامک و در صورت بروز
        مشکل برای تماس پشتیبانی مورد استفاده قرار میگیرد و همانند کدملی به هیچ عنوان در اختیار زیباکار قرار نمیگیرد.
        زیباکار ها فقط از طریق آدرس ثبت شده توسط شما قادر به یافتن محل انجام خدمات می باشند لذا برای افزایش دقت و سهولت مسیریابی، از شما درخواست انتخاب محل از روی نقشه‌(لوکیشن) میشود. نظرات شما در مرحله نظرسنجی نیز فقط
        در اختیار اپراتور جهت ارزیابی تجربه ای که زیباکار از طرف نیلمان به شما ارائه میدهد می باشد و به هیچ وجه توسط زیباکار قابل رویت نیست.
      </TextView>
    </SafeAreaView>
  )
}

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.primary
  },
  mainText:{
    paddingHorizontal: 12
  }
})

export default Privacy;