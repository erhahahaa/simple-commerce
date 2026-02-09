import { db } from "./index";
import { category, product } from "./schema";

// Helper to generate unique IDs
function generateId(prefix: string) {
	return `${prefix}_${crypto.randomUUID()}`;
}

// Helper to create slug from name
function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.trim();
}

// Sample product images from Unsplash (e-commerce friendly)
const PRODUCT_IMAGES = {
	electronics: [
		"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
		"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
		"https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800",
		"https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800",
	],
	fashion: [
		"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
		"https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
		"https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800",
		"https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800",
	],
	home: [
		"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
		"https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800",
		"https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800",
		"https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800",
	],
	beauty: [
		"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800",
		"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",
		"https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800",
		"https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800",
	],
	sports: [
		"https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800",
		"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
		"https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800",
		"https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800",
	],
	food: [
		"https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800",
		"https://images.unsplash.com/photo-1553531889-e6cf4d692b1b?w=800",
		"https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=800",
		"https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800",
	],
};

// Category data
const CATEGORIES = [
	{
		name: "Electronics",
		slug: "electronics",
		description:
			"Gadgets, devices, and electronic accessories for your daily needs",
		image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800",
	},
	{
		name: "Fashion",
		slug: "fashion",
		description: "Trendy clothing, footwear, and accessories",
		image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800",
	},
	{
		name: "Home & Living",
		slug: "home-living",
		description: "Furniture, decor, and essentials for your home",
		image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800",
	},
	{
		name: "Beauty & Health",
		slug: "beauty-health",
		description: "Skincare, makeup, and wellness products",
		image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800",
	},
	{
		name: "Sports & Outdoors",
		slug: "sports-outdoors",
		description: "Equipment and gear for sports and outdoor activities",
		image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
	},
	{
		name: "Food & Beverages",
		slug: "food-beverages",
		description: "Delicious snacks, drinks, and gourmet foods",
		image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
	},
];

// Product data by category
const PRODUCTS_BY_CATEGORY: Record<
	string,
	Array<{
		name: string;
		description: string;
		price: number;
		stock: number;
	}>
