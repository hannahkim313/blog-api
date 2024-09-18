const prisma = require('../../prisma/prismaClient');

const checkArticlePublication = async (req) => {
  const articleId = parseInt(req.params.articleId, 10);

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { isPublished: true },
  });

  if (!article.isPublished) {
    return false;
  }

  return true;
};

const checkCommentOwnership = async (req) => {
  const commentId = parseInt(req.params.commentId, 10);

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { userId: true },
  });

  if (req.user.id !== comment.userId) {
    return false;
  }

  return true;
};

module.exports = {
  checkArticlePublication,
  checkCommentOwnership,
};
