const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const Brand = require("../models/brand.model");
const ApiError = require("../utils/apiError");

const {
  buildFilter,
  buildSort,
  buildFields,
  buildKeywordSearch,
} = require("../utils/queryUtils");

/**
 *  @desc    create a new brand
 *  @route   /api/brands
 *  @method  POST
 *  @access  private
 */
exports.createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const brand = await Brand.create({ name, slug: slugify(name) });
  res
    .status(201)
    .json({ message: "Brand created successfully", data: brand });
});

/**
 *  @desc    get all brands
 *  @route   /api/brands
 *  @method  GET
 *  @access  public
 */
exports.getBrands = asyncHandler(async (req, res) => {
  const { page = 1, limit = 5, sort, fields, keyword, ...filters } = req.query;

  // Build query string
  const queryStr = buildFilter(filters);

  // Pagination
  const skip = (page - 1) * limit;

  let mongooseQuery = Brand.find(JSON.parse(queryStr))
    .skip(skip)
    .limit(limit)
    

  // Sorting
  mongooseQuery = mongooseQuery.sort(buildSort(sort));

  // Field limiting
  mongooseQuery = mongooseQuery.select(buildFields(fields));

  if (keyword) {
    mongooseQuery = mongooseQuery.find(buildKeywordSearch(keyword));
  }

  const brands = await mongooseQuery;
  res.json({ results: brands.length, page, data: brands });
});

/**
 *  @desc    get one brand
 *  @route   /api/brand
 *  @method  GET
 *  @access  public
 */
exports.getBrand = asyncHandler(async (req, res , next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id).select("-__v");
  if (!brand) {
    return next(new ApiError(`No Brand for this id ${id}`, 404))
  }
  res.status(200).json({ data: brand });
});

/**
 *  @desc    update brand
 *  @route   /api/brand
 *  @method  PUT
 *  @access  private
 */
exports.updateBrand = asyncHandler(async (req, res , next) => {
  const { id } = req.params;
  const { name } = req.body;
  const updateBrand = await Brand.findOneAndUpdate(
    { _id: id },
    {
      name,
      slug: slugify(name),
    },
    { new: true }
  );
  if (!updateBrand) {
    return next(new ApiError(`No brand for this id ${id}`, 404))
  }
  res.json({ message: "brand updated successfully", data: updateBrand });
});

/**
 *  @desc    delete brand
 *  @route   /api/brand
 *  @method  DELETE
 *  @access  private
 */
exports.deleteBrand = asyncHandler(async (req , res , next)=>{
  const {id} = req.params;
  const deleteBrand = await Brand.findByIdAndDelete(id);
  if (!deleteBrand) {
    return next(new ApiError(`No Brand for this id ${id}`, 404))
  }
  res.json({ message: "Brand deleted successfully" });
})