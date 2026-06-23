import { useTheme, Theme } from '../context/ThemeContext';

type ThemeClasses = {
  bg: string;
  bgSubtle: string;
  bgHover: string;
  bgSkeleton: string;
  bgSkeletonSubtle: string;
  border: string;
  borderHover: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  textFaint: string;
  placeholder: string;
  input: string;
  inputFocus: string;
  navBg: string;
  navText: string;
  authBtnBg: string;
  authBtnText: string;
  menuBg: string;
  footerBg: string;
  footerBorder: string;
  overlay: string;
  chipBg: string;
  chipText: string;
  chipBorder: string;
  dropdownBg: string;
  dropdownHover: string;
  dropdownItemBg: string;
  checkboxBorder: string;
  badgeBg: string;
  badgeText: string;
  iconColor: string;
  scrollbarTrack: string;
};

const darkClasses: ThemeClasses = {
  bg: 'bg-black',
  bgSubtle: 'bg-white/5',
  bgHover: 'bg-primary',
  bgSkeleton: 'bg-white/10',
  bgSkeletonSubtle: 'bg-white/5',
  border: 'border-white/10',
  borderHover: 'hover:border-primary/30',
  text: 'text-primary',
  textSecondary: 'text-black',
  textTertiary: 'text-white/50',
  textFaint: 'text-white/30',
  placeholder: 'placeholder-white/40',
  input: 'bg-white/5 border-white/10 text-white',
  inputFocus: 'focus:border-primary',
  navBg: 'bg-black',
  navText: 'text-white',
  authBtnBg: 'bg-black',
  authBtnText: 'text-white',
  menuBg: 'bg-black',
  footerBg: 'bg-black',
  footerBorder: 'border-slate-800',
  overlay: 'bg-black',
  chipBg: 'bg-primary/20',
  chipText: 'text-white',
  chipBorder: 'border-primary/30',
  dropdownBg: 'bg-black',
  dropdownHover: 'hover:bg-white',
  dropdownItemBg: 'bg-black',
  checkboxBorder: 'border-white/30',
  badgeBg: 'bg-primary/10',
  badgeText: 'text-primary',
  iconColor: 'white',
  scrollbarTrack: 'black',
};

const lightClasses: ThemeClasses = {
  bg: 'bg-white',
  bgSubtle: 'bg-gray-100',
  bgHover: 'bg-primary',
  bgSkeleton: 'bg-gray-200',
  bgSkeletonSubtle: 'bg-gray-100',
  border: 'border-gray-200',
  borderHover: 'hover:border-white',
  text: 'text-primary',
  textSecondary: 'text-black',
  textTertiary: 'text-gray-500',
  textFaint: 'text-gray-400',
  placeholder: 'placeholder-gray-400',
  input: 'bg-white border-gray-300 text-gray-900',
  inputFocus: 'focus:border-primary',
  navBg: 'bg-white',
  navText: 'text-gray-900',
  authBtnBg: 'bg-white',
  authBtnText: 'text-gray-900',
  menuBg: 'bg-white',
  footerBg: 'bg-white',
  footerBorder: 'border-gray-200',
  overlay: 'bg-white',
  chipBg: 'bg-primary/20',
  chipText: 'text-gray-900',
  chipBorder: 'border-primary/30',
  dropdownBg: 'bg-white',
  dropdownHover: 'hover:bg-gray-100',
  dropdownItemBg: 'bg-white',
  checkboxBorder: 'border-gray-300',
  badgeBg: 'bg-primary/10',
  badgeText: 'text-primary',
  iconColor: '#1f2937',
  scrollbarTrack: '#f3f4f6',
};

const themeMap: Record<Theme, ThemeClasses> = {
  dark: darkClasses,
  light: lightClasses,
};

export const useThemeClasses = (): ThemeClasses => {
  const { theme } = useTheme();
  return themeMap[theme];
};
