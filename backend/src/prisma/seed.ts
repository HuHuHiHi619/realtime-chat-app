import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  console.log("start seeding...");

  const hashedPassword1 = await argon2.hash("password123");
  const hashedPassword2 = await argon2.hash("password123");

  const user1 = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      email: "alice@example.com",
      username: "Alice",
      password: hashedPassword1,
    },
  });
  const user2 = await prisma.user.upsert({
    where: { email: "tom@example.com" },
    update: {},
    create: {
      email: "tom@example.com",
      username: "Tom",
      password: hashedPassword2,
    },
  });
  console.log(`Created users: ${user1.username}, ${user2.username}`);

  const privateChat = await prisma.conversation.create({
    data: {
      type: "PRIVATE",
      name: null, // private ไม่ต้องมีชื่อ
      user_id : user1.id,
      participants: {
        create: [{ user_id: user1.id }, { user_id: user2.id }],
      },
    },
  });
  console.log(
    `Created private conversation between ${user1.username} and ${user2.username}`
  );

  await prisma.message.create({
    data: {
      conversation_id: privateChat.id,
      sender_id: user1.id,
      content: "Hello Tom , how are you?",
      message_type: "TEXT",
    },
  });
  await prisma.message.create({
    data: {
      conversation_id: privateChat.id,
      sender_id: user2.id,
      content: "I am good , Alice! Thanks.",
      message_type: "TEXT",
    },
  });
  console.log("Added initial messages to the conversation.");

  const groupChat = await prisma.conversation.create({
    data: {
      type: "GROUP",
      name: "TEAM DEV",
      user_id : user1.id,
      participants: {
        create: [{ user_id: user1.id }, { user_id: user2.id }],
      },
    },
  });

  console.log(
    `Created group conversation between ${user1.username} and ${user2.username}`
  );

  await prisma.message.create({
    data: {
      conversation_id: groupChat.id,
      sender_id: user1.id,
      content: "Welcome to the Dev Team Chat!",
      message_type: "TEXT",
    },
  });

  console.log("Added initial messages to the conversation.");
}

main()
  .catch((e) => {
    console.error(e);
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })