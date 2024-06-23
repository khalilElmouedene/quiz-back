const mongoose = require('mongoose');

const incorrectAnswerSchema = new mongoose.Schema({
  id: Number,
  text: String,
  options: [String],
  correctAnswer: Number,
  userAnswer: Number
});

const userSchema = new mongoose.Schema({
  name: String,
  score: Number,
  currentQuestionIndex: Number,
  answeredQuestions: Number,
  incorrectAnswers: [incorrectAnswerSchema]
});

const User = mongoose.model('User', userSchema);

module.exports = User;