// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcrypt";

// const prisma = new PrismaClient();

// async function main() {
//   console.log("🌱 Seeding database...");

//   // Create sample users matching frontend mock data
//   const hashedPassword = await bcrypt.hash("password123", 10);

//   const users = await Promise.all([
//     prisma.user.upsert({
//       where: { email: "alice@example.com" },
//       update: {},
//       create: {
//         email: "alice@example.com",
//         username: "Alice Johnson",
//         password: hashedPassword,
//       },
//     }),
//     prisma.user.upsert({
//       where: { email: "bob@example.com" },
//       update: {},
//       create: {
//         email: "bob@example.com",
//         username: "Bob Smith",
//         password: hashedPassword,
//       },
//     }),
//     prisma.user.upsert({
//       where: { email: "carol@example.com" },
//       update: {},
//       create: {
//         email: "carol@example.com",
//         username: "Carol Davis",
//         password: hashedPassword,
//       },
//     }),
//     prisma.user.upsert({
//       where: { email: "david@example.com" },
//       update: {},
//       create: {
//         email: "david@example.com",
//         username: "David Wilson",
//         password: hashedPassword,
//       },
//     }),
//     prisma.user.upsert({
//       where: { email: "emma@example.com" },
//       update: {},
//       create: {
//         email: "emma@example.com",
//         username: "Emma Thompson",
//         password: hashedPassword,
//       },
//     }),
//   ]);

//   console.log("👥 Created users:", users.length);

//   const roadmapItemsData = [
//     {
//       title: "Dark Mode Support",
//       description:
//         "Add comprehensive dark mode theme across the entire application with system preference detection",
//       status: "IN_PROGRESS",
//       category: "UI_UX",
//       priority: "HIGH",
//     },
//     {
//       title: "Mobile App",
//       description:
//         "Develop native mobile applications for iOS and Android with full feature parity",
//       status: "PLANNED",
//       category: "MOBILE",
//       priority: "HIGH",
//     },
//     {
//       title: "Advanced Analytics",
//       description:
//         "Implement detailed analytics dashboard with custom reports, data visualization, and export capabilities",
//       status: "IN_PROGRESS",
//       category: "FEATURES",
//       priority: "MEDIUM",
//     },
//     {
//       title: "API Rate Limiting",
//       description:
//         "Add intelligent rate limiting to prevent API abuse and ensure fair usage across all endpoints",
//       status: "COMPLETED",
//       category: "SECURITY",
//       priority: "HIGH",
//     },
//     {
//       title: "Team Collaboration",
//       description:
//         "Enable team workspaces with role-based permissions, shared projects, and real-time collaboration",
//       status: "PLANNED",
//       category: "FEATURES",
//       priority: "MEDIUM",
//     },
//     {
//       title: "Advanced Search",
//       description:
//         "Implement full-text search with filters, sorting, and intelligent suggestions",
//       status: "PLANNED",
//       category: "FEATURES",
//       priority: "LOW",
//     },
//     {
//       title: "Two-Factor Authentication",
//       description:
//         "Add 2FA support with TOTP, SMS, and backup codes for enhanced account security",
//       status: "IN_PROGRESS",
//       category: "SECURITY",
//       priority: "HIGH",
//     },
//     {
//       title: "Webhook Integration",
//       description:
//         "Allow users to configure webhooks for real-time notifications and third-party integrations",
//       status: "PLANNED",
//       category: "INTEGRATION",
//       priority: "MEDIUM",
//     },
//   ];

//   // Create roadmap items matching frontend mock data
//   const roadmapItems = await Promise.all(
//     roadmapItemsData.map(async (itemData) => {
//       const existing = await prisma.roadmapItem.findFirst({
//         where: { title: itemData.title },
//       });

//       if (existing) {
//         return prisma.roadmapItem.update({
//           where: { id: existing.id },
//           data: itemData,
//         });
//       } else {
//         return prisma.roadmapItem.create({
//           data: itemData,
//         });
//       }
//     })
//   );

