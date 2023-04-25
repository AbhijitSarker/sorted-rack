const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    cpu: {
      type: String,
      trim: true,
      default: null,
    },
    ram: {
      type: String,
      trim: true,
    },
    storageCapacity: {
      type: String,
      trim: true,
    },
    macAddress: {
      type: String,
      trim: true,
    },
    os: {
      type: String,
      trim: true,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    systemName: {
      type: String,
      trim: true,
    },
    antivirusStatus: {
      type: Boolean,
      trim: true,
      default: true,
    },
    productType: {
      type: String,
      trim: true,
    },
    storageType : {
      type: String,
      trim: true,
    },
    serialNumber  : {
      type: String,
      trim: true,
    },


    branch: {
      type: String,
      required: [true, "please provide a branch name"],
      enum: ["Goa", "Dhaka", "Sylhet"],
      default: "Goa",
    },
    brand:{
      type: String,
      trim: true,
    },
    model: {
      type: String,
      trim: true,
    },
    dop: {
      type: String,
      default: Date,
    },
    warrantyPeriod: {
      type: String,
      trim: true,
    },
    tag: {
      type: String,
      required: true,
      enum: {
        values: ["assigned", "notassigned"],
        message: "{VALUE} not supported",
      },
      default: "notassigned",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);



    
    // productCategory: {
    //   type: String,
    //   trim: true,
    //   required:true,
    // },
    // productType: {
    //   type: String,
    //   trim: true,
    //   required:true,
    // },
    // systemModel: {
    //   type: String,
    //   trim: true,
    // },
    // systemBrand:{
    //   type: String,
    //   trim: true,
    // },
    // storageType: {
    //   type: String,
    //   trim: true,
    // },
    // productKey: {
    //   type: String,
    //   trim: true,
    // },
    // serialNumber: {
    //   type: String,
    //   trim: true,
    // },
    // accessoriesName: {
    //   type: String,
    //   trim: true,
    // },
    // networkDeviceName: {
    //   type: String,
    //   trim: true,
    // },
    // createdBy: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },