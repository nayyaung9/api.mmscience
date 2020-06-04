var QuizComment = require("../models/QuizComment");
var Quiz = require("../models/Quiz");

exports.fetchQuizCommentsByQuizId = async (req, res) => {
  const { quizId } = req.params;
  console.log('qqqq', quizId);
  const quizComments = await QuizComment.find({ article_id: quizId })
    .select("-_id -__v")
    .populate("user", "-__v")
    .sort([["_id", -1]]);
  return res.status(200).json({ success: true, data: quizComments });
};

exports.createQuizComment = async (req, res) => {
  const { content, user, article_id } = req.body;

  try {
    let quizComment = new QuizComment({
      content,
      user,
      unique: Math.random()
        .toString(36)
        .substring(7),
      article_id
    });
    await quizComment.save();
    return res.status(200).json({ success: true, data: quizComment });
  } catch (err) {
    if (err.name === "MongoError" && err.code === 11000) {
      return res
        .status(500)
        .send("There is a problem while sending a quiz comment");
    }
    return res.status(500).send(err.message);
  }
};
