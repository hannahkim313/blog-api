const prisma = require('./prismaClient');

const addArticle = async (title, description, content, isPublished, url) => {
  try {
    const newArticle = await prisma.article.create({
      data: {
        title,
        authorId: 1,
        description,
        content,
        isPublished,
        url,
      },
    });

    console.log('Inserted article:', newArticle);
  } catch (error) {
    console.error('Error inserting article:', error);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = addArticle;
