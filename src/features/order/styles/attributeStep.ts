import { spacing } from '@/src/styles/theme/spacing';
import Typography from '@/src/styles/theme/typography';
import { colors } from '@/src/styles/theme/colors';
import { StyleSheet} from 'react-native';

export const attributeStepStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardsContainer: {
    padding: 4,
  },
  nailHeaderButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  nailHeaderButtonRight: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  nailHeaderButtonLeft: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  selectedRight: {
    backgroundColor: colors.pink,
  },
  selectedLeft: {
    backgroundColor: colors.pink,
  },
  selectedButtonText: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  attributeCard: {
    paddingVertical: 10,
    justifyContent: 'space-between'
  },
  selectedCard: {
    borderColor: colors.pink,
    backgroundColor: '#F0F8FF',
  },
  reversedCard: {
    flexDirection: 'row-reverse',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  attributeCardRight: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md
  }
});