import {
  Restaurant,
  Flight,
  ShoppingBag,
  Receipt,
  Movie,
  MoreHoriz,
  SvgIconComponent,
} from '@mui/icons-material';

export interface CategoryConfig {
  label: string;
  color: string;
  bgColor: string;
  Icon: SvgIconComponent;
}

export const CATEGORIES = [
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Entertainment',
  'Others',
];

export const categoryConfig: Record<string, CategoryConfig> = {
  Food: {
    label: 'Food',
    color: '#10B981',
    bgColor: '#D1FAE5',
    Icon: Restaurant,
  },
  Travel: {
    label: 'Travel',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    Icon: Flight,
  },
  Shopping: {
    label: 'Shopping',
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
    Icon: ShoppingBag,
  },
  Bills: {
    label: 'Bills',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    Icon: Receipt,
  },
  Entertainment: {
    label: 'Entertainment',
    color: '#EC4899',
    bgColor: '#FCE7F3',
    Icon: Movie,
  },
  Others: {
    label: 'Others',
    color: '#6B7280',
    bgColor: '#F3F4F6',
    Icon: MoreHoriz,
  },
};

export const getCategoryConfig = (category: string): CategoryConfig => {
  return (
    categoryConfig[category] || {
      label: category,
      color: '#6B7280',
      bgColor: '#F3F4F6',
      Icon: MoreHoriz,
    }
  );
};

export const PIE_CHART_COLORS = [
  '#10B981',
  '#3B82F6',
  '#8B5CF6',
  '#F59E0B',
  '#EC4899',
  '#6B7280',
];