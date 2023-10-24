import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

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

UserSchema.methods.serialize = function() {
  const data = this.toJSON();
  delete data.hashedPassword;

  return data;
}

// static methods
UserSchema.statics.findByUsername = function (username) {
  // this는 model을 가리킨다
  return this.findOne({ username });
};

const User = mongoose.model('User', UserSchema);

export { User };
