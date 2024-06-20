# MERNESHOP2023

## MongoDB là gì?

## MongoDB có khả năng xử lý dữ liệu lớn như thế nào so với các hệ thống quản lý cơ sở dữ liệu khác?

## MongoDB hỗ trợ những tính năng nổi bật nào giúp người dùng quản lý dữ liệu một cách hiệu quả?

## Làm thế nào để kết nối và thao tác với cơ sở dữ liệu MongoDB từ ứng dụng?

## Các thông số kết nối?

## Làm thế nào để cấu trúc được schema của MongoDB cho ứng dụng của chúng ta thực sự hiệu quả và có thể lưu được dữ liệu lớn?

- Câu trả lời nằm ở việc chúng ta cần phải hiểu rõ về dữ liệu của mình,dự án của mình, hiểu rõ về cách mà dữ liệu của mình sẽ được truy cập và sử dụng, hiểu rõ về cách mà dữ liệu của mình sẽ được cập nhật và xóa, hiểu rõ về cách mà dữ liệu của mình sẽ được tìm kiếm và sắp xếp.

- Một cái quan trọng nữa là việc CSDL của chúng ta đọc nhiều hơn ghi hay ghi nhiều hơn đọc :IoT(ghi nhiều hơn: mỗi tháng đọc 1 lần nhưng ghi mỗi giây), đọc ghi đồng thời hay phân tán (push vs pull).

- Dự đoán được hướng phát triển của DB của chúng ta trong tương lai, dự đoán được số lượng người dùng, số lượng dữ liệu, số lượng truy cập, số lượng cập nhật, số lượng xóa, số lượng tìm kiếm, số lượng sắp xếp.

## So sánh các thuật ngữ trong mysql và mongodb

## Relationships in MongoDB

- Embedded là việc chúng ta nhúng 1 tài liệu vào 1 tài liệu khác, ưu điểm lad select 1 lần ra tất cả (Dữ liệu truy vấn sẽ bị chậm khi dữ liệu lớn).

- Reference là việc chúng ta lưu 1 ObjectId của 1 tài liệu vào 1 tài liệu khác, ưu điểm là update 1 lần cho nhiều tài liệu.

## One-to-One Relationships

VD: user có đang ngồi làm việc cho 1 công ty duy nhất

```js
// 1.Embedding
const user = {
  id: ObjectId("user_1"),
  name: "John Doe",
  company: {
    name: "ABC Company",
    address: "123 Main St",
    city: "Springfield",
    state: "IL",
    zip: "62701",
  },
};

// 2.Reference
const user = {
  id: ObjectId("user_1"),
  name: "John Doe",
  company: ObjectId("company"),
};

const company = {
  id: ObjectId("company"),
  name: "ABC Company",
  address: "123 Main St",
  city: "Springfield",
  state: "IL",
  zip: "62701",
};
```

## One-to-Few Relationships

VD: user có thể có nhiều địa chỉ

```js
// 1.Embedding
const user = {
  id: ObjectId("5f43f3f3f3f3f3f3f3f3f3"),
  name: "John Doe",
  addresses: [
    {
      street: "123 Main St",
      city: "Springfield",
      state: "IL",
      zip: "62701",
    },
    {
      street: "456 Elm St",
      city: "Springfield",
      state: "IL",
      zip: "62701",
    },
  ],
};

// 2.Reference
const user = {
  id: ObjectId("5f43f3f3f3f3f3f3f3f3f3"),
  name: "John Doe",
  addresses: [
    ObjectId("5f43f3f3f3f3f3f3f3f3f4"),
    ObjectId("5f43f3f3f3f3f3f3f3f3f5"),
  ],
};

const user = {
  id: ObjectId("5f43f3f3f3f3f3f3f3f3f3"),
  name: "John Doe",
};

const address1 = {
  id: ObjectId("5f43f3f3f3f3f3f3f3f3f4"),
  street: "123 Main St",
  city: "Springfield",
  state: "IL",
  zip: "62701",
  user: ObjectId("5f43f3f3f3f3f3f3f3f3f3"),
};

const address2 = {
  id: ObjectId("5f43f3f3f3f3f3f3f3f3f4"),
  street: "123 Main St",
  city: "Springfield",
  state: "IL",
  zip: "62701",
  user: ObjectId("5f43f3f3f3f3f3f3f3f3f3"),
};
```