> = {
	electronics: [
		{
			name: "Wireless Bluetooth Headphones",
			description:
				"Premium wireless headphones with active noise cancellation, 30-hour battery life, and comfortable over-ear design. Perfect for music lovers and professionals.",
			price: 1250000,
			stock: 50,
		},
		{
			name: "Smart Watch Pro",
			description:
				"Advanced smartwatch with heart rate monitoring, GPS tracking, water resistance up to 50m, and 7-day battery life. Compatible with Android and iOS.",
			price: 2500000,
			stock: 35,
		},
		{
			name: "Portable Power Bank 20000mAh",
			description:
				"High-capacity power bank with fast charging support. Features 2 USB-A ports and 1 USB-C port for charging multiple devices simultaneously.",
			price: 350000,
			stock: 100,
		},
		{
			name: "Wireless Earbuds Mini",
			description:
				"Compact true wireless earbuds with crystal clear sound, touch controls, and IPX5 water resistance. Includes portable charging case.",
			price: 450000,
			stock: 75,
		},
		{
			name: "USB-C Hub 7-in-1",
			description:
				"Versatile USB-C hub with HDMI 4K output, USB 3.0 ports, SD card reader, and 100W power delivery pass-through.",
			price: 550000,
			stock: 60,
		},
		{
			name: "Mechanical Gaming Keyboard",
			description:
				"RGB backlit mechanical keyboard with hot-swappable switches, N-key rollover, and programmable macros. Built for gamers and typists.",
			price: 890000,
			stock: 40,
		},
	],
	fashion: [
		{
			name: "Classic Running Sneakers",
			description:
				"Lightweight and breathable running shoes with cushioned sole for maximum comfort. Available in multiple colors and sizes.",
			price: 750000,
			stock: 80,
		},
		{
			name: "Premium Leather Wallet",
			description:
				"Handcrafted genuine leather wallet with RFID blocking technology. Features multiple card slots and a coin pocket.",
			price: 320000,
			stock: 120,
		},
		{
			name: "Cotton Casual T-Shirt",
			description:
				"100% premium cotton t-shirt with a relaxed fit. Soft, breathable, and perfect for everyday wear.",
			price: 150000,
			stock: 200,
		},
		{
			name: "Denim Jacket Classic",
			description:
				"Timeless denim jacket with a comfortable fit. Features button closure, chest pockets, and adjustable cuffs.",
			price: 650000,
			stock: 45,
		},
		{
			name: "Sports Cap Adjustable",
			description:
				"Breathable sports cap with adjustable strap. UV protection and moisture-wicking fabric keep you cool.",
			price: 120000,
			stock: 150,
		},
		{
			name: "Canvas Backpack Large",
			description:
				"Durable canvas backpack with laptop compartment, multiple pockets, and padded straps for comfort.",
			price: 380000,
			stock: 65,
		},
	],
	"home-living": [
		{
			name: "Aromatherapy Diffuser",
			description:
				"Ultrasonic essential oil diffuser with LED mood lighting and auto shut-off feature. Covers up to 30 sqm.",
			price: 280000,
			stock: 90,
		},
		{
			name: "Memory Foam Pillow",
			description:
				"Ergonomic memory foam pillow that adapts to your head and neck. Includes breathable bamboo cover.",
			price: 350000,
			stock: 70,
		},
		{
			name: "LED Desk Lamp Smart",
			description:
				"Adjustable LED desk lamp with touch control, multiple brightness levels, and USB charging port.",
			price: 420000,
			stock: 55,
		},
		{
			name: "Ceramic Plant Pot Set",
			description:
				"Set of 3 minimalist ceramic plant pots with drainage holes and bamboo trays. Perfect for succulents.",
			price: 180000,
			stock: 85,
		},
		{
			name: "Stainless Steel Vacuum Flask",
			description:
				"Double-wall vacuum insulated flask keeps drinks hot for 12 hours or cold for 24 hours. 500ml capacity.",
			price: 250000,
			stock: 110,
		},
		{
			name: "Cozy Throw Blanket",
			description:
				"Ultra-soft fleece throw blanket perfect for couch or bed. Machine washable and lightweight.",
			price: 220000,
			stock: 95,
		},
	],
	"beauty-health": [
		{
			name: "Vitamin C Serum",
			description:
				"Brightening vitamin C serum with hyaluronic acid. Reduces dark spots and improves skin texture. 30ml.",
			price: 280000,
			stock: 100,
		},
		{
			name: "Facial Cleansing Brush",
			description:
				"Electric facial cleansing brush with silicone bristles. Waterproof with 3 speed settings.",
			price: 350000,
			stock: 60,
		},
		{
			name: "Natural Lip Balm Set",
			description:
				"Set of 4 organic lip balms in assorted flavors. Made with beeswax and natural oils.",
			price: 85000,
			stock: 180,
		},
		{
			name: "Hair Growth Serum",
			description:
				"Clinically tested hair growth serum that strengthens hair follicles and promotes growth. 50ml.",
			price: 450000,
			stock: 45,
		},
		{
			name: "Sunscreen SPF 50+",
			description:
				"Lightweight, non-greasy sunscreen with broad spectrum protection. Water-resistant for up to 80 minutes.",
			price: 180000,
			stock: 130,
		},
		{
			name: "Jade Roller & Gua Sha Set",
			description:
				"Authentic jade roller and gua sha set for facial massage. Reduces puffiness and improves circulation.",
			price: 220000,
			stock: 75,
		},
	],
	"sports-outdoors": [
		{
			name: "Yoga Mat Premium",
			description:
				"Extra thick (6mm) non-slip yoga mat with carrying strap. Eco-friendly TPE material.",
			price: 320000,
			stock: 80,
		},
		{
			name: "Resistance Bands Set",
			description:
				"Set of 5 resistance bands with different strength levels. Includes door anchor and carrying bag.",
			price: 180000,
			stock: 120,
		},
		{
			name: "Sports Water Bottle 1L",
			description:
				"BPA-free sports water bottle with time marker and motivational quotes. Leak-proof design.",
			price: 120000,
			stock: 150,
		},
		{
			name: "Fitness Tracker Band",
			description:
				"Slim fitness tracker with step counter, sleep monitoring, and heart rate sensor. 7-day battery.",
			price: 450000,
			stock: 55,
		},
		{
			name: "Camping Headlamp LED",
			description:
				"Bright LED headlamp with multiple modes including red light. USB rechargeable with motion sensor.",
			price: 180000,
			stock: 90,
		},
		{
			name: "Foam Roller Massage",
			description:
				"High-density foam roller for muscle recovery and deep tissue massage. 45cm length.",
			price: 250000,
			stock: 70,
		},
	],
	"food-beverages": [
		{
			name: "Premium Coffee Beans 500g",
			description:
				"Single-origin Arabica coffee beans from Toraja. Medium roast with notes of chocolate and citrus.",
			price: 180000,
			stock: 100,
		},
		{
			name: "Organic Green Tea Box",
			description:
				"Premium Japanese green tea in pyramid bags. 20 sachets of pure organic sencha.",
			price: 95000,
			stock: 140,
		},
		{
			name: "Mixed Nuts & Dried Fruits",
			description:
				"Healthy snack mix of almonds, cashews, walnuts, and dried cranberries. 250g resealable pack.",
			price: 120000,
			stock: 160,
		},
		{
			name: "Artisan Dark Chocolate Bar",
			description:
				"72% cacao dark chocolate made from Indonesian cocoa beans. No artificial additives. 100g.",
			price: 65000,
			stock: 200,
		},
		{
			name: "Local Honey Pure 500ml",
			description:
				"100% pure raw honey from local apiaries. Unfiltered and unpasteurized for maximum benefits.",
			price: 150000,
			stock: 85,
		},
		{
			name: "Instant Oatmeal Variety Pack",
			description:
				"Box of 12 instant oatmeal packets in 4 flavors: original, honey, chocolate, and mixed berries.",
			price: 85000,
			stock: 130,
		},
	],
};

