const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const fs = require('fs');
const { MongoClient } = require('mongodb');

const questions = [
  { id: 1, text: "What is C#?", options: ["A database", "A programming language", "An operating system", "A web browser"], correctAnswer: 1 },
  { id: 2, text: "Which of the following keywords is used to define a constant in C#?", options: ["final", "const", "static", "let"], correctAnswer: 1 },
  { id: 3, text: "Which of the following is NOT a valid data type in C#?", options: ["int", "string", "boolean", "float-point"], correctAnswer: 3 },
  { id: 4, text: "What does the 'using' statement do in C#?", options: ["Defines a namespace alias", "Includes a file", "Declares a constant", "Starts a loop"], correctAnswer: 0 },
  { id: 5, text: "What is the default access modifier for members of a class in C#?", options: ["private", "public", "protected", "internal"], correctAnswer: 0 },
  { id: 6, text: "Which of the following is used to handle exceptions in C#?", options: ["try-catch", "if-else", "switch-case", "while loop"], correctAnswer: 0 },
  { id: 7, text: "How do you declare an integer variable in C#?", options: ["integer x;", "int x;", "x as Integer;", "Dim x As Integer;"], correctAnswer: 1 },
  { id: 8, text: "What is the output of the following code?\n\n```\nint x = 5;\nint y = 10;\nConsole.WriteLine(x + y);\n```", options: ["15", "10", "5", "Error"], correctAnswer: 0 },
  { id: 9, text: "Which of the following is used to iterate over elements of an array in C#?", options: ["for loop", "while loop", "do-while loop", "all of the above"], correctAnswer: 3 },
  { id: 10, text: "What does 'LINQ' stand for in C#?", options: ["Language Integrated Query", "LINQ Is Not a Query", "Linked Queries", "Large Integrated Query"], correctAnswer: 0 },
  { id: 11, text: "Which keyword is used to define a method that belongs to the class rather than to an instance of the class in C#?", options: ["this", "static", "virtual", "abstract"], correctAnswer: 1 },
  { id: 12, text: "In C#, which keyword is used to implement method overriding?", options: ["override", "overload", "base", "extend"], correctAnswer: 0 },
  { id: 13, text: "What is the purpose of 'sealed' keyword in C#?", options: ["To prevent method overriding", "To prevent inheritance", "To prevent method overloading", "To prevent access to class members"], correctAnswer: 1 },
  { id: 14, text: "Which operator is used to perform a type cast in C#?", options: ["as", "is", "cast", "typeOf"], correctAnswer: 0 },
  { id: 15, text: "What is the default value of an uninitialized integer variable in C#?", options: ["null", "0", "undefined", "NaN"], correctAnswer: 1 },
  { id: 16, text: "Which of the following is NOT a valid way to create a string in C#?", options: ["string str = \"Hello\";", "string str = string.Empty;", "string str = new String();", "string str = 'Hello';"], correctAnswer: 3 },
  { id: 17, text: "What does the 'finally' block in a try-catch statement do in C#?", options: ["Handles the exception", "Always executes regardless of exception", "Returns a value", "Ends the try block"], correctAnswer: 1 },
  { id: 18, text: "What is the purpose of 'using' directive in C#?", options: ["To define a namespace alias", "To include a file", "To declare a constant", "To start a loop"], correctAnswer: 0 },
  { id: 19, text: "Which of the following statements is used to terminate a loop in C#?", options: ["break;", "return;", "continue;", "exit;"], correctAnswer: 0 },
  { id: 20, text: "What does the 'is' keyword do in C#?", options: ["Compares object references", "Checks if an object is null", "Checks if an object is of a certain type", "Converts one type to another"], correctAnswer: 2 },
  { id: 21, text: "Which of the following is a valid way to declare and initialize an array in C#?", options: ["int[] arr = new int[5];", "int arr[] = new int[5];", "int arr[5];", "array arr = new array();"], correctAnswer: 0 },
  { id: 22, text: "What is the difference between '== and '===' operators in C#?", options: ["They are the same", "=== checks for value and type, == checks for value only", "== checks for value and type, === checks for value only", "There is no difference"], correctAnswer: 1 },
  { id: 23, text: "Which keyword is used to explicitly destroy an object in C#?", options: ["destroy", "dispose", "delete", "None of the above"], correctAnswer: 3 },
  { id: 24, text: "What is the purpose of the 'virtual' keyword in C#?", options: ["To prevent method overriding", "To allow method overriding", "To declare a static method", "To declare a private method"], correctAnswer: 1 },
  { id: 25, text: "Which of the following is NOT a valid type of loop in C#?", options: ["for", "while", "repeat-until", "do-while"], correctAnswer: 2 },
  { id: 26, text: "What is the default access modifier for a class in C#?", options: ["private", "public", "protected", "internal"], correctAnswer: 3 },
  { id: 27, text: "Which keyword is used to refer to the current instance of a class in C#?", options: ["self", "this", "current", "it"], correctAnswer: 1 },
  { id: 28, text: "What is the purpose of 'break' statement in C#?", options: ["To end the program", "To terminate a loop or switch statement", "To skip to the next iteration of a loop", "To return a value from a method"], correctAnswer: 1 },
  { id: 29, text: "Which of the following statements is used to pass control to the next iteration of a loop in C#?", options: ["return;", "exit;", "skip;", "continue;"], correctAnswer: 3 },
  { id: 30, text: "What is the purpose of the 'abstract' keyword in C#?", options: ["To prevent method overriding", "To define a blueprint of a class with some methods to be implemented by derived classes", "To define a static method", "To declare a private method"], correctAnswer: 1 }
];