Nhược điểm : Document không thể lớn quá 16MB, hiệu suất thêm sửa xóa cực kì chậm, phân trang kém(không thể lấy hết ra sau đó skip) ==> KHÔNG NÊN (phù hợp với sinh viên)

Nhược điểm : Phải tốn nhiều truy vấn hơn, nếu có 100000 document thì việc phân trang nó cũng không hiệu quả(cam đoan với ae trong code đang dùng skip, limit), vì nó cũng sẽ request hết 100000 document về rồi mới phân trang kể cả việc mình có đánh index

HANDLE : Bucket Pattern (Chia nhỏ dữ liệu ra để tránh việc lấy hết ra sau đó skip) ,chúng ta sẽ chia nhỏ dữ liệu ra thành các nhóm nhỏ, mỗi nhóm sẽ chứa 1 số lượng dữ liệu nhất định, khi cần phân trang chúng ta sẽ lấy ra nhóm đó và phân trang trong nhóm đó

## Bucket Pattern là gì?

## One-to-Huge Relationships

Cái này sẽ không nhúng thằng con vaofo thắng cha mà sẽ nhúng thằng cha vào thằng con

```js
const host = {
  id:ObjectId("5f43f3f3f3f3f3f3f3f3f3"),
  logs:[
    {
      id:ObjectId("5f43f3f3f3f3f3f3f3f3f4"),
      message : "System is running low on memory",
      timestamp : "2020-08-24T12:34:56.789Z"
    },
    {
      id:ObjectId("5f43f3f3f3f3f3f3f3f3f5"),
      message : "System is running low on disk space",
      timestamp : "2020-08-24T12:34:56.789Z"
    }
    ....
  ]
}


const host = {
  id:ObjectId("5f43f3f3f3f3f3f3f3f3f3"),
  logs:[
    ObjectId("5f43f3f3f3f3f3f3f3f3f4"),
    ObjectId("5f43f3f3f3f3f3f3f3f3f5")
  ]
}
```

Ví dụ 1 host có nhiều log, chúng ta không thể làm ntn đc vì khi dữ liệu nhiều thì document sẽ lớn và chậm và nó có thể đạt kích thước 16MB

Chúng ta sẽ làm như thế này:

```js
const host = {
  id: ObjectId("5f43f3f3f3f3f3f3f3f3f3"),
};

const log1 = {
  id: ObjectId("5f43f3f3f3f3f3f3f3f3f3"),
  hostId: ObjectId("5f43f3f3f3f3f3f3f3f3f3"),
};

const log2 = {
  id: ObjectId("5f43f3f3f3f3f3f3f3f3f3"),
  hostId: ObjectId("5f43f3f3f3f3f3f3f3f3f3"),
};

const log3 = {
  id: ObjectId("5f43f3f3f3f3f3f3f3f3f3"),
  hostId: ObjectId("5f43f3f3f3f3f3f3f3f3f3"),
};
```

## Many-to-Many Relationships

VD: 1 user có nhiều task và 1 task có nhiều user

```js
const user = {
  id: ObjectId("5f43f3f3f3f3f3f3f3f3f3"),
  name: "John Doe",
  tasks: [
    {
      id: ObjectId("5f43f3f3f3f3f3f3f3f3f4"),
      name: "Task 1",
    },
    {
      id: ObjectId("5f43f3f3f3f3f3f3f3f3f5"),
      name: "Task 2",
    },
  ],
};

const task = {
  id: ObjectId("5f43f3f3f3f3f3f3f3f3f3"),
  name: "Task 1",
  users: [
    ObjectId("5f43f3f3f3f3f3f3f3f3f4"),
    ObjectId("5f43f3f3f3f3f3f3f3f3f5"),
  ],
};
```

