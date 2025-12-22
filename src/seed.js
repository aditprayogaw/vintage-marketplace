import { db } from './FireBase'
import { collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore'

const newProducts = [
  // --- T-SHIRTS ---
  {
    name: "Vintage Rolling Stones Tour Tee",
    price: 350000,
    categories: "T-Shirts",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80",
    size: "L",
    condition: "Second",
    color: "Black",
    rating: 4.8,
    storeName: "Retro Bali",
    storeLocation: "Denpasar",
    createdAt: new Date().toISOString()
  },
  {
    name: "90s Graphic Harley Davidson Tee",
    price: 450000,
    categories: "T-Shirts",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=80",
    size: "XL",
    condition: "Second",
    color: "Faded Black",
    rating: 4.7,
    storeName: "Canggu Preloved",
    storeLocation: "Badung",
    createdAt: new Date().toISOString()
  },
  {
    name: "Basic White Oversized Tee",
    price: 85000,
    categories: "T-Shirts",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
    size: "M",
    condition: "New",
    color: "White",
    rating: 4.5,
    storeName: "Seminyak Style",
    storeLocation: "Badung",
    createdAt: new Date().toISOString()
  },
  {
    name: "Nike Swoosh Vintage Tee",
    price: 150000,
    categories: "T-Shirts",
    image: "https://images.unsplash.com/photo-1571512760924-a7455d3e6966?w=500&q=80",
    size: "L",
    condition: "Second",
    color: "Navy",
    rating: 4.6,
    storeName: "Denpasar Secondhand",
    storeLocation: "Denpasar",
    createdAt: new Date().toISOString()
  },
  {
    name: "Tie Dye Psychedelic Tee",
    price: 120000,
    categories: "T-Shirts",
    image: "https://images.unsplash.com/photo-1534960680480-add7b3b9b47f?w=500&q=80",
    size: "S",
    condition: "New",
    color: "Multi",
    rating: 4.9,
    storeName: "Ubud Thrift",
    storeLocation: "Gianyar",
    createdAt: new Date().toISOString()
  },

  // --- SHIRTS (Kemeja) ---
  {
    name: "Vintage Flannel Shirt Red",
    price: 125000,
    categories: "Shirts",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80",
    size: "XL",
    condition: "Second",
    color: "Red",
    rating: 4.5,
    storeName: "Canggu Preloved",
    storeLocation: "Badung",
    createdAt: new Date().toISOString()
  },
  {
    name: "Hawaiian Summer Aloha Shirt",
    price: 95000,
    categories: "Shirts",
    image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=500&q=80",
    size: "L",
    condition: "Second",
    color: "Blue Floral",
    rating: 4.3,
    storeName: "Sanur Classics",
    storeLocation: "Denpasar",
    createdAt: new Date().toISOString()
  },
  {
    name: "Ralph Lauren Oxford Shirt",
    price: 250000,
    categories: "Shirts",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&q=80",
    size: "M",
    condition: "Second",
    color: "White",
    rating: 4.8,
    storeName: "Retro Bali",
    storeLocation: "Denpasar",
    createdAt: new Date().toISOString()
  },
  {
    name: "Corduroy Overshirt Brown",
    price: 180000,
    categories: "Shirts",
    image: "https://images.unsplash.com/photo-1509506637375-3816656c125d?w=500&q=80",
    size: "L",
    condition: "Second",
    color: "Brown",
    rating: 4.6,
    storeName: "Kuta Vintage",
    storeLocation: "Badung",
    createdAt: new Date().toISOString()
  },
  {
    name: "Silk Blouse Elegant",
    price: 220000,
    categories: "Shirts",
    image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=500&q=80",
    size: "S",
    condition: "New",
    color: "Cream",
    rating: 5.0,
    storeName: "Seminyak Style",
    storeLocation: "Badung",
    createdAt: new Date().toISOString()
  },

  // --- JACKETS & OUTERWEAR ---
  {
    name: "Classic Leather Biker Jacket",
    price: 850000,
    categories: "Jackets",
    image: "https://images.unsplash.com/photo-1551028919-383718bccf3b?w=500&q=80",
    size: "L",
    condition: "Second",
    color: "Black",
    rating: 4.7,
    storeName: "Kuta Vintage",
    storeLocation: "Badung",
    createdAt: new Date().toISOString()
  },
  {
    name: "Vintage Levi's Denim Jacket",
    price: 450000,
    categories: "Jackets",
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500&q=80",
    size: "M",
    condition: "Second",
    color: "Blue",
    rating: 4.9,
    storeName: "Retro Bali",
    storeLocation: "Denpasar",
    createdAt: new Date().toISOString()
  },
  {
    name: "90s Colorful Windbreaker",
    price: 250000,
    categories: "Jackets",
    image: "https://images.unsplash.com/photo-1606105961732-6b326f034079?w=500&q=80",
    size: "L",
    condition: "Second",
    color: "Multi",
    rating: 4.6,
    storeName: "Denpasar Secondhand",
    storeLocation: "Denpasar",
    createdAt: new Date().toISOString()
  },
  {
    name: "NY Knicks Varsity Jacket",
    price: 550000,
    categories: "Jackets",
    image: "https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=500&q=80",
    size: "XL",
    condition: "Second",
    color: "Blue/Orange",
    rating: 4.8,
    storeName: "Retro Bali",
    storeLocation: "Denpasar",
    createdAt: new Date().toISOString()
  },
  {
    name: "Oversized Beige Blazer",
    price: 320000,
    categories: "Jackets",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80",
    size: "L",
    condition: "Second",
    color: "Beige",
    rating: 4.5,
    storeName: "Sanur Classics",
    storeLocation: "Denpasar",
    createdAt: new Date().toISOString()
  },

  // --- HOODIES & SWEATERS ---
  {
    name: "Champion Reverse Weave Hoodie",
    price: 300000,
    categories: "Hoodies & Sweaters",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&q=80",
    size: "M",
    condition: "Second",
    color: "Grey",
    rating: 4.9,
    storeName: "Denpasar Secondhand",
    storeLocation: "Denpasar",
    createdAt: new Date().toISOString()
  },
  {
    name: "Adidas Firebird Tracktop",
    price: 220000,
    categories: "Hoodies & Sweaters",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&q=80",
    size: "S",
    condition: "Second",
    color: "Black",
    rating: 4.5,
    storeName: "Seminyak Style",
    storeLocation: "Badung",
    createdAt: new Date().toISOString()
  },
  {
    name: "Vintage Argyle Knit Vest",
    price: 150000,
    categories: "Hoodies & Sweaters",
    image: "https://images.unsplash.com/photo-1621335829175-95f437384d7c?w=500&q=80",
    size: "M",
    condition: "Second",
    color: "Green Pattern",
    rating: 4.7,
    storeName: "Canggu Preloved",
    storeLocation: "Badung",
    createdAt: new Date().toISOString()
  },
  {
    name: "Cozy Wool Cardigan",
    price: 180000,
    categories: "Hoodies & Sweaters",
    image: "https://images.unsplash.com/photo-1624835656557-6ce1b4a97491?w=500&q=80",
    size: "One Size",
    condition: "Second",
    color: "Cream",
    rating: 4.8,
    storeName: "Ubud Thrift",
    storeLocation: "Gianyar",
    createdAt: new Date().toISOString()
  },
  {
    name: "Nike Crewneck Sweatshirt",
    price: 200000,
    categories: "Hoodies & Sweaters",
    image: "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=500&q=80",
    size: "L",
    condition: "Second",
    color: "Black",
    rating: 4.6,
    storeName: "Sanur Classics",
    storeLocation: "Denpasar",
    createdAt: new Date().toISOString()
  },

  // --- PANTS & JEANS ---
  {
    name: "Levi's 501 Original Jeans",
    price: 450000,
    categories: "Jeans",
    image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=500&q=80",
    size: "32",
    condition: "Second",
    color: "Light Blue",
    rating: 4.8,
    storeName: "Retro Bali",
    storeLocation: "Denpasar",
    createdAt: new Date().toISOString()
  },
  {
    name: "Dickies 874 Work Pants",
    price: 250000,
    categories: "Pants",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80",
    size: "30",
    condition: "Second",
    color: "Black",
    rating: 4.5,
    storeName: "Kuta Vintage",
    storeLocation: "Badung",
    createdAt: new Date().toISOString()
  },
  {
    name: "Vintage Corduroy Pants",
    price: 220000,
    categories: "Pants",
    image: "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=500&q=80",
    size: "32",
    condition: "Second",
    color: "Brown",
    rating: 4.4,
    storeName: "Sanur Classics",
    storeLocation: "Denpasar",
    createdAt: new Date().toISOString()
  },
  {
    name: "Army Cargo Pants",
    price: 200000,
    categories: "Pants",
    image: "https://images.unsplash.com/photo-1517445312882-5636cbab7c48?w=500&q=80",
    size: "34",
    condition: "Second",
    color: "Green",
    rating: 4.3,
    storeName: "Denpasar Secondhand",
    storeLocation: "Denpasar",
    createdAt: new Date().toISOString()
  },
  {
    name: "High Waist Yoga Leggings",
    price: 150000,
    categories: "Pants",
    image: "https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=500&q=80",
    size: "M",
    condition: "New",
    color: "Black",
    rating: 4.8,
    storeName: "Ubud Thrift",
    storeLocation: "Gianyar",
    createdAt: new Date().toISOString()
  },

  // --- DRESSES & SKIRTS ---
  {
    name: "Floral Summer Midi Dress",
    price: 180000,
    categories: "Dresses",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80",
    size: "M",
    condition: "Second",
    color: "Yellow Floral",
    rating: 4.7,
    storeName: "Ubud Thrift",
    storeLocation: "Gianyar",
    createdAt: new Date().toISOString()
  },
  {
    name: "Pleated Midi Skirt",
    price: 120000,
    categories: "Skirts",
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&q=80",
    size: "S",
    condition: "New",
    color: "Beige",
    rating: 5.0,
    storeName: "Jimbaran Thrifting",
    storeLocation: "Badung",
    createdAt: new Date().toISOString()
  },
  {
    name: "Black Slip Dress Silk",
    price: 135000,
    categories: "Dresses",
    image: "https://images.unsplash.com/photo-1596541223806-11fdeaa351fc?w=500&q=80",
    size: "S",
    condition: "New",
    color: "Black",
    rating: 4.9,
    storeName: "Seminyak Style",
    storeLocation: "Badung",
    createdAt: new Date().toISOString()
  },
  {
    name: "Denim Mini Skirt",
    price: 90000,
    categories: "Skirts",
    image: "https://images.unsplash.com/photo-1605763240004-7e93b172d754?w=500&q=80",
    size: "M",
    condition: "Second",
    color: "Blue",
    rating: 4.4,
    storeName: "Canggu Preloved",
    storeLocation: "Badung",
    createdAt: new Date().toISOString()
  },
  {
    name: "Bohemian Maxi Dress",
    price: 210000,
    categories: "Dresses",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&q=80",
    size: "L",
    condition: "New",
    color: "Pink Pattern",
    rating: 4.8,
    storeName: "Ubud Thrift",
    storeLocation: "Gianyar",
    createdAt: new Date().toISOString()
  },

  // --- SHOES (Alas Kaki) ---
  {
    name: "Converse Chuck 70s High",
    price: 550000,
    categories: "Shoes",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&q=80",
    size: "42",
    condition: "New",
    color: "Black",
    rating: 5.0,
    storeName: "Retro Bali",
    storeLocation: "Denpasar",
    createdAt: new Date().toISOString()
  },
  {
    name: "Dr. Martens 1460 Boots",
    price: 1500000,
    categories: "Shoes",
    image: "https://images.unsplash.com/photo-1605034313761-73ea4a0cfbf3?w=500&q=80",
    size: "40",
    condition: "Second",
    color: "Cherry Red",
    rating: 4.8,
    storeName: "Canggu Preloved",
    storeLocation: "Badung",
    createdAt: new Date().toISOString()
  },
  {
    name: "Nike Air Jordan 1 Low",
    price: 2200000,
    categories: "Shoes",
    image: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=500&q=80",
    size: "43",
    condition: "New",
    color: "Red/White",
    rating: 5.0,
    storeName: "Seminyak Style",
    storeLocation: "Badung",
    createdAt: new Date().toISOString()
  },
  {
    name: "Birkenstock Arizona Sandals",
    price: 650000,
    categories: "Shoes",
    image: "https://images.unsplash.com/photo-1623838271383-7df9f993d500?w=500&q=80",
    size: "39",
    condition: "Second",
    color: "Brown",
    rating: 4.7,
    storeName: "Ubud Thrift",
    storeLocation: "Gianyar",
    createdAt: new Date().toISOString()
  },
  {
    name: "New Balance 530 Running",
    price: 950000,
    categories: "Shoes",
    image: "https://images.unsplash.com/photo-1593548965691-34a1b027d73b?w=500&q=80",
    size: "38",
    condition: "Second",
    color: "White/Silver",
    rating: 4.8,
    storeName: "Denpasar Secondhand",
    storeLocation: "Denpasar",
    createdAt: new Date().toISOString()
  },
  {
    name: "Classic Penny Loafers",
    price: 350000,
    categories: "Shoes",
    image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500&q=80",
    size: "42",
    condition: "Second",
    color: "Black",
    rating: 4.3,
    storeName: "Sanur Classics",
    storeLocation: "Denpasar",
    createdAt: new Date().toISOString()
  },
  {
    name: "Vintage Cowboy Boots",
    price: 750000,
    categories: "Shoes",
    image: "https://images.unsplash.com/photo-1534970028765-38ce47ef7d8d?w=500&q=80",
    size: "41",
    condition: "Second",
    color: "Brown",
    rating: 4.6,
    storeName: "Kuta Vintage",
    storeLocation: "Badung",
    createdAt: new Date().toISOString()
  },
  {
    name: "90s Kitten Heels",
    price: 250000,
    categories: "Shoes",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80",
    size: "37",
    condition: "Second",
    color: "Black",
    rating: 4.4,
    storeName: "Jimbaran Thrifting",
    storeLocation: "Badung",
    createdAt: new Date().toISOString()
  },
  {
    name: "Vans Old Skool",
    price: 400000,
    categories: "Shoes",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&q=80",
    size: "40",
    condition: "Second",
    color: "Black/White",
    rating: 4.7,
    storeName: "Seminyak Style",
    storeLocation: "Badung",
    createdAt: new Date().toISOString()
  },
  {
    name: "Chunky Platform Boots",
    price: 600000,
    categories: "Shoes",
    image: "https://images.unsplash.com/photo-1605034313761-73ea4a0cfbf3?w=500&q=80",
    size: "38",
    condition: "New",
    color: "Black",
    rating: 4.9,
    storeName: "Canggu Preloved",
    storeLocation: "Badung",
    createdAt: new Date().toISOString()
  },

  // --- ACCESSORIES (Aksesori) ---
  {
    name: "Rayban Wayfarer Classic",
    price: 900000,
    categories: "Accessories",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80",
    size: "One Size",
    condition: "Second",
    color: "Black",
    rating: 4.9,
    storeName: "Seminyak Style",
    storeLocation: "Badung",
    createdAt: new Date().toISOString()
  },
  {
    name: "Casio Vintage Digital Watch",
    price: 250000,
    categories: "Accessories",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&q=80",
    size: "One Size",
    condition: "Second",
    color: "Silver",
    rating: 4.5,
    storeName: "Retro Bali",
    storeLocation: "Denpasar",
    createdAt: new Date().toISOString()
  },
  {
    name: "Stussy Bucket Hat",
    price: 150000,
    categories: "Hats",
    image: "https://images.unsplash.com/photo-1618354691792-d1d42acfd860?w=500&q=80",
    size: "M",
    condition: "Second",
    color: "Black",
    rating: 4.6,
    storeName: "Canggu Preloved",
    storeLocation: "Badung",
    createdAt: new Date().toISOString()
  },
  {
    name: "Brown Leather Tote Bag",
    price: 450000,
    categories: "Accessories",
    image: "https://images.unsplash.com/photo-1590874103328-2784de6d4959?w=500&q=80",
    size: "One Size",
    condition: "Second",
    color: "Brown",
    rating: 4.7,
    storeName: "Ubud Thrift",
    storeLocation: "Gianyar",
    createdAt: new Date().toISOString()
  },
  {
    name: "Silk Red Scarf",
    price: 80000,
    categories: "Accessories",
    image: "https://images.unsplash.com/photo-1584030373081-f37b7bb4faae?w=500&q=80",
    size: "One Size",
    condition: "New",
    color: "Red",
    rating: 5.0,
    storeName: "Sanur Classics",
    storeLocation: "Denpasar",
    createdAt: new Date().toISOString()
  },
  {
    name: "Carhartt Beanie Grey",
    price: 100000,
    categories: "Hats",
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500&q=80",
    size: "One Size",
    condition: "Second",
    color: "Grey",
    rating: 4.3,
    storeName: "Denpasar Secondhand",
    storeLocation: "Denpasar",
    createdAt: new Date().toISOString()
  },
  {
    name: "Bali Silver Ring",
    price: 120000,
    categories: "Accessories",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80",
    size: "7",
    condition: "New",
    color: "Silver",
    rating: 4.8,
    storeName: "Ubud Thrift",
    storeLocation: "Gianyar",
    createdAt: new Date().toISOString()
  },
  {
    name: "Leather Belt",
    price: 90000,
    categories: "Accessories",
    image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=500&q=80",
    size: "M",
    condition: "Second",
    color: "Black",
    rating: 4.2,
    storeName: "Retro Bali",
    storeLocation: "Denpasar",
    createdAt: new Date().toISOString()
  },
  {
    name: "Nike Crew Socks (3 Pairs)",
    price: 45000,
    categories: "Accessories",
    image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50f82?w=500&q=80",
    size: "L",
    condition: "New",
    color: "White",
    rating: 4.9,
    storeName: "Jimbaran Thrifting",
    storeLocation: "Badung",
    createdAt: new Date().toISOString()
  },
  {
    name: "Vintage Pearl Necklace",
    price: 300000,
    categories: "Accessories",
    image: "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=500&q=80",
    size: "One Size",
    condition: "Second",
    color: "White",
    rating: 4.9,
    storeName: "Sanur Classics",
    storeLocation: "Denpasar",
    createdAt: new Date().toISOString()
  }
]

export const seedDatabase = async () => {
  console.log("Mulai proses update data produk...")
  
  // 1. Hapus Semua Data Lama
  const querySnapshot = await getDocs(collection(db, "products"));
  const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
  console.log("Data lama dihapus.")

  // 2. Masukkan Data Baru
  for (const product of newProducts) {
      await addDoc(collection(db, "products"), product);
  }
  console.log("Data baru berhasil ditambahkan! Silakan refresh halaman.")
  alert("Database berhasil di-reset dengan 50 data Fashion baru!")
}