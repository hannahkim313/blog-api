const prisma = require('../../prisma/prismaClient');
const sendResponse = require('../utils/sendResponse');

const checkArticleOwnership = async (req, res, next) => {
  const articleId = parseInt(req.params.articleId, 10);

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { authorId: true },
  });

  if (!article) {
    sendResponse(res, 404);
  }

  const userId = req.user.id;

  if (article.authorId !== userId) {
    sendResponse(res, 403);
  }

  next();
};

module.exports = checkArticleOwnership;
