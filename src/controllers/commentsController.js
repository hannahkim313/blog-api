const asyncHandler = require('express-async-handler');
const prisma = require('../../prisma/prismaClient');
const sendResponse = require('../utils/sendResponse');

const commentsGetAll = asyncHandler(async (req, res) => {
  const articleId = parseInt(req.params.articleId, 10);
  const { role } = req.user;
  const isAuthor = role === 'author';

  const article = await prisma.article.findUnique({
    where: {
      id: articleId,
      isPublished: !isAuthor ? true : {},
    },
  });

  if (!article) {
    return sendResponse(res, 404);
  }

  const { page = 1, pageSize = 10 } = req.query;

  const comments = await prisma.comment.findMany({
    skip: (page - 1) * pageSize,
    take: parseInt(pageSize, 10),
    select: {
      id: true,
      content: true,
      user: {
        select: {
          firstName: true,
        },
      },
    },
    where: { articleId: article.id },
  });

  const totalComments = await prisma.comment.count({
    where: { articleId: article.id },
  });

  sendResponse(res, 200, {
    comments,
    totalPages: Math.ceil(totalComments / pageSize),
    currentPage: parseInt(page, 10),
  });
});

const commentsCreate = (req, res) => {
  res.send('not yet implemented');
};

const commentsUpdateById = (req, res) => {
  res.send('not yet implemented');
};

const commentsDeleteById = (req, res) => {
  res.send('not yet implemented');
};

module.exports = {
  commentsGetAll,
  commentsCreate,
  commentsUpdateById,
  commentsDeleteById,
};
