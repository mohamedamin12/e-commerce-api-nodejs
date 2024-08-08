const router = require('express').Router();

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require('../utils/validation/categoryValidator');

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controller');

const authControllers = require('../controllers/auth.controller');

router
  .route('/')
  .get(getCategories)
  .post(
    authControllers.protect,
    authControllers.allowedTo('admin', 'manager'),
    createCategoryValidator,
    createCategory
  );
router
  .route('/:id')
  .get(getCategoryValidator, getCategory)
  .put(
    authControllers.protect,
    authControllers.allowedTo('admin', 'manager'),
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    authControllers.protect,
    authControllers.allowedTo('admin'),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
