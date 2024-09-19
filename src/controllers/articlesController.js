const asyncHandler = require('express-async-handler');
const prisma = require('../../prisma/prismaClient');
const sendResponse = require('../utils/sendResponse');
const { handleValidationErrors } = require('../utils/errorHelpers');
const { checkArticleExists } = require('../utils/articleUtils');

const articlesGetAll = asyncHandler(async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const { role } = req.user;
  const isAuthor = role === 'author';

  const articles = await prisma.article.findMany({
    where: !isAuthor ? { isPublished: true } : {},
    skip: (page - 1) * pageSize,
    take: parseInt(pageSize, 10),
    select: {
      id: true,
      title: true,
      content: true,
      isPublished: isAuthor,
      author: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  const totalArticles = await prisma.article.count({
    where: !isAuthor ? { isPublished: true } : {},
  });

  sendResponse(res, 200, {
    articles,
    totalPages: Math.ceil(totalArticles / pageSize),
    currentPage: parseInt(page, 10),
  });
});

const articlesCreate = asyncHandler(async (req, res) => {
  if (handleValidationErrors(req, res, 400)) {
    return;
  }

  const { title, content, isPublished } = req.body;

  const newArticle = await prisma.article.create({
    data: {
      title,
      content,
      authorId: req.user.id,
      isPublished,
    },
    include: {
      author: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  sendResponse(res, 201, {
    article: {
      id: newArticle.id,
      title: newArticle.title,
      content: newArticle.content,
      isPublished: newArticle.isPublished,
      author: {
        firstName: newArticle.author.firstName,
        lastName: newArticle.author.lastName,
      },
    },
  });
});

const articlesGetById = asyncHandler(async (req, res) => {
  if (handleValidationErrors(req, res, 400)) {
    return;
  }

  const articleExists = await checkArticleExists(req);

  if (!articleExists) {
    return sendResponse(res, 404);
  }

  const articleId = parseInt(req.params.articleId, 10);
  const { role } = req.user;
  const isAuthor = role === 'author';

  const article = await prisma.article.findUnique({
    where: !req.isArticleAuthor
      ? { id: articleId, isPublished: true }
      : { id: articleId },
    select: {
      id: true,
      title: true,
      content: true,
      isPublished: isAuthor,
      author: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  if (!article) {
    return sendResponse(res, 404);
  }

  sendResponse(res, 200, { article });
});

const articlesUpdateById = asyncHandler(async (req, res) => {
  if (handleValidationErrors(req, res, 400)) {
    return;
  }

  const articleExists = await checkArticleExists(req);

  if (!articleExists) {
    return sendResponse(res, 404);
  }

  if (!req.isArticleAuthor) {
    return sendResponse(res, 403);
  }

  const articleId = parseInt(req.params.articleId, 10);

  const updatedArticle = await prisma.article.update({
    where: { id: articleId },
    data: { ...req.body },
  });

  sendResponse(res, 200, {
    article: {
      id: updatedArticle.id,
      title: updatedArticle.title,
      content: updatedArticle.content,
      isPublished: updatedArticle.isPublished,
    },
  });
});

const articlesDeleteById = asyncHandler(async (req, res) => {
  if (handleValidationErrors(req, res, 400)) {
    return;
  }

  const articleExists = await checkArticleExists(req);

  if (!articleExists) {
    return sendResponse(res, 404);
  }

  if (!req.isArticleAuthor) {
    return sendResponse(res, 403);
  }

  const articleId = parseInt(req.params.articleId, 10);

  await prisma.article.delete({
    where: { id: articleId },
  });

  sendResponse(res, 204);
});

module.exports = {
  articlesGetAll,
  articlesCreate,
  articlesGetById,
  articlesUpdateById,
  articlesDeleteById,
};
