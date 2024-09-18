const asyncHandler = require('express-async-handler');
const prisma = require('../../prisma/prismaClient');
const sendResponse = require('../utils/sendResponse');
const { handleValidationErrors } = require('../utils/errorHelpers');
const {
  checkCommentOwnership,
  checkArticlePublication,
} = require('../utils/commentUtils');

const commentsGetAll = asyncHandler(async (req, res) => {
  const isArticlePublished = await checkArticlePublication(req);

  if (!isArticlePublished) {
    return sendResponse(res, 403);
  }

  const articleId = parseInt(req.params.articleId, 10);
  const { page = 1, pageSize = 10 } = req.query;

  const comments = await prisma.comment.findMany({
    where: { articleId },
    skip: (page - 1) * pageSize,
    take: parseInt(pageSize, 10),
    select: {
      id: true,
      content: true,
      userId: true,
      user: {
        select: {
          firstName: true,
        },
      },
      article: {
        select: {
          authorId: true,
        },
      },
    },
  });

  const totalComments = await prisma.comment.count({
    where: { articleId },
  });

  sendResponse(res, 200, {
    comments: comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      user: {
        ...comment.user,
        isArticleAuthor: comment.userId === comment.article.authorId,
      },
    })),
    totalPages: Math.ceil(totalComments / pageSize),
    currentPage: parseInt(page, 10),
  });
});

const commentsCreate = asyncHandler(async (req, res) => {
  if (handleValidationErrors(req, res, 400)) {
    return;
  }

  const isArticlePublished = await checkArticlePublication(req);

  if (!isArticlePublished) {
    return sendResponse(res, 403);
  }

  const { content } = req.body;
  const userId = req.user.id;
  const articleId = parseInt(req.params.articleId, 10);

  const newComment = await prisma.comment.create({
    data: {
      content,
      articleId,
      userId,
    },
    include: {
      user: {
        select: {
          firstName: true,
        },
      },
    },
  });

  const role = req.user.role;
  const isAuthor = role === 'author';

  sendResponse(res, 201, {
    comment: {
      id: newComment.id,
      content: newComment.content,
      articleId: newComment.articleId,
      user: {
        firstName: newComment.user.firstName,
        isAuthor,
      },
      createdAt: newComment.createdAt,
    },
  });
});

const commentsUpdateById = asyncHandler(async (req, res) => {
  if (handleValidationErrors(req, res, 400)) {
    return;
  }

  const isArticlePublished = await checkArticlePublication(req);

  if (!isArticlePublished) {
    return sendResponse(res, 403);
  }

  const isCommentAuthor = await checkCommentOwnership(req);

  if (!isCommentAuthor) {
    return sendResponse(res, 403);
  }

  const commentId = parseInt(req.params.commentId, 10);
  const { content } = req.body;

  const updatedComment = await prisma.comment.update({
    where: { id: commentId },
    data: {
      content,
    },
    include: {
      user: {
        select: {
          firstName: true,
        },
      },
    },
  });

  const role = req.user.role;
  const isAuthor = role === 'author';

  sendResponse(res, 201, {
    comment: {
      id: updatedComment.id,
      content: updatedComment.content,
      articleId: updatedComment.articleId,
      user: {
        firstName: updatedComment.user.firstName,
      },
      updatedAt: updatedComment.updatedAt,
      isAuthor,
    },
  });
});

const commentsDeleteById = (req, res) => {
  res.send('not yet implemented');
};

module.exports = {
  commentsGetAll,
  commentsCreate,
  commentsUpdateById,
  commentsDeleteById,
};
