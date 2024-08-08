const router = require('express').Router();
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require('../utils/validation/brandValidator');

const authControllers = require('../controllers/auth.controller');

const {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} = require('../controllers/brand.controller');


router
  .route('/')
  .get(getBrands)
  .post(
    authControllers.protect,
    authControllers.allowedTo('admin', 'manager'),
    createBrandValidator,
    createBrand
  );
router
  .route('/:id')
  .get(getBrandValidator, getBrand)
  .put(
    authControllers.protect,
    authControllers.allowedTo('admin', 'manager'),
    updateBrandValidator,
    updateBrand
  )
  .delete(
    authControllers.protect,
    authControllers.allowedTo('admin'),
    deleteBrandValidator,
    deleteBrand
  );

module.exports = router;
