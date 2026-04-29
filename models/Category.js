const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Category title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
      unique: true, // 🔥 duplicate avoid
    },

    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },

    image: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },
    isFree: {
      type: Boolean,
      default: false, // false = paid, true = free
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);


// 🔥 AUTO SLUG GENERATE
categorySchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/[^\w-]+/g, "");
  }

});


module.exports = mongoose.model("Category", categorySchema);