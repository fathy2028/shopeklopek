import { useTranslation } from 'react-i18next';

export const usePrices = () => {
  const { t, i18n } = useTranslation();
  const currency = i18n.language === 'ar' ? 'جنية' : 'EGP';

  return [
    {
      _id: 0,
      name: i18n.language === 'ar' ? `0 إلى 19 ${currency}` : `${currency} 0 to 19`,
      array: [0, 19]
    },
    {
      _id: 1,
      name: i18n.language === 'ar' ? `20 إلى 39 ${currency}` : `${currency} 20 to 39`,
      array: [20, 39]
    },
    {
      _id: 2,
      name: i18n.language === 'ar' ? `40 إلى 59 ${currency}` : `${currency} 40 to 59`,
      array: [40, 59]
    },
    {
      _id: 3,
      name: i18n.language === 'ar' ? `60 إلى 99 ${currency}` : `${currency} 60 to 99`,
      array: [60, 99]
    },
    {
      _id: 4,
      name: i18n.language === 'ar' ? `100 ${currency} أو أكثر` : `${currency} 100 or more`,
      array: [100, 1000000]
    }
  ];
};

// Keep the old export for backward compatibility
export const Prices = [
  {
    _id: 0,
    name: "EGP 0 to 19",
    array: [0, 19]
  },
  {
    _id: 1,
    name: "EGP 20 to 39",
    array: [20, 39]
  },
  {
    _id: 2,
    name: "EGP 40 to 59",
    array: [40, 59]
  },
  {
    _id: 3,
    name: "EGP 60 to 99",
    array: [60, 99]
  },
  {
    _id: 4,
    name: "EGP 100 or more",
    array: [100, 1000000]
  }
];