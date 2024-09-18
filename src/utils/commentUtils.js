const prisma = require('../../prisma/prismaClient');

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
  checkCommentOwnership,
};
