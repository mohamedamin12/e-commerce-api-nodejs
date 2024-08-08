const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const Category = require("../models/category.model");
const ApiError = require("../utils/apiError");
const {
  buildFilter,
  buildSort,
  buildFields,
  buildKeywordSearch,
} = require("../utils/queryUtils");

/**
 *  @desc    create a new category
 *  @route   /api/categories
 *  @method  POST
 *  @access  private
 */
exports.createCategory = asyncHandler(async (req, res) => {
  const {name} = req.body;
  const category = await Category.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});

/**
 *  @desc    get all categories
 *  @route   /api/categories
 *  @method  GET
 *  @access  public
 */
exports.getCategories = asyncHandler(async (req, res) => {
  const { page = 1, limit = 5, sort, fields, keyword, ...filters } = req.query;

  // Build query string
  const queryStr = buildFilter(filters);

  // Pagination
  const skip = (page - 1) * limit;

  let mongooseQuery = Category.find(JSON.parse(queryStr))
    .skip(skip)
    .limit(limit);

  // Sorting
  mongooseQuery = mongooseQuery.sort(buildSort(sort));

  // Field limiting
  mongooseQuery = mongooseQuery.select(buildFields(fields));

  if (keyword) {
    mongooseQuery = mongooseQuery.find(buildKeywordSearch(keyword));
  }

  const category = await mongooseQuery;
  res.json({ results: category.length, page, data: category });
});

/**
 *  @desc    get one category
 *  @route   /api/categories
 *  @method  GET
 *  @access  public
 */
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    return next(new ApiError(`No category for this id ${id}`, 404));
  }
  res.status(200).json({ data: category });
});

/**
 *  @desc    update category
 *  @route   /api/categories
 *  @method  PUT
 *  @access  private
 */
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const updateCategory = await Category.findOneAndUpdate(
    { _id: id },
    {
      name,
      slug: slugify(name),
    },
    { new: true }
  );
  if (!updateCategory) {
    return next(new ApiError(`No category for this id ${id}`, 404));
  }
  res.json({ message: "Category updated successfully", data: updateCategory });
});

/**
 *  @desc    delete category
 *  @route   /api/categories
 *  @method  DELETE
 *  @access  private
 */
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deleteCategory = await Category.findByIdAndDelete(id);
  if (!deleteCategory) {
    return next(new ApiError(`No category for this id ${id}`, 404));
  }
  res.json({ message: "Category deleted successfully" });
});