const port = process.env.PORT || 3000;

const SECRET_KEY = 'app_quiz123!!';

app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
  origin: 'https://quiz-4eda1.web.app',
  credentials: true
}));


const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);


async function connectToDatabase() {
  await client.connect();
  return client.db('your_database_name');
}

// Read users from db.json
const getUsers = () => {
  const data = fs.readFileSync('db.json');
  return JSON.parse(data);
};

// Write users to db.json
const saveUsers = (users) => {
  fs.writeFileSync('db.json', JSON.stringify(users, null, 2));
};

app.post('/api/login', (req, res) => {
  const { name } = req.body;
  if (name && name.trim()) {
    const users = getUsers();
    let user = users.find(user => user.name === name.trim());
    if (!user) {
      user = { name: name.trim(), score: 0, currentQuestionIndex: 0, answeredQuestions: 0 };
      users.push(user);
      saveUsers(users);
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
// Submit answer endpoint
app.post('/api/submit', authenticateJWT, (req, res) => {
  const { answer } = req.body;
  const users = getUsers();
  const user = users.find(user => user.name === req.user.name);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const currentQuestion = questions[user?.currentQuestionIndex];
  const correctAnswer = currentQuestion?.correctAnswer;

  if (answer === correctAnswer) {
    user.score += 1;
  } else {
    // Store incorrect answer details
    const incorrectAnswer = {
      id: currentQuestion?.id,
      text: currentQuestion?.text,
      options: currentQuestion?.options,
      correctAnswer: currentQuestion?.correctAnswer,
      userAnswer: answer,
      score: currentQuestion?.score
    };

    if (!user.incorrectAnswers) {
      user.incorrectAnswers = [];
    }
    user.incorrectAnswers.push(incorrectAnswer);
  }

  user.currentQuestionIndex += 1;
  user.answeredQuestions += 1;

  saveUsers(users);

  if (user.currentQuestionIndex >= questions.length) {
    return res.status(200).json({ success: true, message: 'Quiz completed', score: user.score });
  }

  res.status(200).json({ success: true });
});

app.get('/api/quiz-results', (req, res) => {
  const users = getUsers();
  res.json(users);
});

app.get('/api/question', authenticateJWT, (req, res) => {
  const users = getUsers();
  const user = users.find(user => user.name === req.user.name);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (user.currentQuestionIndex >= questions.length) {
    return res.status(200).json({ success: true, message: 'Quiz completed', quizOver: true, score: user.score });
  }

  const currentQuestion = questions[user.currentQuestionIndex];
  res.status(200).json({ ...currentQuestion, totalQuestions: questions.length, quizOver: false, score: user.score });
});


app.post('/api/saveScore', authenticateJWT, (req, res) => {
  const { score } = req.body;
  const users = getUsers();
  const user = users.find(user => user.name === req.user.name);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  user.score = score;
  saveUsers(users);

  res.status(200).json({ success: true, message: 'Score saved successfully' });
});





app.listen(port, () => console.log(`Listning on port ${port}`));