## Các mô hình triển khai MongoDB

# Các Mô Hình Triển Khai MongoDB

## 1. Standalone

Chỉ có 1 máy chủ duy nhất, hoặc 1 server duy nhất được cài MongoDB, tất cả ứng dụng của chúng ta đọc ghi đều trên 1 cơ sở dữ liệu duy nhất.

- **Ưu điểm**:
  - Dễ cài đặt, triển khai chỉ với một vài câu lệnh.
- **Nhược điểm**:
  - Không có khả năng mở rộng.
  - Không có khả năng chịu lỗi.
  - Không có khả năng backup (Liên quan đến tính sẵn sàng - Downtime là cook).
  - Yêu cầu phải có một server mạnh mẽ, cần phải biết tối ưu hiệu năng.

## 2. Replica Set

Một tập hợp các máy chủ, mỗi máy chủ sẽ chứa một bản sao của dữ liệu (Mỗi máy chủ cài một MongoDB). Một máy chủ sẽ là primary (chịu trách nhiệm đọc ghi), các máy chủ còn lại sẽ là secondary (update dữ liệu từ primary). Khi primary bị lỗi thì một secondary sẽ được chọn làm primary.

- **Ưu điểm**:
  - Có khả năng mở rộng.
  - Có khả năng chịu lỗi.
  - Có khả năng backup.
  - Ứng dụng của chúng ta sẽ không bị gián đoạn.
- **Nhược điểm**:
  - Khó cài đặt, triển khai, cần phải cấu hình nhiều.
  - Khó mở rộng theo chiều ngang. Nếu mở rộng theo chiều dọc thì cần phải thêm RAM, CPU.

## 3. Sharded Cluster

Một tập hợp các replica set, mỗi replica set sẽ chứa một bản sao của dữ liệu, mỗi replica set sẽ chứa một phần dữ liệu. Một máy chủ sẽ là router, router sẽ chịu trách nhiệm phân phối dữ liệu cho các replica set.

- **Ưu điểm**:
  - Có khả năng mở rộng.
  - Có khả năng chịu lỗi.
  - Có khả năng backup.
  - Có khả năng mở rộng theo chiều ngang.
  - Trong quá trình phát triển nếu gặp các vấn đề về hiệu năng có thể thêm các máy chủ.
- **Nhược điểm**:
  - Khó cài đặt, triển khai, cần phải cấu hình rất nhiều.

## Triển khai

- 1.On-premise(Standalone): Cài đặt trên máy chủ của chúng ta, tải mongo compas, tải mongo shell, cài đặt mongo server
- 2.Cloud: Có thể sử dụng các dịch vụ của các công ty lớn như AWS, Azure, Google Cloud, IBM Cloud, Digital Ocean, Linode, Vultr, Heroku, Firebase, MongoDB Atlas.MongoDB Atlas cung cấp sẵn cho chúng ta 1 con DB trên Cloud(512MB), mô hình Replica Set 1 chính 2 phụ

## Design Pattern

- 12 DESIGN PATTERN: Chúng ta chỉ cần nắm rõ khi nào sử dụng cái nào thôi

## Các vấn đề về hiệu năng

## Indexing

## Các vấn đề về bảo mật

## Ví du

1.Tạo 1 Schema

```js
const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
```

```js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: "Tour",
    required: [true, "Booking must belong to a Tour!"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Booking must belong to a User!"],
  },
  price: {
    type: Number,
    require: [true, "Booking must have a price."],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "tour",
    select: "name",
  });
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
```

FACTORY CRUD

```js
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
```

Sử dụng

```js
exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
```
