import { Filters } from '../categories/[category]/[brand]/BrandPageClient';

type FilterType = 'checkbox' | 'range' | 'binary' | 'special';

export interface FilterConfig {
  id: keyof Filters;
  title: string;
  type: FilterType;
}

export const categoryFilters: { [category: string]: FilterConfig[] } = {
  'Смартфони': [
    { id: 'brands', title: 'Бренд', type: 'checkbox' },
    { id: 'price', title: 'Ціна', type: 'range' },
    { id: 'series', title: 'Серія', type: 'special' },
    { id: 'colors', title: 'Колір', type: 'checkbox' },
    { id: 'storage', title: 'Вбудована пам’ять', type: 'checkbox' },
    { id: 'ram', title: 'Оперативна пам’ять', type: 'checkbox' },
    { id: 'diagonal', title: 'Діагональ екрану', type: 'special' },
    { id: 'nfc', title: 'NFC', type: 'binary' },
    { id: 'sd_slot', title: 'Окремий слот для картки пам’яті', type: 'binary' },
    { id: 'camera_modules', title: 'Кількість модулів камери', type: 'checkbox' },
    { id: 'country', title: 'Країна-виробник', type: 'checkbox' },
    { id: 'onSale', title: 'Вигідні пропозиції', type: 'special' },
  ],
  'Ноутбуки': [
    { id: 'brands', title: 'Бренд', type: 'checkbox' },
    { id: 'price', title: 'Ціна', type: 'range' },
    { id: 'type', title: 'Тип товару', type: 'checkbox' },
    { id: 'ram', title: 'Оперативна пам’ять', type: 'checkbox' },
    { id: 'storage', title: 'Обсяг накопичувача', type: 'checkbox' },
    { id: 'diagonal', title: 'Діагональ екрану', type: 'special' },
    { id: 'country', title: 'Країна-виробник', type: 'checkbox' },
    { id: 'onSale', title: 'Вигідні пропозиції', type: 'special' },
  ],
  'Телевізори': [
    { id: 'brands', title: 'Бренд', type: 'checkbox' },
    { id: 'price', title: 'Ціна', type: 'range' },
    { id: 'diagonal', title: 'Діагональ', type: 'special' },
    { id: 'country', title: 'Країна-виробник', type: 'checkbox' },
    { id: 'onSale', title: 'Вигідні пропозиції', type: 'special' },
  ],
  'Смарт-годинники': [
    { id: 'brands', title: 'Бренд', type: 'checkbox' },
    { id: 'price', title: 'Ціна', type: 'range' },
    { id: 'compatibility', title: 'Сумісність', type: 'checkbox' },
    { id: 'strapMaterial', title: 'Матеріал ремінця', type: 'checkbox' },
    { id: 'nfc', title: 'NFC', type: 'binary' },
    { id: 'country', title: 'Країна-виробник', type: 'checkbox' },
    { id: 'onSale', title: 'Вигідні пропозиції', type: 'special' },
  ],
  'Товари для дому': [
    { id: 'brands', title: 'Бренд', type: 'checkbox' },
    { id: 'price', title: 'Ціна', type: 'range' },
    { id: 'type', title: 'Тип пристрою', type: 'checkbox' },
    { id: 'powerSource', title: 'Джерело живлення', type: 'checkbox' },
    { id: 'country', title: 'Країна-виробник', type: 'checkbox' },
    { id: 'onSale', title: 'Вигідні пропозиції', type: 'special' },
  ],
  'Побутова техніка': [
      { id: 'brands', title: 'Бренд', type: 'checkbox' },
      { id: 'price', title: 'Ціна', type: 'range' },
      { id: 'type', title: 'Тип пристрою', type: 'checkbox' },
      { id: 'country', title: 'Країна-виробник', type: 'checkbox' },
      { id: 'onSale', title: 'Вигідні пропозиції', type: 'special' },
  ],
  'Аудіотехніка': [
      { id: 'brands', title: 'Бренд', type: 'checkbox' },
      { id: 'price', title: 'Ціна', type: 'range' },
      { id: 'type', title: 'Тип пристрою', type: 'checkbox' },
      { id: 'country', title: 'Країна-виробник', type: 'checkbox' },
      { id: 'onSale', title: 'Вигідні пропозиції', type: 'special' },
  ],
  'Геймінг': [
    { id: 'brands', title: 'Бренд', type: 'checkbox' },
    { id: 'price', title: 'Ціна', type: 'range' },
    { id: 'type', title: 'Тип платформи', type: 'checkbox' },
    { id: 'onSale', title: 'Вигідні пропозиції', type: 'special' },
  ],
  'Краса і здоров\'я': [
    { id: 'brands', title: 'Бренд', type: 'checkbox' },
    { id: 'price', title: 'Ціна', type: 'range' },
    { id: 'purpose', title: 'Призначення', type: 'checkbox' },
    { id: 'powerSource', title: 'Джерело живлення', type: 'checkbox' },
    { id: 'country', title: 'Країна-виробник', type: 'checkbox' },
    { id: 'onSale', title: 'Вигідні пропозиції', type: 'special' },
  ],
  'Дитячі товари': [
    { id: 'brands', title: 'Бренд', type: 'checkbox' },
    { id: 'price', title: 'Ціна', type: 'range' },
    { id: 'type', title: 'Тип товару', type: 'checkbox' },
    { id: 'ageRange', title: 'Вікова група', type: 'checkbox' },
    { id: 'onSale', title: 'Вигідні пропозиції', type: 'special' },
  ],
  'Зоотовари': [
    { id: 'brands', title: 'Бренд', type: 'checkbox' },
    { id: 'price', title: 'Ціна', type: 'range' },
    { id: 'petType', title: 'Вид тварини', type: 'checkbox' },
    { id: 'ageRange', title: 'Вік тварини', type: 'checkbox' },
    { id: 'onSale', title: 'Вигідні пропозиції', type: 'special' },
  ],
  'Одяг та взуття': [
    { id: 'brands', title: 'Бренд', type: 'checkbox' },
    { id: 'price', title: 'Ціна', type: 'range' },
    { id: 'gender', title: 'Стать', type: 'checkbox' },
    { id: 'size', title: 'Розмір', type: 'checkbox' },
    { id: 'type', title: 'Тип', type: 'checkbox' },
    { id: 'onSale', title: 'Вигідні пропозиції', type: 'special' },
  ],
   'Інструменти': [
    { id: 'brands', title: 'Бренд', type: 'checkbox' },
    { id: 'price', title: 'Ціна', type: 'range' },
    { id: 'type', title: 'Тип', type: 'checkbox' },
    { id: 'powerSource', title: 'Джерело живлення', type: 'checkbox' },
    { id: 'onSale', title: 'Вигідні пропозиції', type: 'special' },
  ],
  'Енергозабезпечення': [
    { id: 'brands', title: 'Бренд', type: 'checkbox' },
    { id: 'price', title: 'Ціна', type: 'range' },
    { id: 'type', title: 'Тип пристрою', type: 'checkbox' },
    { id: 'powerOutput', title: 'Вихідна потужність', type: 'checkbox' },
    { id: 'batteryCapacity', title: 'Ємність батареї', type: 'checkbox' },
    { id: 'onSale', title: 'Вигідні пропозиції', type: 'special' },
  ],
  'Транспорт': [
    { id: 'brands', title: 'Бренд', type: 'checkbox' },
    { id: 'price', title: 'Ціна', type: 'range' },
    { id: 'type', title: 'Тип транспорту', type: 'checkbox' },
    { id: 'maxSpeed', title: 'Максимальна швидкість', type: 'checkbox' },
    { id: 'range', title: 'Запас ходу', type: 'checkbox' },
    { id: 'onSale', title: 'Вигідні пропозиції', type: 'special' },
  ],
  'Їжа та напої': [
    { id: 'brands', title: 'Бренд', type: 'checkbox' },
    { id: 'price', title: 'Ціна', type: 'range' },
    { id: 'productType', title: 'Тип продукту', type: 'checkbox' },
    { id: 'country', title: 'Країна-виробник', type: 'checkbox' },
    { id: 'onSale', title: 'Вигідні пропозиції', type: 'special' },
  ],
  'Дім та відпочинок': [
    { id: 'brands', title: 'Бренд', type: 'checkbox' },
    { id: 'price', title: 'Ціна', type: 'range' },
    { id: 'subCategory', title: 'Категорія', type: 'checkbox' },
    { id: 'material', title: 'Матеріал', type: 'checkbox' },
    { id: 'country', title: 'Країна-виробник', type: 'checkbox' },
    { id: 'onSale', title: 'Вигідні пропозиції', type: 'special' },
  ],
};