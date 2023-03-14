const Product = require("../models/product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createProduct = async (req, res) => {
  req.body.createdBy = req.user.userId;
  if (req.user.role === "admin") {
    req.body.branch = req.user.branch;
  }
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProduct = async (req, res) => {
  const { branch, productCategory, productType, systemName, systemModel, systemBrand, cpu, ram, storageType, storageCapacity, os, macAddress, ipAddress, tag } = req.query; // for future search query
  const queryObject = {};

  if (req.user.role === "admin") {
    queryObject["branch"] = req.user.branch;
  } else if (req.user.role === "superadmin") {
    if (branch) {
      queryObject["branch"] = branch;
    }
  }

  if (productCategory) {
    queryObject["productCategory"] = productCategory;
  }

  if (productType) {
    queryObject["productType"] = productType;
  }

  if (systemName) {
    queryObject.systemName = { $regex: systemName, $options: 'i' };
  }

  if (systemModel) {
    queryObject.systemModel = { $regex: systemModel, $options: 'i' };
  }

  if (systemBrand) {
    queryObject.systemBrand = { $regex: systemBrand, $options: 'i' };
  }

  if (cpu) {
    queryObject.cpu = { $regex: cpu, $options: 'i' };
  }

  if (ram) {
    queryObject.ram = { $regex: ram, $options: 'i' };
  }

  if (storageType) {
    queryObject.storageType = { $regex: storageType, $options: 'i' };
  }

  if (storageCapacity) {
    queryObject.storageCapacity = { $regex: storageCapacity, $options: 'i' };
  }

  if (os) {
    queryObject.os = { $regex: os, $options: 'i' };
  }

  if (macAddress) {
    queryObject.macAddress = { $regex: macAddress, $options: 'i' };
  }

  if (ipAddress) {
    queryObject.ipAddress = { $regex: ipAddress, $options: 'i' };
  }

  if (tag) {
    queryObject["tag"] = tag;
  }
  // console.log('queryObject', queryObject);
  // res.status(StatusCodes.OK).send('ok');
  // return;

  const count = await Product.aggregate([
    { $match: queryObject },
    { $count: "total" }
  ]);

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const productList = await Product.find(queryObject)
    .skip(skip)
    .limit(limit)
    .lean();

  const total = count.length ? count[0].total : 0;

  res.status(StatusCodes.OK).json({ products: productList, nbhits: total });
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new CustomError.NotFoundError(`no product found with ${productId}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  })

  if (!product) {
    throw new CustomError.NotFoundError(`No product found with ${productId}`)
  }

  res.status(StatusCodes.OK).json({ product })
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId })

  if (!product) {
    throw new CustomError.NotFoundError(`No product found with ${productId}`)
  }

  await product.remove();
  res.status(StatusCodes.OK).json({ msg: 'Product removed sucessfully' })
};

const deleteAllProduct = async (req, res) => {
  await Product.deleteMany({});
  res.status(StatusCodes.OK).json({ msg: 'All products Deleated' })
};

module.exports = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  deleteAllProduct,
};
