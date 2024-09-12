const asyncHandler = require('express-async-handler');
const prisma = require('../../prisma/prismaClient');
const sendResponse = require('../utils/sendResponse');

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

const articlesCreate = (req, res) => {
  res.send('not yet implemented');
};

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
