import { defaultLanguage, LOCALES } from '@/src/configs/translations';
import { useLanguage } from '@/src/hooks/useLanguage';

const useNumerals = () => {
  const {currentLanguage} = useLanguage()
  const formatPrice = (value: number | string, lang = currentLanguage) =>
    Intl.NumberFormat(LOCALES[lang]).format(value as number);

  return {
    formatPrice
  }
}
export default useNumerals;
