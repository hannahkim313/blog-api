const prisma = require('../../prisma/prismaClient');

const checkArticleExists = async (req) => {
  const articleId = parseInt(req.params.articleId, 10);

  const article = await prisma.article.findUnique({
    where: { id: articleId },
  });

  if (!article) {
    return false;
  }

  return true;
};

module.exports = {
  checkArticleExists,
};
