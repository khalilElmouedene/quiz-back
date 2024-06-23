const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');






const port = process.env.PORT || 3000;

const SECRET_KEY = 'app_quiz123!!';

app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
  origin: '//https://quiz-4eda1.web.app', //https://quiz-4eda1.web.app
  credentials: true
}));




const uri = "mongodb+srv://khalilreali84:v1Ub8vijMFuTXm0D@cluster0.qrf3e93.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db("quiz_db");
}

async function getUsers() {
    const db = await connectToDatabase();
    const collection = db.collection('quiz');
    return collection.find({}).toArray();
}

async function getQuestions() {
  const db = await connectToDatabase();
  const collection = db.collection('questions');
  return collection.find({}).toArray();
}

async function findUserByName(name) {
    const db = await connectToDatabase();
    const collection = db.collection('quiz');
    return collection.findOne({ name });
}

async function saveUser(user) {
    const db = await connectToDatabase();
    const collection = db.collection('quiz');
    return collection.updateOne(
        { name: user.name },
        { $set: user },
        { upsert: true }
    );
}

app.post('/api/login', async (req, res) => {
    const { name } = req.body;
    if (name && name.trim()) {
        let user = await findUserByName(name.trim());
        if (!user) {
            user = { name: name.trim(), score: 0, currentQuestionIndex: 0, answeredQuestions: 0, incorrectAnswers: [] };
            await saveUser(user);
        }

        const token = jwt.sign(
            { name: name.trim() },
            SECRET_KEY,
            { expiresIn: '1h' } // Token expires in 1 hour
        );
        res.json({ success: true, message: 'Logged in successfully', token });
    } else {
        res.status(400).json({ success: false, message: 'Name is required' });
    }
});

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Access token is missing or invalid' });
    }
    const tokenString = token.split(' ')[1]; // Extract the token string after 'Bearer '

    jwt.verify(tokenString, SECRET_KEY, (err, user) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.status(403).json({ success: false, message: 'Token is not valid' });
        }
        req.user = user;
        next();
    });
};

app.post('/api/submit', authenticateJWT, async (req, res) => {
  const { answer } = req.body;
  const user = await findUserByName(req.user.name);

  if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
  }

  const questions = await getQuestions(); // Fetch questions from MongoDB
  const currentQuestion = questions[user.currentQuestionIndex];
  const correctAnswer = currentQuestion.correctAnswer;

  if (answer === correctAnswer) {
      user.score += 1;
  } else {
      // Store incorrect answer details
      const incorrectAnswer = {
          id: currentQuestion.id,
          text: currentQuestion.text,
          options: currentQuestion.options,
          correctAnswer: currentQuestion.correctAnswer,
          userAnswer: answer
      };

      if (!user.incorrectAnswers) {
          user.incorrectAnswers = [];
      }
      user.incorrectAnswers.push(incorrectAnswer);
  }

  user.currentQuestionIndex += 1;
  user.answeredQuestions += 1;

  await saveUser(user);

  if (user.currentQuestionIndex >= questions.length) {
      return res.status(200).json({ success: true, message: 'Quiz completed', score: user.score });
  }

  res.status(200).json({ success: true });
});


app.get('/api/quiz-results', async (req, res) => {
    const users = await getUsers();
    res.json(users);
});

app.get('/api/question', authenticateJWT, async (req, res) => {
  const user = await findUserByName(req.user.name);

  if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
  }

  const questions = await getQuestions(); // Fetch questions from MongoDB

  if (user.currentQuestionIndex >= questions.length) {
      return res.status(200).json({ success: true, message: 'Quiz completed', quizOver: true, score: user.score });
  }

  const currentQuestion = questions[user.currentQuestionIndex];
  res.status(200).json({ ...currentQuestion, totalQuestions: questions.length, quizOver: false, score: user.score });
});
app.post('/api/saveScore', authenticateJWT, async (req, res) => {
    const { score } = req.body;
    const user = await findUserByName(req.user.name);

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.score = score;
    await saveUser(user);

    res.status(200).json({ success: true, message: 'Score saved successfully' });
});



app.listen(port, () => console.log(`Listning on port ${port}`));