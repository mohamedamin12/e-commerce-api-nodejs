/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const fs = require("fs");
const {
  buildFilter,
  buildSort,
  buildFields,
  buildKeywordSearch,
} = require("../utils/queryUtils");
const Product = require("../models/product.model");
const ApiError = require("../utils/apiError");
const { cloudinaryUploadImage } = require("../utils/cloudinary");

/**
 *  @desc    create a new product
 *  @route   /api/products
 *  @method  POST
 *  @access  private (only admin and manager)
 */
exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const uploadedImages = [];

  for (const file of req.files) {
    const upload = await cloudinaryUploadImage(file.path);
    uploadedImages.push({
      url: upload.secure_url,
      publicId: upload.public_id,
    });
  }

  req.body.images = uploadedImages;

  const product = await Product.create(req.body);
  res
    .status(201)
    .json({ message: "product created successfully", data: product });
  req.files.forEach((file) => fs.unlinkSync(file.path));
});

/**
 *  @desc    get all products
 *  @route   /api/products
 *  @method  POST
 *  @access  public 
 */
exports.getProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 5, sort, fields, keyword, ...filters } = req.query;

  // Build query string
  const queryStr = buildFilter(filters);

  // Pagination
  const skip = (page - 1) * limit;

  let mongooseQuery = Product.find(JSON.parse(queryStr))
    .skip(skip)
    .limit(limit);

  // Sorting
  mongooseQuery = mongooseQuery.sort(buildSort(sort));

  // Field limiting
  mongooseQuery = mongooseQuery.select(buildFields(fields));

  if (keyword) {
    mongooseQuery = mongooseQuery.find(buildKeywordSearch(keyword));
  }

  const products = await mongooseQuery;
  res.json({ results: products.length, page, data: products });
});

/**
 *  @desc    get one product
 *  @route   /api/products/:id
 *  @method  GET
 *  @access  public
 */
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  
  const product = await Product.findById(id).populate({
    path: "reviews",
    select: "title ratings -_id -product",
  });

  if (!product) {
    return next(new ApiError(`No product for this id ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

/**
 *  @desc    update product
 *  @route   /api/categories
 *  @method  PUT
 *  @access  private (only admin and manager)
 */
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updateProduct = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!updateProduct) {
    return next(new ApiError(`No product for this id ${id}`, 404));
  }
  res.json({ message: "Product updated successfully", data: updateProduct });
});

/**
 *  @desc    delete Product
 *  @route   /api/products
 *  @method  DELETE
 *  @access  private (only admin)
 */
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deleteProduct = await Product.findByIdAndDelete(id);
  if (!deleteProduct) {
    return next(new ApiError(`No product for this id ${id}`, 404));
  }
  res.json({ message: "Product deleted successfully" });
});
