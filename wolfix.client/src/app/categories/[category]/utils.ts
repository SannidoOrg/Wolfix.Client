export const getCategoryName = (category: string): string => {
  const categoryMap: Record<string, string> = {
    smartfony: 'Смартфони та телефони',
    notebook: 'Ноутбуки, планшети та комп\'ютерна техніка',
    televizory: 'Телевізори та мультимедіа',
    'smart-godinniki': 'Смарт-годинники та гаджети',
    'tovary-dlya-domu': 'Товари для дому',
    'tovary-dlya-kuxni': 'Товари для кухні',
    'audio-foto-video': 'Аудіо, фото та відео',
    'gaming-pro-konsoli': 'Геймінг, ігри консолі',
    'krasa-i-zdorovya': 'Краса і здоров\'я',
    'dityachi-tovary': 'Дитячі товари',
    zootovary: 'Зоотовари',
    'odjag-vzuttya-ta-prykrasy': 'Одяг, взуття та прикраси',
    'dim-ta-vydpohnok': 'Дім та відпочинок',
    'ixa-ta-napoi': 'Їжа та напої',
    'instrumenty-ta-avtovary': 'Інструменти та автотовари',
    'persolalnyj-transpor': 'Персональний транспорт',
    Energozabezpechennya: 'Енергозабезпечення',
  };
  return categoryMap[category] || 'Категорія не знайдена';
};