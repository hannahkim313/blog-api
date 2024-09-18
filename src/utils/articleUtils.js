const prisma = require('../../prisma/prismaClient');
const sendResponse = require('./sendResponse');

const checkArticleOwnership = async (req, res) => {
  const articleId = parseInt(req.params.articleId, 10);

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { authorId: true },
  });

  if (!article) {
    sendResponse(res, 404);

    return false;
  }

  const userId = req.user.id;

  if (article.authorId !== userId) {
    sendResponse(res, 403);

    return false;
  }

  return true;
};

module.exports = {
  checkArticleOwnership,
};
