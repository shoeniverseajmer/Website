import type { Category, Order, Product, StoreSettings } from '../types';

const image = (name: string) =>
  `https://images.unsplash.com/${name}?auto=format&fit=crop&w=1000&q=80`;

export const mockProducts: Product[] = [
  {
    id: 'p-1',
    name: 'Apex Evergreen',
    slug: 'apex-evergreen',
    description: 'A chunky dad-style sneaker with layered panels, soft cushioning, and a green-silver finish.',
    price: 6299,
    sale_price: 5799,
    stock: 42,
    gender_category: 'men',
    product_type: 'shoes',
    accessory_type: null,
    occasion: 'casual',
    is_bestseller: true,
    is_on_sale: true,
    is_active: true,
    created_at: new Date().toISOString(),
    product_images: [
      { id: 'i-1', product_id: 'p-1', image_url: image('photo-1549298916-b41d501d3772') },
      { id: 'i-2', product_id: 'p-1', image_url: image('photo-1608231387042-66d1773070a5') }
    ],
    product_variants: [
      { id: 'v-1', product_id: 'p-1', size: '3', color: 'Green Silver', stock: 12 },
      { id: 'v-2', product_id: 'p-1', size: '4', color: 'Green Silver', stock: 18 },
      { id: 'v-3', product_id: 'p-1', size: '5', color: 'Green Silver', stock: 18 },
      { id: 'v-4', product_id: 'p-1', size: '6', color: 'Green Silver', stock: 18 },
      { id: 'v-5', product_id: 'p-1', size: '7', color: 'Green Silver', stock: 18 },
      { id: 'v-6', product_id: 'p-1', size: '8', color: 'Green Silver', stock: 18 },
      { id: 'v-7', product_id: 'p-1', size: '9', color: 'Green Silver', stock: 18 },
      { id: 'v-8', product_id: 'p-1', size: '10', color: 'Green Silver', stock: 18 },
      { id: 'v-9', product_id: 'p-1', size: '11', color: 'Green Silver', stock: 18 },
      { id: 'v-10', product_id: 'p-1', size: '12', color: 'Green Silver', stock: 18 }
    ]
  },
  {
    id: 'p-2',
    name: 'X Lows Chestnut',
    slug: 'x-lows-chestnut',
    description: 'A low-top sneaker with a brown-black palette, padded collar, and clean everyday profile.',
    price: 4299,
    sale_price: null,
    stock: 18,
    gender_category: 'men',
    product_type: 'shoes',
    accessory_type: null,
    occasion: 'casual',
    is_bestseller: true,
    is_on_sale: false,
    is_active: true,
    created_at: new Date().toISOString(),
    product_images: [
      { id: 'i-3', product_id: 'p-2', image_url: image('photo-1543508282-6319a3e2621f') },
      { id: 'i-3b', product_id: 'p-2', image_url: image('photo-1491553895911-0055eca6402d') }
    ],
    product_variants: ['3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((size, index) => ({ id: `v-2-${index}`, product_id: 'p-2', size, color: 'Brown Black', stock: 8 }))
  },
  {
    id: 'p-3',
    name: 'X Lows Greyscale',
    slug: 'x-lows-greyscale',
    description: 'Grey-black low-tops with a versatile palette and cushioned everyday feel.',
    price: 4299,
    sale_price: null,
    stock: 64,
    gender_category: 'women',
    product_type: 'shoes',
    accessory_type: null,
    occasion: 'casual',
    is_bestseller: false,
    is_on_sale: false,
    is_active: true,
    created_at: new Date().toISOString(),
    product_images: [
      { id: 'i-4', product_id: 'p-3', image_url: image('photo-1600185365483-26d7a4cc7519') },
      { id: 'i-4b', product_id: 'p-3', image_url: image('photo-1460353581641-37baddab0fa2') }
    ],
    product_variants: ['3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((size, index) => ({ id: `v-3-${index}`, product_id: 'p-3', size, color: 'Grey Black', stock: 22 }))
  },
  {
    id: 'p-4',
    name: 'Aeon V2 Nimbus',
    slug: 'aeon-v2-nimbus',
    description: 'A lightweight sneaker with a blue multi-tone upper and soft landing comfort.',
    price: 4499,
    sale_price: null,
    stock: 35,
    gender_category: 'women',
    product_type: 'shoes',
    accessory_type: null,
    occasion: 'sports',
    is_bestseller: true,
    is_on_sale: false,
    is_active: true,
    created_at: new Date().toISOString(),
    product_images: [
      { id: 'i-5', product_id: 'p-4', image_url: image('photo-1560769629-975ec94e6a86') },
      { id: 'i-5b', product_id: 'p-4', image_url: image('photo-1525966222134-fcfa99b8ae77') }
    ],
    product_variants: ['3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((size, index) => ({ id: `v-4-${index}`, product_id: 'p-4', size, color: 'Delta Multi Blue', stock: 15 }))
  },
  {
    id: 'p-5',
    name: 'X Lows Malibu',
    slug: 'x-lows-malibu',
    description: 'Pink-green low-tops with summer color and a crisp streetwear outline.',
    price: 4299,
    sale_price: null,
    stock: 51,
    gender_category: 'unisex',
    product_type: 'shoes',
    accessory_type: null,
    occasion: 'sports',
    is_bestseller: true,
    is_on_sale: false,
    is_active: true,
    created_at: new Date().toISOString(),
    product_images: [
      { id: 'i-6', product_id: 'p-5', image_url: image('photo-1552346154-21d32810aba3') },
      { id: 'i-6b', product_id: 'p-5', image_url: image('photo-1607522370275-f14206abe5d3') }
    ],
    product_variants: ['3', '4', '5', '6', '7'].map((size, index) => ({ id: `v-5-${index}`, product_id: 'p-5', size, color: 'Pink Green', stock: 31 }))
  },
  {
    id: 'p-6',
    name: 'Apex Obsidian',
    slug: 'apex-obsidian',
    description: 'Black-grey Apex sneakers with bold paneling and a chunky grounded shape.',
    price: 6299,
    sale_price: 5599,
    stock: 26,
    gender_category: 'unisex',
    product_type: 'shoes',
    accessory_type: null,
    occasion: 'casual',
    is_bestseller: false,
    is_on_sale: true,
    is_active: true,
    created_at: new Date().toISOString(),
    product_images: [
      { id: 'i-7', product_id: 'p-6', image_url: image('photo-1542291026-7eec264c27ff') },
      { id: 'i-7b', product_id: 'p-6', image_url: image('photo-1543508282-6319a3e2621f') }
    ],
    product_variants: ['3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((size, index) => ({ id: `v-6-${index}`, product_id: 'p-6', size, color: 'Black Grey', stock: 11 }))
  },
  {
    id: 'p-7',
    name: 'Junior Orbit Runner',
    slug: 'junior-orbit-runner',
    description: 'Kid-friendly sneakers with a soft footbed, secure grip, and playful cosmic color hits.',
    price: 2799,
    sale_price: null,
    stock: 44,
    gender_category: 'kids',
    product_type: 'shoes',
    accessory_type: null,
    occasion: 'casual',
    is_bestseller: false,
    is_on_sale: false,
    is_active: true,
    created_at: new Date().toISOString(),
    product_images: [
      { id: 'i-8', product_id: 'p-7', image_url: image('photo-1514989940723-e8e51635b782') },
      { id: 'i-8b', product_id: 'p-7', image_url: image('photo-1551107696-a4b0c5a0d9a2') }
    ],
    product_variants: ['1Y', '2Y', '3Y', '4Y', '5Y'].map((size, index) => ({ id: `v-7-${index}`, product_id: 'p-7', size, color: 'Nebula Blue', stock: 10 }))
  },
  {
    id: 'p-8',
    name: 'Orbit Leather Belt',
    slug: 'orbit-leather-belt',
    description: 'A structured belt with a matte buckle and clean finish for casual or festive outfits.',
    price: 1499,
    sale_price: 1199,
    stock: 32,
    gender_category: 'unisex',
    product_type: 'accessories',
    accessory_type: 'belts',
    occasion: 'festive',
    is_bestseller: false,
    is_on_sale: true,
    is_active: true,
    created_at: new Date().toISOString(),
    product_images: [
      { id: 'i-9', product_id: 'p-8', image_url: image('photo-1624222247344-550fb60583dc') },
      { id: 'i-9b', product_id: 'p-8', image_url: image('photo-1603487742131-4160ec999306') }
    ],
    product_variants: ['S', 'M', 'L', 'XL'].map((size, index) => ({ id: `v-8-${index}`, product_id: 'p-8', size, color: 'Black', stock: 8 }))
  },
  {
    id: 'p-9',
    name: 'Meteor Zip Wallet',
    slug: 'meteor-zip-wallet',
    description: 'Compact wallet with card slots, secure zip closure, and a subtle technical sheen.',
    price: 1299,
    sale_price: null,
    stock: 38,
    gender_category: 'unisex',
    product_type: 'accessories',
    accessory_type: 'wallets',
    occasion: 'casual',
    is_bestseller: true,
    is_on_sale: false,
    is_active: true,
    created_at: new Date().toISOString(),
    product_images: [
      { id: 'i-10', product_id: 'p-9', image_url: image('photo-1627123424574-724758594e93') },
      { id: 'i-10b', product_id: 'p-9', image_url: image('photo-1553062407-98eeb64c6a62') }
    ],
    product_variants: [{ id: 'v-9-1', product_id: 'p-9', size: 'OS', color: 'Graphite', stock: 38 }]
  },
  {
    id: 'p-10',
    name: 'Comet Transit Bag',
    slug: 'comet-transit-bag',
    description: 'A durable daily bag with room for essentials, sneaker-care extras, and weekend plans.',
    price: 3499,
    sale_price: null,
    stock: 24,
    gender_category: 'unisex',
    product_type: 'accessories',
    accessory_type: 'bags',
    occasion: 'casual',
    is_bestseller: false,
    is_on_sale: false,
    is_active: true,
    created_at: new Date().toISOString(),
    product_images: [
      { id: 'i-11', product_id: 'p-10', image_url: image('photo-1590874103328-eac38a683ce7') },
      { id: 'i-11b', product_id: 'p-10', image_url: image('photo-1542291026-7eec264c27ff') }
    ],
    product_variants: [{ id: 'v-10-1', product_id: 'p-10', size: 'OS', color: 'Deep Space', stock: 24 }]
  }
];

export const mockCategories: Category[] = [
  { id: 'c-1', name: 'Men', slug: 'men' },
  { id: 'c-2', name: 'Women', slug: 'women' },
  { id: 'c-3', name: 'Kids', slug: 'kids' },
  { id: 'c-4', name: 'Shoes', slug: 'shoes' },
  { id: 'c-5', name: 'Accessories', slug: 'accessories' },
  { id: 'c-6', name: 'Sale', slug: 'sale' }
];

export const mockSettings: StoreSettings = {
  id: 'settings',
  delivery_enabled: true,
  pickup_enabled: true,
  cod_enabled: true,
  delivery_charge: 99,
  pickup_address: 'Comet Studio, Koramangala, Bengaluru, Karnataka'
};

export const mockOrders: Order[] = [
  {
    id: 'ord-1001',
    user_id: 'demo-user',
    total_amount: 4598,
    order_type: 'delivery',
    payment_method: 'cod',
    payment_status: 'pending',
    order_status: 'confirmed',
    address_id: 'addr-1',
    created_at: new Date().toISOString(),
    order_items: [{ id: 'oi-1', order_id: 'ord-1001', product_id: 'p-1', quantity: 1, price: 4499, product: mockProducts[0] }]
  }
];
