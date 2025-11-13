import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const adjectives = [
  "Elegant",
  "Compact",
  "Durable",
  "Wireless",
  "Modern",
  "Smart",
  "Advanced",
  "Portable",
  "Eco",
  "Classic",
  "Stylish",
  "Premium",
  "Budget",
  "High-End",
];

const items = [
  "Headphones",
  "Keyboard",
  "Mouse",
  "Laptop",
  "Monitor",
  "Camera",
  "Watch",
  "Phone Case",
  "Charger",
  "Speaker",
  "Backpack",
  "Tablet",
  "Microphone",
  "Tripod",
  "Light",
  "Router",
  "SSD",
  "USB Drive",
  "Drone",
  "Smart Glasses",
];

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPrice() {
  return Number((Math.random() * 200 + 10).toFixed(2)); // €10–€210
}

function randomImage(id: number) {
  // Use picsum.photos for placeholder images
  return `https://picsum.photos/seed/${id}/400/300`;
}

async function main() {
  console.log("🧹 Clearing old products...");
  await prisma.product.deleteMany();

  console.log("🧹 Seeding 200 products...");
  const products = Array.from({ length: 200 }, (_, i) => ({
    name: `${randomChoice(adjectives)} ${randomChoice(items)}`,
    description: `This ${randomChoice(adjectives).toLowerCase()} ${randomChoice(
      items
    ).toLowerCase()} offers great performance and design.`,
    price: randomPrice(),
    image: randomImage(i + 1),
  }));

  await prisma.product.createMany({ data: products });

  console.log("✅ Done seeding 200 products!");
}

main()
  .catch((err) => {
    console.error("❌ Error seeding:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });