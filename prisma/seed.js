require('dotenv').config();
const prisma = require('./prismaClient');
const bcrypt = require('bcryptjs');

async function main() {
  const authorFirstName = process.env.INITIAL_AUTHOR_FIRST_NAME;
  const authorLastName = process.env.INITIAL_AUTHOR_LAST_NAME;
  const authorUsername = process.env.INITIAL_AUTHOR_USERNAME;
  const authorEmail = process.env.INITIAL_AUTHOR_EMAIL;
  const authorPassword = process.env.INITIAL_AUTHOR_PASSWORD;

  if (
    !authorFirstName ||
    !authorLastName ||
    !authorUsername ||
    !authorEmail ||
    !authorPassword
  ) {
    throw new Error('Missing environment variables for initial author setup');
  }

  const existingAuthor = await prisma.user.findUnique({
    where: { email: authorEmail },
  });

  if (!existingAuthor) {
    const hashedPassword = await bcrypt.hash(authorPassword, 10);

    await prisma.user.create({
      data: {
        firstName: authorFirstName,
        lastName: authorLastName,
        username: authorUsername,
        email: authorEmail,
        password: hashedPassword,
        role: 'author',
      },
    });

    console.log('Initial author created');
  } else {
    console.log('Author already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