async function seed() {
	console.log("Seeding database...");

	try {
		// Create categories
		console.log("Creating categories...");
		const categoryIds: Record<string, string> = {};

		for (const cat of CATEGORIES) {
			const id = generateId("cat");
			categoryIds[cat.slug] = id;

			await db.insert(category).values({
				id,
				name: cat.name,
				slug: cat.slug,
				description: cat.description,
				image: cat.image,
			});

			console.log(`  Created category: ${cat.name}`);
		}

		// Create products
		console.log("\nCreating products...");
		let productCount = 0;

		for (const [catSlug, products] of Object.entries(PRODUCTS_BY_CATEGORY)) {
			const categoryId = categoryIds[catSlug];
			const imageKey = catSlug.replace("-", "") as keyof typeof PRODUCT_IMAGES;
			const images = PRODUCT_IMAGES[imageKey] || PRODUCT_IMAGES.electronics;

			for (let i = 0; i < products.length; i++) {
				const prod = products[i];
				if (!prod) continue;

				const id = generateId("prod");
				const slug = slugify(prod.name);

				// Assign 1-2 images per product
				const productImages: string[] = [];
				const firstImage = images[i % images.length];
				if (firstImage) {
					productImages.push(firstImage);
				}
				if (i % 2 === 0) {
					const secondImage = images[(i + 1) % images.length];
					if (secondImage) {
						productImages.push(secondImage);
					}
				}

				await db.insert(product).values({
					id,
					name: prod.name,
					slug,
					description: prod.description,
					price: prod.price,
					stock: prod.stock,
					images: productImages,
					categoryId,
				});

				productCount++;
				console.log(`  Created product: ${prod.name}`);
			}
		}

		console.log("\nSeeding completed!");
		console.log(`  Categories: ${CATEGORIES.length}`);
		console.log(`  Products: ${productCount}`);
	} catch (error) {
		console.error("Error seeding database:", error);
		throw error;
	}
}

// Run seed
seed()
	.then(() => {
		console.log("\nDone!");
		process.exit(0);
	})
	.catch((error) => {
		console.error("Seed failed:", error);
		process.exit(1);
	});
