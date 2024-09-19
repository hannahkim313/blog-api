const prisma = require('../../prisma/prismaClient');

const checkArticleOwnership = async (req, res, next) => {
  const articleId = parseInt(req.params.articleId, 10);

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { authorId: true },
  });

  req.isArticleAuthor = article.authorId === req.user.id;
  next();
};

module.exports = checkArticleOwnership;
