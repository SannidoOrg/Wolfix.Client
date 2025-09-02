export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  rating: number;
  imageUrl: string;
  brand: string;
  category: string;
  additionalFee: number;
  seller: 'Wolfix' | 'Інші';
  series?: string;
  onSale: boolean;
  country: string;
  specs: ProductSpecs;
}

export interface ProductSpecs {
  storage?: string;
  ram?: string;
  color?: string;
  diagonal?: string;
  nfc?: boolean;
  sd_slot?: boolean;
  camera_mp?: number;
  camera_modules?: number;
  camera_features?: string[];
  type?: string;
  purpose?: string;
  material?: string;
  powerSource?: string;
  gender?: string;
  ageRange?: string;
  petType?: string;
  size?: string;
  compatibility?: string;
  strapMaterial?: string;
  powerOutput?: string;
  batteryCapacity?: string;
  maxSpeed?: string;
  range?: string;
  productType?: string;
  volume?: string;
  subCategory?: string;
}

export const allProducts: Product[] = [
  { id: "s01", name: "Смартфон Apple iPhone 16 Pro Max 512Gb", price: 73009, oldPrice: 78999, rating: 4.9, imageUrl: "/test.png", brand: 'Apple', category: 'Смартфони', additionalFee: 730, seller: 'Wolfix', series: 'iPhone 16', onSale: true, country: 'Китай', specs: { storage: '512GB', ram: '8GB', color: 'Titanium', nfc: true, sd_slot: false, camera_mp: 48, camera_modules: 3, camera_features: ['Автофокус', 'Підтримка знімання 4K', 'Спалах', 'Стабілізація', 'Телеобʼєктив'], diagonal: '6.9"' } },
  { id: "s03", name: "Смартфон Samsung Galaxy S24 FE 8/256GB", price: 23499, oldPrice: 26999, rating: 4.7, imageUrl: "/test.png", brand: 'Samsung', category: 'Смартфони', additionalFee: 235, seller: 'Wolfix', series: 'Galaxy S', onSale: true, country: 'Вʼєтнам', specs: { storage: '256GB', ram: '8GB', color: 'Black', nfc: true, sd_slot: true, camera_mp: 50, camera_modules: 3, camera_features: ['Стабілізація', 'Ширококутний обʼєктив'], diagonal: '6.5"' } },
  { id: "l01", name: "Ноутбук Apple MacBook Air 13 M3 8/256GB Space Grey", price: 49999, oldPrice: 54999, rating: 4.9, imageUrl: "/test.png", brand: 'Apple', category: 'Ноутбуки', additionalFee: 500, seller: 'Wolfix', onSale: true, country: 'Китай', specs: { storage: '256GB', ram: '8GB', color: 'Gray', diagonal: '13.3"', type: 'Ноутбук' } },
  { id: "l02", name: "Ноутбук ASUS TUF Gaming F15 15.6\" FHD 144Hz", price: 38999, rating: 4.7, imageUrl: "/test.png", brand: 'ASUS', category: 'Ноутбуки', additionalFee: 390, seller: 'Інші', onSale: false, country: 'Китай', specs: { storage: '512GB', ram: '16GB', diagonal: '15.6"', type: 'Ноутбук' } },
  { id: "t01", name: "Телевізор Samsung 55\" QLED 4K Q80C", price: 35999, oldPrice: 39999, rating: 4.8, imageUrl: "/test.png", brand: 'Samsung', category: 'Телевізори', additionalFee: 360, seller: 'Wolfix', onSale: true, country: 'Корея', specs: { diagonal: '55"' } },
  { id: "t02", name: "Телевізор LG 65\" OLED 4K C3", price: 79999, rating: 4.9, imageUrl: "/test.png", brand: 'LG', category: 'Телевізори', additionalFee: 800, seller: 'Інші', onSale: false, country: 'Корея', specs: { diagonal: '65"' } },
  { id: "w01", name: "Смарт-годинник Apple Watch Series 9 GPS 45mm", price: 18999, rating: 5.0, imageUrl: "/test.png", brand: 'Apple', category: 'Смарт-годинники', additionalFee: 190, seller: 'Wolfix', onSale: false, country: 'Китай', specs: { compatibility: 'iOS', strapMaterial: 'Силікон', nfc: true, color: 'Black' } },
  { id: "w02", name: "Смарт-годинник Samsung Galaxy Watch 6 Classic 47mm", price: 15499, oldPrice: 17999, rating: 4.8, imageUrl: "/test.png", brand: 'Samsung', category: 'Смарт-годинники', additionalFee: 155, seller: 'Інші', onSale: true, country: 'Вʼєтнам', specs: { compatibility: 'Android', strapMaterial: 'Шкіра', nfc: true, color: 'Silver' } },
  { id: "h01", name: "Робот-пилосос Roborock Q8 Max", price: 19999, rating: 4.9, imageUrl: "/test.png", brand: 'Roborock', category: 'Товари для дому', additionalFee: 200, seller: 'Wolfix', onSale: false, country: 'Китай', specs: { type: 'Робот-пилосос', powerSource: 'Акумулятор' } },
  { id: "h02", name: "Зволожувач повітря Philips HU4803/01", price: 4299, rating: 4.7, imageUrl: "/test.png", brand: 'Philips', category: 'Товари для дому', additionalFee: 43, seller: 'Інші', onSale: false, country: 'Китай', specs: { type: 'Зволожувач повітря', powerSource: 'Мережа' } },
  { id: "a01", name: "Пральна машина Samsung WW80T554DAW/UA EcoBubble", price: 21999, oldPrice: 24999, rating: 4.8, imageUrl: "/test.png", brand: 'Samsung', category: 'Побутова техніка', additionalFee: 220, seller: 'Wolfix', onSale: true, country: 'Корея', specs: { type: 'Пральна машина' } },
  { id: "a03", name: "Пилосос Dyson V15 Detect Absolute", price: 29999, oldPrice: 32999, rating: 5.0, imageUrl: "/test.png", brand: 'Dyson', category: 'Побутова техніка', additionalFee: 300, seller: 'Wolfix', onSale: true, country: 'Малайзія', specs: { type: 'Пилосос' } },
  { id: "au01", name: "Навушники Apple AirPods Pro 2", price: 9599, oldPrice: 10999, rating: 4.9, imageUrl: "/test.png", brand: 'Apple', category: 'Аудіотехніка', additionalFee: 96, seller: 'Wolfix', onSale: true, country: 'Вʼєтнам', specs: { type: 'Навушники' } },
  { id: "au02", name: "Навушники Sony WH-1000XM5", price: 14999, rating: 4.9, imageUrl: "/test.png", brand: 'Sony', category: 'Аудіотехніка', additionalFee: 150, seller: 'Інші', onSale: false, country: 'Малайзія', specs: { type: 'Навушники' } },
  { id: "g01", name: "Ігрова консоль Sony PlayStation 5 Slim", price: 20999, rating: 5.0, imageUrl: "/test.png", brand: 'Sony', category: 'Геймінг', additionalFee: 210, seller: 'Wolfix', onSale: false, country: 'Японія', specs: { type: 'Ігрова консоль' } },
  { id: "g02", name: "Ігрова консоль Microsoft Xbox Series X", price: 21999, oldPrice: 23999, rating: 4.9, imageUrl: "/test.png", brand: 'Microsoft', category: 'Геймінг', additionalFee: 220, seller: 'Інші', onSale: true, country: 'США', specs: { type: 'Ігрова консоль' } },
  { id: "b01", name: "Фен-стайлер Dyson Airwrap Complete Long", price: 24999, rating: 5.0, imageUrl: "/test.png", brand: 'Dyson', category: 'Краса і здоров\'я', additionalFee: 250, seller: 'Wolfix', onSale: false, country: 'Малайзія', specs: { purpose: 'Догляд за волоссям', powerSource: 'Мережа' } },
  { id: "b02", name: "Електрична зубна щітка Philips Sonicare DiamondClean", price: 8999, rating: 4.9, imageUrl: "/test.png", brand: 'Philips', category: 'Краса і здоров\'я', additionalFee: 90, seller: 'Інші', onSale: false, country: 'Китай', specs: { purpose: 'Догляд за ротовою порожниною', powerSource: 'Акумулятор' } },
  { id: "k01", name: "Дитячий візочок Anex m/type 3в1", price: 34500, rating: 4.9, imageUrl: "/test.png", brand: 'Anex', category: 'Дитячі товари', additionalFee: 345, seller: 'Wolfix', onSale: false, country: 'Польща', specs: { ageRange: '0-3 роки', type: 'Візочки' } },
  { id: "k02", name: "Конструктор LEGO Technic Bugatti Bolide", price: 2199, rating: 5.0, imageUrl: "/test.png", brand: 'LEGO', category: 'Дитячі товари', additionalFee: 22, seller: 'Інші', onSale: false, country: 'Данія', specs: { ageRange: '9+ років', type: 'Конструктори' } },
  { id: "p01", name: "Корм для котів Royal Canin Sterilised", price: 1899, rating: 4.8, imageUrl: "/test.png", brand: 'Royal Canin', category: 'Зоотовари', additionalFee: 19, seller: 'Wolfix', onSale: false, country: 'Франція', specs: { petType: 'Коти', ageRange: 'Дорослі' } },
  { id: "p02", name: "Автоматична годівниця Petkit Fresh Element Solo", price: 3200, rating: 4.9, imageUrl: "/test.png", brand: 'Petkit', category: 'Зоотовари', additionalFee: 32, seller: 'Інші', onSale: false, country: 'Китай', specs: { petType: 'Коти', type: 'Аксесуари' } },
  { id: "c01", name: "Кросівки Nike Air Max 270", price: 5499, rating: 4.8, imageUrl: "/test.png", brand: 'Nike', category: 'Одяг та взуття', additionalFee: 55, seller: 'Wolfix', onSale: false, country: 'Вʼєтнам', specs: { gender: 'Чоловічий', size: 'L', type: 'Взуття' } },
  { id: "c02", name: "Худі The North Face Drew Peak", price: 3299, oldPrice: 4000, rating: 4.9, imageUrl: "/test.png", brand: 'The North Face', category: 'Одяг та взуття', additionalFee: 33, seller: 'Інші', onSale: true, country: 'Туреччина', specs: { gender: 'Унісекс', size: 'M', type: 'Одяг' } },
  { id: "tl01", name: "Акумуляторний шуруповерт Bosch UniversalDrill 18V", price: 3499, rating: 4.8, imageUrl: "/test.png", brand: 'Bosch', category: 'Інструменти', additionalFee: 35, seller: 'Wolfix', onSale: false, country: 'Німеччина', specs: { powerSource: 'Акумулятор', type: 'Електроінструмент' } },
  { id: "tl02", name: "Набір інструментів TOPTUL GCAI108R 108 од.", price: 4200, rating: 5.0, imageUrl: "/test.png", brand: 'TOPTUL', category: 'Інструменти', additionalFee: 42, seller: 'Інші', onSale: false, country: 'Тайвань', specs: { powerSource: 'Ручний', type: 'Набори інструментів' } },
  { id: "e01", name: "Зарядна станція EcoFlow DELTA 2", price: 39999, rating: 4.9, imageUrl: "/test.png", brand: 'EcoFlow', category: 'Енергозабезпечення', additionalFee: 400, seller: 'Wolfix', onSale: false, country: 'Китай', specs: { type: 'Зарядна станція', powerOutput: '1800 Вт', batteryCapacity: '1024 Вт·год' } },
  { id: "e02", name: "Павербанк Anker 737 PowerCore 24K", price: 5499, oldPrice: 6200, rating: 4.8, imageUrl: "/test.png", brand: 'Anker', category: 'Енергозабезпечення', additionalFee: 55, seller: 'Інші', onSale: true, country: 'Китай', specs: { type: 'Павербанк', batteryCapacity: '24000 мА·год' } },
  { id: "tr01", name: "Електросамокат Xiaomi Electric Scooter 4 Pro", price: 27999, rating: 4.7, imageUrl: "/test.png", brand: 'Xiaomi', category: 'Транспорт', additionalFee: 280, seller: 'Wolfix', onSale: false, country: 'Китай', specs: { type: 'Електросамокат', maxSpeed: '25 км/год', range: '55 км' } },
  { id: "tr02", name: "Електровелосипед Engwe EP-2 Pro", price: 42000, rating: 4.8, imageUrl: "/test.png", brand: 'Engwe', category: 'Транспорт', additionalFee: 420, seller: 'Інші', onSale: false, country: 'Польща', specs: { type: 'Електровелосипед', maxSpeed: '45 км/год', range: '120 км' } },
  { id: "f01", name: "Кава в зернах Lavazza Qualita Oro", price: 549, rating: 5.0, imageUrl: "/test.png", brand: 'Lavazza', category: 'Їжа та напої', additionalFee: 5, seller: 'Wolfix', onSale: false, country: 'Італія', specs: { productType: 'Кава', volume: '1 кг' } },
  { id: "f02", name: "Оливкова олія Monini Classico Extra Virgin", price: 399, rating: 4.9, imageUrl: "/test.png", brand: 'Monini', category: 'Їжа та напої', additionalFee: 4, seller: 'Інші', onSale: false, country: 'Італія', specs: { productType: 'Олії', volume: '1 л' } },
  { id: "lr01", name: "Намет Terra Incognita Alfa 3", price: 4899, rating: 4.8, imageUrl: "/test.png", brand: 'Terra Incognita', category: 'Дім та відпочинок', additionalFee: 49, seller: 'Wolfix', onSale: false, country: 'Україна', specs: { subCategory: 'Туризм', material: 'Поліестер' } },
  { id: "lr02", name: "Гантелі розбірні 2 по 10 кг", price: 1999, oldPrice: 2500, rating: 4.7, imageUrl: "/test.png", brand: '4FIZJO', category: 'Дім та відпочинок', additionalFee: 20, seller: 'Інші', onSale: true, country: 'Польща', specs: { subCategory: 'Спорттовари', material: 'Метал' } },
];

export const promoProducts: Product[] = allProducts.filter(p => p.onSale).slice(0, 10);