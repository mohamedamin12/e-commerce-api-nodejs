const router = require('express').Router();

const {
  getCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require('../controllers/coupon.controller');

const authControllers = require('../controllers/auth.controller');



router.use(authControllers.protect, authControllers.allowedTo('admin', 'manager'));

router.route('/').get(getCoupons).post(createCoupon);
router.route('/:id').get(getCoupon).put(updateCoupon).delete(deleteCoupon);

module.exports = router;
