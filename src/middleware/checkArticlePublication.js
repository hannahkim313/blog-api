const prisma = require('../../prisma/prismaClient');
const sendResponse = require('../utils/sendResponse');

const checkArticlePublication = async (req, res, next) => {
  const articleId = parseInt(req.params.articleId, 10);

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { isPublished: true },
  });

  if (!article.isPublished) {
    return sendResponse(res, 403);
  }

  next();
};

module.exports = checkArticlePublication;
