const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://khalilreali84:v1Ub8vijMFuTXm0D@cluster0.qrf3e93.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const fs = require('fs');

// async function insertData() {
//     try {
//         await client.connect();
//         console.log("Connected to MongoDB");

//         const db = client.db("quiz_db");
//         const collection = db.collection('quiz');

//         const data = JSON.parse(fs.readFileSync('db.json', 'utf8'));
        
//         const result = await collection.insertMany(data);
//         console.log(`${result.insertedCount} documents were inserted`);
//     } catch (error) {
//         console.error("Error inserting data", error);
//     } finally {
//         await client.close();
//     }
// }

// insertData();
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

async function insertQuestions() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db("quiz_db");
        const collection = db.collection('questions');

        // Insert questions into the collection
        const result = await collection.insertMany(questions);
        console.log(`${result.insertedCount} questions were inserted`);
    } catch (error) {
        console.error("Error inserting questions", error);
    } finally {
        await client.close();
    }
}

insertQuestions();