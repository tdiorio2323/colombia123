import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create sample users with profiles
  const creator = await prisma.user.create({
    data: {
      email: "maria@example.com",
      name: "Maria Rodriguez",
      profile: {
        create: {
          username: "maria_creates",
          displayName: "Maria Rodriguez",
          role: UserRole.CREATOR,
          bio: "Colombian content creator and artist",
          tipEnabled: true,
          subscriptionPrice: 999, // $9.99 in cents
          mediaCount: 0,
          subscriberCount: 0,
          totalEarnings: 0,
          subscriptionCount: 0,
          totalSpent: 0,
        },
      },
    },
    include: { profile: true },
  });

  const fan = await prisma.user.create({
    data: {
      email: "carlos@example.com",
      name: "Carlos Gomez",
      profile: {
        create: {
          username: "carlos_fan",
          displayName: "Carlos",
          role: UserRole.FAN,
          bio: "Supporting amazing creators!",
          tipEnabled: false,
          mediaCount: 0,
          subscriberCount: 0,
          totalEarnings: 0,
          subscriptionCount: 0,
          totalSpent: 0,
        },
      },
    },
    include: { profile: true },
  });

  // Create sample media
  const media = await prisma.media.create({
    data: {
      creatorId: creator.profile!.id,
      title: "Beautiful Colombian Landscape",
      description: "A stunning view of the Colombian mountains",
      mediaUrl: "https://example.com/media/landscape.jpg",
      thumbnailUrl: "https://example.com/media/landscape_thumb.jpg",
      mediaType: "IMAGE",
      isPremium: false,
      viewCount: 0,
      likeCount: 0,
    },
  });

  // Create sample subscription
  const subscription = await prisma.subscription.create({
    data: {
      creatorId: creator.profile!.id,
      subscriberId: fan.id,
      amount: 999, // $9.99 in cents
      isActive: true,
      status: "ACTIVE",
    },
  });

  // Create sample transaction
  const transaction = await prisma.transaction.create({
    data: {
      buyerId: fan.id,
      creatorId: creator.profile!.id,
      type: "TIP",
      amount: 500, // $5.00 in cents
      currency: "usd",
      status: "COMPLETED",
      description: "¡Gracias por tu contenido increíble!",
    },
  });

  // Create sample message
  const message = await prisma.message.create({
    data: {
      senderId: fan.id,
      receiverId: creator.id,
      content: "Hola Maria! Me encanta tu trabajo.",
      isRead: false,
    },
  });

  console.log("✅ Seed data created:");
  console.log(
    "📧 Creator:",
    creator.email,
    "- Profile ID:",
    creator.profile?.id,
  );
  console.log("👤 Fan:", fan.email, "- Profile ID:", fan.profile?.id);
  console.log("🎬 Media:", media.title);
  console.log("💳 Subscription ID:", subscription.id);
  console.log("💰 Transaction ID:", transaction.id);
  console.log("💬 Message ID:", message.id);
  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
