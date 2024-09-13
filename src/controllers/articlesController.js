const asyncHandler = require('express-async-handler');
const prisma = require('../../prisma/prismaClient');
const sendResponse = require('../utils/sendResponse');
const { handleValidationErrors } = require('../utils/errorHelpers');

const articlesGetAll = asyncHandler(async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;

  const articles = await prisma.article.findMany({
    skip: (page - 1) * pageSize,
    take: parseInt(pageSize),
    select: { id: true, title: true },
  });

  const totalArticles = await prisma.article.count();

  sendResponse(res, 200, {
    articles,
    totalPages: Math.ceil(totalArticles / pageSize),
    currentPage: parseInt(page),
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
  });

  sendResponse(res, 201, {
    articleId: newArticle.id,
  });
});

const articlesGetById = (req, res) => {
  res.send('not yet implemented');
};

const articlesUpdateById = (req, res) => {
  res.send('not yet implemented');
};

const articlesDeleteById = (req, res) => {
  res.send('not yet implemented');
};

module.exports = {
  articlesGetAll,
  articlesCreate,
  articlesGetById,
  articlesUpdateById,
  articlesDeleteById,
};
