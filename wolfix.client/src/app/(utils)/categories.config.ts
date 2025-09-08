export const categoriesConfig = [
  { slug: 'smartfony', displayName: 'Смартфони та телефони', internalName: 'Смартфони' },
  { slug: 'noutbuky', displayName: 'Ноутбуки, планшети та комп\'ютерна техніка', internalName: 'Ноутбуки' },
  { slug: 'televizory', displayName: 'Телевізори та мультимедіа', internalName: 'Телевізори' },
  { slug: 'smart-godynnyky', displayName: 'Смарт-годинники та гаджети', internalName: 'Смарт-годинники' },
  { slug: 'tovary-dlya-domu', displayName: 'Товари для дому', internalName: 'Товари для дому' },
  { slug: 'pobutova-tekhnika', displayName: 'Товари для кухні', internalName: 'Побутова техніка' },
  { slug: 'audiotekhnika', displayName: 'Аудіо, фото та відео', internalName: 'Аудіотехніка' },
  { slug: 'heyminh', displayName: 'Геймінг, ігри консолі', internalName: 'Геймінг' },
  { slug: 'krasa-i-zdorovya', displayName: 'Краса і здоров\'я', internalName: 'Краса і здоров\'я' },
  { slug: 'dytyachi-tovary', displayName: 'Дитячі товари', internalName: 'Дитячі товари' },
  { slug: 'zootovary', displayName: 'Зоотовари', internalName: 'Зоотовари' },
  { slug: 'odyah-ta-vzuttya', displayName: 'Одяг, взуття та прикраси', internalName: 'Одяг та взуття' },
  { slug: 'dim-ta-vidpochynok', displayName: 'Дім та відпочинок', internalName: 'Дім та відпочинок' },
  { slug: 'yizha-ta-napoyi', displayName: 'Їжа та напої', internalName: 'Їжа та напої' },
  { slug: 'instrumenty', displayName: 'Інструменти та автотовари', internalName: 'Інструменти' },
  { slug: 'transport', displayName: 'Персональний транспорт', internalName: 'Транспорт' },
  { slug: 'enerhozabezpechennya', displayName: 'Енергозабезпечення', internalName: 'Енергозабезпечення' },
];

export const categoryNameMap: { [key: string]: string } = {};
export const categorySlugMap: { [key: string]: string } = {};

categoriesConfig.forEach(cat => {
  categoryNameMap[cat.displayName] = cat.internalName;
  categorySlugMap[cat.slug] = cat.displayName;
});