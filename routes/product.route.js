const router = require('express').Router();
const upload = require("../middlewares/photoUpload");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require('../utils/validation/productValidator');

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');

const authControllers = require('../controllers/auth.controller');

const reviewsRoute = require('./review.route');

router.use('/:productId/reviews', reviewsRoute);


router
  .route('/')
  .get(getProducts)
  .post(
    authControllers.protect,
    authControllers.allowedTo('admin', 'manager'),
    upload.array("images", 5),
    createProductValidator,
    createProduct
  );
router
  .route('/:id')
  .get(getProductValidator, getProduct)
  .put(
    authControllers.protect,
    authControllers.allowedTo('admin', 'manager'),
    updateProductValidator,
    updateProduct
  )
  .delete(
    authControllers.protect,
    authControllers.allowedTo('admin'),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;