//   console.log("🗺️ Created roadmap items:", roadmapItems.length);

//   // Create sample votes matching frontend expectations
//   const votes = await Promise.all([
//     // Dark Mode Support votes
//     prisma.vote.create({
//       data: {
//         userId: users[0].id,
//         itemId: roadmapItems[0].id,
//       },
//     }),
//     prisma.vote.create({
//       data: {
//         userId: users[1].id,
//         itemId: roadmapItems[0].id,
//       },
//     }),
//     // Mobile App votes
//     prisma.vote.create({
//       data: {
//         userId: users[0].id,
//         itemId: roadmapItems[1].id,
//       },
//     }),
//     prisma.vote.create({
//       data: {
//         userId: users[1].id,
//         itemId: roadmapItems[1].id,
//       },
//     }),
//     prisma.vote.create({
//       data: {
//         userId: users[2].id,
//         itemId: roadmapItems[1].id,
//       },
//     }),
//   ]);

//   console.log("🗳️ Created votes:", votes.length);

//   // Create sample comments matching frontend mock data structure
//   const comments = await Promise.all([
//     // Dark Mode Support comments
//     prisma.comment.create({
//       data: {
//         content:
//           "This would be amazing! Dark mode is essential for late-night coding sessions. Really looking forward to this feature.",
//         userId: users[0].id,
//         itemId: roadmapItems[0].id,
//       },
//     }),
//     prisma.comment.create({
//       data: {
//         content:
//           "Will this include system theme detection? It would be great if it automatically switches based on my OS settings.",
//         userId: users[2].id,
//         itemId: roadmapItems[0].id,
//       },
//     }),
//     // Mobile App comments
//     prisma.comment.create({
//       data: {
//         content:
//           "Mobile app would be a game changer! When can we expect this? Any plans for offline functionality?",
//         userId: users[1].id,
//         itemId: roadmapItems[1].id,
//       },
//     }),
//     prisma.comment.create({
//       data: {
//         content:
//           "This is exactly what we need! Will it have push notifications for important updates?",
//         userId: users[3].id,
//         itemId: roadmapItems[1].id,
//       },
//     }),
//     // Advanced Analytics comment
//     prisma.comment.create({
//       data: {
//         content:
//           "Advanced analytics would help us make better data-driven decisions. Looking forward to the custom reports feature!",
//         userId: users[2].id,
//         itemId: roadmapItems[2].id,
//       },
//     }),
//     // Two-Factor Authentication comment
//     prisma.comment.create({
//       data: {
//         content:
//           "2FA is crucial for security. Will you support authenticator apps like Google Authenticator and Authy?",
//         userId: users[0].id,
//         itemId: roadmapItems[6].id,
//       },
//     }),
//   ]);

//   // Create nested comments (replies)
//   await Promise.all([
//     prisma.comment.create({
//       data: {
//         content:
//           "Totally agree! My eyes would thank you for this feature. Will it include automatic switching based on system preferences?",
//         userId: users[1].id,
//         itemId: roadmapItems[0].id,
//         parentId: comments[0].id,
//       },
//     }),
//     prisma.comment.create({
//       data: {
//         content:
//           "Yes, TOTP support is mentioned in the description. This will definitely improve our account security!",
//         userId: users[4].id,
//         itemId: roadmapItems[6].id,
//         parentId: comments[5].id,
//       },
//     }),
//   ]);

//   // Create a third-level nested comment
//   const secondLevelComment = await prisma.comment.findFirst({
//     where: {
//       parentId: comments[0].id,
//     },
//   });

//   if (secondLevelComment) {
//     await prisma.comment.create({
//       data: {
//         content:
//           "Exactly! It's all about user comfort and accessibility. System preference detection would be perfect.",
//         userId: users[0].id,
//         itemId: roadmapItems[0].id,
//         parentId: secondLevelComment.id,
//       },
//     });
//   }

//   console.log("💬 Created comments with nested replies");

//   console.log("✅ Database seeded successfully!");
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error("❌ Error seeding database:", e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
