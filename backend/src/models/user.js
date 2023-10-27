import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = new Schema({
  username: String,
  hashedPassword: String,
});

// instance methods
UserSchema.methods.setPassword = async function (password) {
  const hash = await bcrypt.hash(password, 10);
  // instance를 가리킨다
  this.hashedPassword = hash;
};

UserSchema.methods.checkPassword = async function (password) {
  return bcrypt.compare(password, this.hashedPassword);
};

UserSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedPassword;

  return data;
};

UserSchema.methods.generateToken = function () {
  const token = jwt.sign(
    {
      _id: this.id,
      username: this.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    },
  );

  return token;
};

// static methods
UserSchema.statics.findByUsername = function (username) {
  // this는 model을 가리킨다
  return this.findOne({ username });
};

const User = mongoose.model('User', UserSchema);

export { User };
