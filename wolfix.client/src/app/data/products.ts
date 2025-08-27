export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  rating: number;
  imageUrl: string;
  brand: string;
  category: 'Смартфони' | 'Ноутбуки' | 'Побутова техніка' | 'Телевізори' | 'Аудіотехніка';
  additionalFee: number;
  specs?: {
    storage?: '64GB' | '128GB' | '256GB' | '512GB' | '1TB';
    ram?: '4GB' | '6GB' | '8GB' | '12GB' | '16GB';
    color?: 'Black' | 'White' | 'Titanium' | 'Blue' | 'Pink' | 'Green' | 'Gray';
    diagonal?: string;
    type?: string;
  };
}

export const allProducts: Product[] = [
  { id: "s01", name: "Смартфон Apple iPhone 16 Pro Max 512Gb Natural Titanium", price: 73009, oldPrice: 78999, rating: 4.9, imageUrl: "/test.png", brand: 'Apple', category: 'Смартфони', additionalFee: 730, specs: { storage: '512GB', ram: '8GB', color: 'Titanium' } },
  { id: "s02", name: "Смартфон Apple iPhone 15 256Gb Pink", price: 39009, oldPrice: 42499, rating: 4.8, imageUrl: "/test.png", brand: 'Apple', category: 'Смартфони', additionalFee: 390, specs: { storage: '256GB', ram: '8GB', color: 'Pink' } },
  { id: "s03", name: "Смартфон Samsung Galaxy S24 FE 8/256GB Graphite", price: 23499, oldPrice: 26999, rating: 4.7, imageUrl: "/test.png", brand: 'Samsung', category: 'Смартфони', additionalFee: 235, specs: { storage: '256GB', ram: '8GB', color: 'Black' } },
  { id: "s04", name: "Смартфон Samsung Galaxy A55 8/256GB Awesome Navy", price: 18999, rating: 4.6, imageUrl: "/test.png", brand: 'Samsung', category: 'Смартфони', additionalFee: 190, specs: { storage: '256GB', ram: '8GB', color: 'Blue' } },
  { id: "s05", name: "Смартфон Xiaomi 14 Pro 12/512GB Black", price: 32999, oldPrice: 35999, rating: 4.8, imageUrl: "/test.png", brand: 'Xiaomi', category: 'Смартфони', additionalFee: 330, specs: { storage: '512GB', ram: '12GB', color: 'Black' } },
  { id: "s06", name: "Смартфон Google Pixel 9 Pro 12/256GB Obsidian", price: 42500, rating: 4.9, imageUrl: "/test.png", brand: 'Google', category: 'Смартфони', additionalFee: 425, specs: { storage: '256GB', ram: '12GB', color: 'Black' } },
  { id: "s07", name: "Смартфон Apple iPhone 16 128GB Green", price: 41000, rating: 4.8, imageUrl: "/test.png", brand: 'Apple', category: 'Смартфони', additionalFee: 410, specs: { storage: '128GB', ram: '8GB', color: 'Green' } },
  { id: "s08", name: "Смартфон Samsung Galaxy Z Fold 7 12/512GB", price: 65000, rating: 4.9, imageUrl: "/test.png", brand: 'Samsung', category: 'Смартфони', additionalFee: 650, specs: { storage: '512GB', ram: '12GB', color: 'Gray' } },
  { id: "s09", name: "Смартфон Xiaomi Redmi Note 13 8/256GB", price: 8999, rating: 4.6, imageUrl: "/test.png", brand: 'Xiaomi', category: 'Смартфони', additionalFee: 90, specs: { storage: '256GB', ram: '8GB', color: 'Blue' } },
  { id: "s10", name: "Смартфон Google Pixel 8a 8/128GB", price: 21000, rating: 4.8, imageUrl: "/test.png", brand: 'Google', category: 'Смартфони', additionalFee: 210, specs: { storage: '128GB', ram: '8GB', color: 'Black' } },
  { id: "l01", name: "Ноутбук Apple MacBook Air 13 M3 8/256GB Space Grey", price: 49999, oldPrice: 54999, rating: 4.9, imageUrl: "/test.png", brand: 'Apple', category: 'Ноутбуки', additionalFee: 500, specs: { storage: '256GB', ram: '8GB', color: 'Gray', diagonal: '13.3"' } },
  { id: "l02", name: "Ноутбук ASUS TUF Gaming F15 15.6\" FHD 144Hz", price: 38999, rating: 4.7, imageUrl: "/test.png", brand: 'ASUS', category: 'Ноутбуки', additionalFee: 390, specs: { storage: '512GB', ram: '16GB', diagonal: '15.6"' } },
  { id: "l03", name: "Ноутбук Lenovo IdeaPad Slim 3 15.6\" FHD", price: 19999, oldPrice: 22999, rating: 4.6, imageUrl: "/test.png", brand: 'Lenovo', category: 'Ноутбуки', additionalFee: 200, specs: { storage: '512GB', ram: '8GB', diagonal: '15.6"' } },
  { id: "l04", name: "Ноутбук HP Pavilion 15 15.6\" FHD IPS", price: 25499, rating: 4.5, imageUrl: "/test.png", brand: 'HP', category: 'Ноутбуки', additionalFee: 255, specs: { storage: '512GB', ram: '16GB', diagonal: '15.6"' } },
  { id: "l05", name: "Ноутбук Dell XPS 15 15.6\" UHD+", price: 75000, rating: 4.8, imageUrl: "/test.png", brand: 'Dell', category: 'Ноутбуки', additionalFee: 750, specs: { storage: '1TB', ram: '16GB', diagonal: '15.6"' } },
  { id: "a01", name: "Пральна машина Samsung WW80T554DAW/UA EcoBubble", price: 21999, oldPrice: 24999, rating: 4.8, imageUrl: "/test.png", brand: 'Samsung', category: 'Побутова техніка', additionalFee: 220, specs: { type: 'Пральна машина' } },
  { id: "a02", name: "Холодильник LG DoorCooling+ GW-B509SLKM", price: 28999, rating: 4.9, imageUrl: "/test.png", brand: 'LG', category: 'Побутова техніка', additionalFee: 290, specs: { type: 'Холодильник' } },
  { id: "a03", name: "Пилосос Dyson V15 Detect Absolute", price: 29999, oldPrice: 32999, rating: 5.0, imageUrl: "/test.png", brand: 'Dyson', category: 'Побутова техніка', additionalFee: 300, specs: { type: 'Пилосос' } },
  { id: "a04", name: "Кавомашина Philips Series 2200 EP2220/10", price: 12999, rating: 4.7, imageUrl: "/test.png", brand: 'Philips', category: 'Побутова техніка', additionalFee: 130, specs: { type: 'Кавомашина' } },
  { id: "a05", name: "Мультипіч TEFAL Air Fry & Grill EY501815", price: 4499, oldPrice: 5999, rating: 4.9, imageUrl: "/test.png", brand: 'TEFAL', category: 'Побутова техніка', additionalFee: 45, specs: { type: 'Мультипіч' } },
  { id: "t01", name: "Телевізор Samsung 55\" QLED 4K Q80C", price: 35999, oldPrice: 39999, rating: 4.8, imageUrl: "/test.png", brand: 'Samsung', category: 'Телевізори', additionalFee: 360, specs: { diagonal: '55"' } },
  { id: "t02", name: "Телевізор LG 65\" OLED 4K C3", price: 79999, rating: 4.9, imageUrl: "/test.png", brand: 'LG', category: 'Телевізори', additionalFee: 800, specs: { diagonal: '65"' } },
  { id: "t03", name: "Телевізор Sony 55\" BRAVIA 4K XR X90L", price: 45999, oldPrice: 49999, rating: 4.9, imageUrl: "/test.png", brand: 'Sony', category: 'Телевізори', additionalFee: 460, specs: { diagonal: '55"' } },
  { id: "au01", name: "Навушники Apple AirPods Pro 2", price: 9599, oldPrice: 10999, rating: 4.9, imageUrl: "/test.png", brand: 'Apple', category: 'Аудіотехніка', additionalFee: 96, specs: { type: 'Навушники' } },
  { id: "au02", name: "Навушники Sony WH-1000XM5", price: 14999, rating: 4.9, imageUrl: "/test.png", brand: 'Sony', category: 'Аудіотехніка', additionalFee: 150, specs: { type: 'Навушники' } },
  { id: "au03", name: "Акустична система Marshall Stanmore III Bluetooth", price: 17999, rating: 5.0, imageUrl: "/test.png", brand: 'Marshall', category: 'Аудіотехніка', additionalFee: 180, specs: { type: 'Колонка' } },
  { id: "au04", name: "Саундбар Samsung HW-Q990C", price: 49999, rating: 4.8, imageUrl: "/test.png", brand: 'Samsung', category: 'Аудіотехніка', additionalFee: 500, specs: { type: 'Саундбар' } },
];

export const promoProducts: Product[] = allProducts.slice(0, 10);