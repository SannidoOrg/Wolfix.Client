export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  rating: number;
  imageUrl: string;
  brand: string;
  category: 'Смартфони та телефони' | 'Ноутбуки, планшети та комп\'ютерна техніка' | 'Телевізори та мультимедіа' | 'Смарт-годинники та гаджети' | 'Товари для дому' | 'Товари для кухні' | 'Аудіо, фото та відео';
  additionalFee: number;
  seller: 'Wolfix' | 'Інші';
  series?: string;
  onSale: boolean;
  country: 'Китай' | 'Вʼєтнам' | 'США' | 'Корея' | 'Малайзія' | 'Німеччина' | 'Японія';
  specs: {
    storage?: '64GB' | '128GB' | '256GB' | '512GB' | '1TB';
    ram?: '4GB' | '6GB' | '8GB' | '12GB' | '16GB' | '32GB';
    color?: 'Black' | 'White' | 'Titanium' | 'Blue' | 'Pink' | 'Green' | 'Gray';
    diagonal?: string;
    nfc?: boolean;
    sd_slot?: boolean;
    camera_mp?: number;
    camera_features?: ('Автофокус' | '4K-відео' | 'Оптична стабілізація')[];
    type?: string;
  };
}

export const allProducts: Product[] = [
  { id: "s01", name: "Смартфон Apple iPhone 16 Pro Max 512Gb Natural Titanium", price: 73009, oldPrice: 78999, rating: 4.9, imageUrl: "/test.png", brand: 'Apple', category: 'Смартфони та телефони', additionalFee: 730, seller: 'Wolfix', series: 'iPhone 16', onSale: true, country: 'Китай', specs: { storage: '512GB', ram: '8GB', color: 'Titanium', nfc: true, sd_slot: false, camera_mp: 48, camera_features: ['Автофокус', '4K-відео', 'Оптична стабілізація'] } },
  { id: "s02", name: "Смартфон Apple iPhone 15 256Gb Pink", price: 39009, oldPrice: 42499, rating: 4.8, imageUrl: "/test.png", brand: 'Apple', category: 'Смартфони та телефони', additionalFee: 390, seller: 'Інші', series: 'iPhone 15', onSale: true, country: 'Китай', specs: { storage: '256GB', ram: '8GB', color: 'Pink', nfc: true, sd_slot: false, camera_mp: 48, camera_features: ['Автофокус', '4K-відео'] } },
  { id: "s03", name: "Смартфон Samsung Galaxy S24 FE 8/256GB Graphite", price: 23499, oldPrice: 26999, rating: 4.7, imageUrl: "/test.png", brand: 'Samsung', category: 'Смартфони та телефони', additionalFee: 235, seller: 'Wolfix', series: 'Galaxy S', onSale: true, country: 'Вʼєтнам', specs: { storage: '256GB', ram: '8GB', color: 'Black', nfc: true, sd_slot: true, camera_mp: 50, camera_features: ['Оптична стабілізація'] } },
  { id: "s04", name: "Смартфон Samsung Galaxy A55 8/256GB Awesome Navy", price: 18999, rating: 4.6, imageUrl: "/test.png", brand: 'Samsung', category: 'Смартфони та телефони', additionalFee: 190, seller: 'Wolfix', series: 'Galaxy A', onSale: false, country: 'Вʼєтнам', specs: { storage: '256GB', ram: '8GB', color: 'Blue', nfc: true, sd_slot: true, camera_mp: 50 } },
  { id: "s05", name: "Смартфон Xiaomi 14 Pro 12/512GB Black", price: 32999, oldPrice: 35999, rating: 4.8, imageUrl: "/test.png", brand: 'Xiaomi', category: 'Смартфони та телефони', additionalFee: 330, seller: 'Інші', series: 'Xiaomi 14', onSale: true, country: 'Китай', specs: { storage: '512GB', ram: '12GB', color: 'Black', nfc: true, sd_slot: false, camera_mp: 108, camera_features: ['Автофокус', '4K-відео'] } },
  { id: "s06", name: "Смартфон Google Pixel 9 Pro 12/256GB Obsidian", price: 42500, rating: 4.9, imageUrl: "/test.png", brand: 'Google', category: 'Смартфони та телефони', additionalFee: 425, seller: 'Wolfix', series: 'Pixel 9', onSale: false, country: 'США', specs: { storage: '256GB', ram: '12GB', color: 'Black', nfc: true, sd_slot: false, camera_mp: 50, camera_features: ['Автофокус', '4K-відео'] } },
  { id: "s07", name: "Смартфон Apple iPhone 16 128GB Green", price: 41000, rating: 4.8, imageUrl: "/test.png", brand: 'Apple', category: 'Смартфони та телефони', additionalFee: 410, seller: 'Wolfix', series: 'iPhone 16', onSale: false, country: 'Китай', specs: { storage: '128GB', ram: '8GB', color: 'Green', nfc: true, sd_slot: false, camera_mp: 12, camera_features: ['4K-відео'] } },
  { id: "s08", name: "Смартфон Samsung Galaxy Z Fold 7 12/512GB", price: 65000, rating: 4.9, imageUrl: "/test.png", brand: 'Samsung', category: 'Смартфони та телефони', additionalFee: 650, seller: 'Інші', series: 'Galaxy Z', onSale: false, country: 'Вʼєтнам', specs: { storage: '512GB', ram: '12GB', color: 'Gray', nfc: true, sd_slot: false, camera_mp: 50 } },
  { id: "s09", name: "Смартфон Xiaomi Redmi Note 13 8/256GB", price: 8999, rating: 4.6, imageUrl: "/test.png", brand: 'Xiaomi', category: 'Смартфони та телефони', additionalFee: 90, seller: 'Wolfix', series: 'Redmi Note', onSale: false, country: 'Китай', specs: { storage: '256GB', ram: '8GB', color: 'Blue', nfc: false, sd_slot: true, camera_mp: 108 } },
  { id: "s10", name: "Смартфон Google Pixel 8a 8/128GB", price: 21000, rating: 4.8, imageUrl: "/test.png", brand: 'Google', category: 'Смартфони та телефони', additionalFee: 210, seller: 'Wolfix', series: 'Pixel 8', onSale: false, country: 'США', specs: { storage: '128GB', ram: '8GB', color: 'Black', nfc: true, sd_slot: false, camera_mp: 64 } },
  { id: "s11", name: "Смартфон OnePlus 12 16/512GB Emerald Green", price: 34999, oldPrice: 37999, rating: 4.9, imageUrl: "/test.png", brand: 'OnePlus', category: 'Смартфони та телефони', additionalFee: 350, seller: 'Інші', series: 'OnePlus 12', onSale: true, country: 'Китай', specs: { storage: '512GB', ram: '16GB', color: 'Green', nfc: true, sd_slot: false, camera_mp: 50, camera_features: ['Автофокус', 'Оптична стабілізація'] } },
  { id: "s12", name: "Смартфон ASUS ROG Phone 8 12/256GB", price: 45000, rating: 4.8, imageUrl: "/test.png", brand: 'ASUS', category: 'Смартфони та телефони', additionalFee: 450, seller: 'Wolfix', series: 'ROG Phone', onSale: false, country: 'Китай', specs: { storage: '256GB', ram: '12GB', color: 'Black', nfc: true, sd_slot: false, camera_mp: 50 } },
  { id: "s13", name: "Смартфон Motorola Edge 50 Pro 12/512GB", price: 24999, rating: 4.7, imageUrl: "/test.png", brand: 'Motorola', category: 'Смартфони та телефони', additionalFee: 250, seller: 'Інші', series: 'Edge', onSale: false, country: 'Китай', specs: { storage: '512GB', ram: '12GB', color: 'White', nfc: true, sd_slot: false, camera_mp: 50 } },
  { id: "s14", name: "Смартфон Nothing Phone (2a) 8/128GB", price: 15999, rating: 4.9, imageUrl: "/test.png", brand: 'Nothing', category: 'Смартфони та телефони', additionalFee: 160, seller: 'Wolfix', series: 'Phone (2a)', onSale: false, country: 'Китай', specs: { storage: '128GB', ram: '8GB', color: 'White', nfc: true, sd_slot: false, camera_mp: 50 } },
  { id: "s15", name: "Смартфон Samsung Galaxy S23 8/128GB Lavender", price: 29999, oldPrice: 32999, rating: 4.8, imageUrl: "/test.png", brand: 'Samsung', category: 'Смартфони та телефони', additionalFee: 300, seller: 'Wolfix', series: 'Galaxy S', onSale: true, country: 'Вʼєтнам', specs: { storage: '128GB', ram: '8GB', color: 'Pink', nfc: true, sd_slot: false, camera_mp: 50 } },

  { id: "l01", name: "Ноутбук Apple MacBook Air 13 M3 8/256GB Space Grey", price: 49999, oldPrice: 54999, rating: 4.9, imageUrl: "/test.png", brand: 'Apple', category: 'Ноутбуки, планшети та комп\'ютерна техніка', additionalFee: 500, seller: 'Wolfix', onSale: true, country: 'Китай', specs: { storage: '256GB', ram: '8GB', color: 'Gray', diagonal: '13.3"' } },
  { id: "l02", name: "Ноутбук ASUS TUF Gaming F15 15.6\" FHD 144Hz", price: 38999, rating: 4.7, imageUrl: "/test.png", brand: 'ASUS', category: 'Ноутбуки, планшети та комп\'ютерна техніка', additionalFee: 390, seller: 'Інші', onSale: false, country: 'Китай', specs: { storage: '512GB', ram: '16GB', diagonal: '15.6"' } },
  { id: "l03", name: "Ноутбук Lenovo IdeaPad Slim 3 15.6\" FHD", price: 19999, oldPrice: 22999, rating: 4.6, imageUrl: "/test.png", brand: 'Lenovo', category: 'Ноутбуки, планшети та комп\'ютерна техніка', additionalFee: 200, seller: 'Wolfix', onSale: true, country: 'Китай', specs: { storage: '512GB', ram: '8GB', diagonal: '15.6"' } },
  { id: "l04", name: "Ноутбук HP Pavilion 15 15.6\" FHD IPS", price: 25499, rating: 4.5, imageUrl: "/test.png", brand: 'HP', category: 'Ноутбуки, планшети та комп\'ютерна техніка', additionalFee: 255, seller: 'Інші', onSale: false, country: 'Китай', specs: { storage: '512GB', ram: '16GB', diagonal: '15.6"' } },
  { id: "l05", name: "Ноутбук Dell XPS 15 15.6\" UHD+", price: 75000, rating: 4.8, imageUrl: "/test.png", brand: 'Dell', category: 'Ноутбуки, планшети та комп\'ютерна техніка', additionalFee: 750, seller: 'Wolfix', onSale: false, country: 'Малайзія', specs: { storage: '1TB', ram: '16GB', diagonal: '15.6"' } },
  { id: "l06", name: "Ноутбук Acer Swift Go 14 14\" OLED", price: 35000, rating: 4.7, imageUrl: "/test.png", brand: 'Acer', category: 'Ноутбуки, планшети та комп\'ютерна техніка', additionalFee: 350, seller: 'Wolfix', onSale: false, country: 'Китай', specs: { storage: '512GB', ram: '16GB', diagonal: '14"' } },
  { id: "l07", name: "Ноутбук Microsoft Surface Laptop 5 13.5\"", price: 42000, oldPrice: 45000, rating: 4.8, imageUrl: "/test.png", brand: 'Microsoft', category: 'Ноутбуки, планшети та комп\'ютерна техніка', additionalFee: 420, seller: 'Інші', onSale: true, country: 'США', specs: { storage: '512GB', ram: '8GB', diagonal: '13.5"' } },
  { id: "l08", name: "Планшет Apple iPad Pro 11 M4 Wi-Fi 256GB", price: 48999, rating: 5.0, imageUrl: "/test.png", brand: 'Apple', category: 'Ноутбуки, планшети та комп\'ютерна техніка', additionalFee: 490, seller: 'Wolfix', onSale: false, country: 'Китай', specs: { storage: '256GB', diagonal: '11"' } },
  { id: "l09", name: "Планшет Samsung Galaxy Tab S9 FE Wi-Fi 128GB", price: 19999, oldPrice: 21999, rating: 4.7, imageUrl: "/test.png", brand: 'Samsung', category: 'Ноутбуки, планшети та комп\'ютерна техніка', additionalFee: 200, seller: 'Wolfix', onSale: true, country: 'Вʼєтнам', specs: { storage: '128GB', diagonal: '10.9"' } },
  { id: "l10", name: "Клавіатура Logitech MX Keys S", price: 4599, rating: 4.9, imageUrl: "/test.png", brand: 'Logitech', category: 'Ноутбуки, планшети та комп\'ютерна техніка', additionalFee: 46, seller: 'Інші', onSale: false, country: 'Китай', specs: { type: 'Клавіатура' } },
  { id: "l11", name: "Миша Logitech MX Master 3S", price: 4199, rating: 4.9, imageUrl: "/test.png", brand: 'Logitech', category: 'Ноутбуки, планшети та комп\'ютерна техніка', additionalFee: 42, seller: 'Wolfix', onSale: false, country: 'Китай', specs: { type: 'Миша' } },
  { id: "l12", name: "Монітор Dell UltraSharp U2723QE 27\" 4K", price: 25000, rating: 4.8, imageUrl: "/test.png", brand: 'Dell', category: 'Ноутбуки, планшети та комп\'ютерна техніка', additionalFee: 250, seller: 'Інші', onSale: false, country: 'Китай', specs: { diagonal: '27"' } },
  { id: "l13", name: "Принтер Canon PIXMA G3420", price: 6999, rating: 4.7, imageUrl: "/test.png", brand: 'Canon', category: 'Ноутбуки, планшети та комп\'ютерна техніка', additionalFee: 70, seller: 'Wolfix', onSale: false, country: 'Вʼєтнам', specs: { type: 'Принтер' } },
  { id: "l14", name: "Wi-Fi роутер ASUS RT-AX86U Pro", price: 9999, rating: 4.9, imageUrl: "/test.png", brand: 'ASUS', category: 'Ноутбуки, планшети та комп\'ютерна техніка', additionalFee: 100, seller: 'Wolfix', onSale: false, country: 'Китай', specs: { type: 'Роутер' } },
  { id: "l15", name: "Ноутбук Razer Blade 16 16\" QHD+ 240Hz", price: 120000, rating: 4.9, imageUrl: "/test.png", brand: 'Razer', category: 'Ноутбуки, планшети та комп\'ютерна техніка', additionalFee: 1200, seller: 'Інші', onSale: false, country: 'США', specs: { storage: '1TB', ram: '32GB', diagonal: '16"' } },

  { id: "t01", name: "Телевізор Samsung 55\" QLED 4K Q80C", price: 35999, oldPrice: 39999, rating: 4.8, imageUrl: "/test.png", brand: 'Samsung', category: 'Телевізори та мультимедіа', additionalFee: 360, seller: 'Wolfix', onSale: true, country: 'Корея', specs: { diagonal: '55"' } },
  { id: "t02", name: "Телевізор LG 65\" OLED 4K C3", price: 79999, rating: 4.9, imageUrl: "/test.png", brand: 'LG', category: 'Телевізори та мультимедіа', additionalFee: 800, seller: 'Інші', onSale: false, country: 'Корея', specs: { diagonal: '65"' } },
  { id: "t03", name: "Телевізор Sony 55\" BRAVIA 4K XR X90L", price: 45999, oldPrice: 49999, rating: 4.9, imageUrl: "/test.png", brand: 'Sony', category: 'Телевізори та мультимедіа', additionalFee: 460, seller: 'Wolfix', onSale: true, country: 'Японія', specs: { diagonal: '55"' } },
  { id: "t04", name: "Телевізор Philips 50\" PUS8507 The One", price: 24999, rating: 4.7, imageUrl: "/test.png", brand: 'Philips', category: 'Телевізори та мультимедіа', additionalFee: 250, seller: 'Wolfix', onSale: false, country: 'Китай', specs: { diagonal: '50"' } },
  { id: "t05", name: "Медіаплеєр Apple TV 4K 128GB Wi-Fi + Ethernet", price: 6999, rating: 5.0, imageUrl: "/test.png", brand: 'Apple', category: 'Телевізори та мультимедіа', additionalFee: 70, seller: 'Інші', onSale: false, country: 'Китай', specs: { type: 'Медіаплеєр' } },
  { id: "t06", name: "Проектор XGIMI Horizon Pro", price: 55000, rating: 4.8, imageUrl: "/test.png", brand: 'XGIMI', category: 'Телевізори та мультимедіа', additionalFee: 550, seller: 'Wolfix', onSale: false, country: 'Китай', specs: { type: 'Проектор' } },
  { id: "t07", name: "Телевізор Hisense 75\" U8KQ Mini-LED", price: 65000, oldPrice: 72000, rating: 4.7, imageUrl: "/test.png", brand: 'Hisense', category: 'Телевізори та мультимедіа', additionalFee: 650, seller: 'Інші', onSale: true, country: 'Китай', specs: { diagonal: '75"' } },
  { id: "t08", name: "Телевізор Kivi 32\" F750NB", price: 7999, rating: 4.5, imageUrl: "/test.png", brand: 'Kivi', category: 'Телевізори та мультимедіа', additionalFee: 80, seller: 'Wolfix', onSale: false, country: 'Китай', specs: { diagonal: '32"' } },
  { id: "t09", name: "Ігрова приставка Sony PlayStation 5 Slim", price: 20999, rating: 4.9, imageUrl: "/test.png", brand: 'Sony', category: 'Телевізори та мультимедіа', additionalFee: 210, seller: 'Wolfix', onSale: false, country: 'Японія', specs: { type: 'Ігрова консоль' } },
  { id: "t10", name: "Ігрова приставка Microsoft Xbox Series X", price: 21999, rating: 4.9, imageUrl: "/test.png", brand: 'Microsoft', category: 'Телевізори та мультимедіа', additionalFee: 220, seller: 'Інші', onSale: false, country: 'США', specs: { type: 'Ігрова консоль' } },

  { id: "w01", name: "Смарт-годинник Apple Watch Series 9 45mm", price: 15999, oldPrice: 17999, rating: 4.9, imageUrl: "/test.png", brand: 'Apple', category: 'Смарт-годинники та гаджети', additionalFee: 160, seller: 'Wolfix', onSale: true, country: 'Вʼєтнам', specs: { color: 'Black', diagonal: '45mm' } },
  { id: "w02", name: "Смарт-годинник Samsung Galaxy Watch 6 Classic 47mm", price: 14999, rating: 4.8, imageUrl: "/test.png", brand: 'Samsung', category: 'Смарт-годинники та гаджети', additionalFee: 150, seller: 'Інші', onSale: false, country: 'Вʼєтнам', specs: { color: 'Black', diagonal: '47mm' } },
  { id: "w03", name: "Фітнес-браслет Xiaomi Smart Band 8", price: 1499, rating: 4.7, imageUrl: "/test.png", brand: 'Xiaomi', category: 'Смарт-годинники та гаджети', additionalFee: 15, seller: 'Wolfix', onSale: false, country: 'Китай', specs: { color: 'Black' } },
  { id: "w04", name: "GPS-годинник Garmin Fenix 7X Sapphire Solar", price: 35000, rating: 4.9, imageUrl: "/test.png", brand: 'Garmin', category: 'Смарт-годинники та гаджети', additionalFee: 350, seller: 'Інші', onSale: false, country: 'США', specs: { color: 'Titanium' } },
  { id: "w05", name: "Квадрокоптер DJI Mavic 4 Fly More Combo", price: 117849, rating: 4.9, imageUrl: "/test.png", brand: 'DJI', category: 'Смарт-годинники та гаджети', additionalFee: 1178, seller: 'Wolfix', onSale: false, country: 'Китай', specs: { type: 'Квадрокоптер' } },
  { id: "w06", name: "Електронна книга PocketBook 628", price: 5999, rating: 4.8, imageUrl: "/test.png", brand: 'PocketBook', category: 'Смарт-годинники та гаджети', additionalFee: 60, seller: 'Інші', onSale: false, country: 'Китай', specs: { type: 'Електронна книга' } },

  { id: "h01", name: "Робот-пилосос Roborock Q7 Max", price: 17999, rating: 4.8, imageUrl: "/test.png", brand: 'Roborock', category: 'Товари для дому', additionalFee: 180, seller: 'Інші', onSale: false, country: 'Китай', specs: { type: 'Робот-пилосос' } },
  { id: "h02", name: "Очищувач повітря Philips Series 2000i", price: 11999, rating: 4.9, imageUrl: "/test.png", brand: 'Philips', category: 'Товари для дому', additionalFee: 120, seller: 'Wolfix', onSale: false, country: 'Китай', specs: { type: 'Очищувач повітря' } },

  { id: "k01", name: "Кухонний комбайн Bosch MUM 5", price: 9999, oldPrice: 11999, rating: 4.7, imageUrl: "/test.png", brand: 'Bosch', category: 'Товари для кухні', additionalFee: 100, seller: 'Wolfix', onSale: true, country: 'Німеччина', specs: { type: 'Кухонний комбайн' } },
  { id: "k02", name: "Електрочайник Tefal Smart'n Light", price: 2499, rating: 4.8, imageUrl: "/test.png", brand: 'Tefal', category: 'Товари для кухні', additionalFee: 25, seller: 'Інші', onSale: false, country: 'Китай', specs: { type: 'Електрочайник' } },

  { id: "av01", name: "Фотокамера Sony Alpha 7 IV Body", price: 89999, rating: 5.0, imageUrl: "/test.png", brand: 'Sony', category: 'Аудіо, фото та відео', additionalFee: 900, seller: 'Wolfix', onSale: false, country: 'Японія', specs: { type: 'Фотокамера' } },
  { id: "av02", name: "Екшн-камера GoPro HERO12 Black", price: 17999, rating: 4.8, imageUrl: "/test.png", brand: 'GoPro', category: 'Аудіо, фото та відео', additionalFee: 180, seller: 'Інші', onSale: false, country: 'США', specs: { type: 'Екшн-камера' } },
];

export const promoProducts: Product[] = allProducts.slice(0, 10);