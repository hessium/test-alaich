import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

// CORS config
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(bodyParser.json());

// Mock database
const users = [
    {
        email: 'aleksei@example.com',
        password: 'lkJlkn8hj',
        fullname: 'Aleksei K'
    }
];

let tokens = [];

// Appendix A: Authors Sample Data
const authors = [
    {
        "authorId": 1,
        "name": "Walt Disney"
    },
    {
        "authorId": 2,
        "name": "Mark Twain"
    },
    {
        "authorId": 3,
        "name": "Albert Einstein"
    }
];

// Appendix B: Quotes Sample Data
const quotes = [
    {
        "quoteId": 1,
        "authorId": 1,
        "quote": "The more you like yourself, the less you are like anyone else, which makes you unique."
    },
    {
        "quoteId": 2,
        "authorId": 1,
        "quote": "Disneyland is a work of love. We didn't go into Disneyland just with the idea of making money."
    },
    {
        "quoteId": 3,
        "authorId": 1,
        "quote": "I always like to look on the optimistic side of life, but I am realistic enough to know that life is a complex matter."
    },
    {
        "quoteId": 4,
        "authorId": 2,
        "quote": "The secret of getting ahead is getting started."
    },
    {
        "quoteId": 5,
        "authorId": 2,
        "quote": "Part of the secret of a success in life is to eat what you like and let the food fight it out inside."
    },
    {
        "quoteId": 6,
        "authorId": 2,
        "quote": "You can't depend on your eyes when your imagination is out of focus."
    },
    {
        "quoteId": 7,
        "authorId": 3,
        "quote": "Look deep into nature, and then you will understand everything better."
    },
    {
        "quoteId": 8,
        "authorId": 3,
        "quote": "Learn from yesterday, live for today, hope for tomorrow. The important thing is not to stop questioning."
    },
    {
        "quoteId": 9,
        "authorId": 3,
        "quote": "The only source of knowledge is experience."
    }
];

const generateToken = () => Math.random().toString(36).substr(2) + Date.now().toString(36);

app.get('/info', (req, res) => {
    res.json({
        success: true,
        data: {
            info: "Some information about the <b>company</b>."
        }
    });
});

const validateToken = (token) => tokens.some(t => t.token === token);

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Missing credentials' });
    }

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken();
    tokens.push({ token, email });
    res.json({
        success: true,
        data: { token }
    });
});

app.get('/profile', (req, res) => {
    const { token } = req.query;

    const tokenEntry = tokens.find(t => t.token === token);
    if (!tokenEntry) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    const user = users.find(u => u.email === tokenEntry.email);
    res.json({
        success: true,
        data: {
            fullname: user.fullname,
            email: user.email
        }
    });
});

app.get('/author', (req, res) => {
    const { token } = req.query;

    if (!validateToken(token)) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or missing authentication token'
        });
    }

    setTimeout(() => {
        const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
        res.json({
            success: true,
            data: {
                authorId: randomAuthor.authorId,
                name: randomAuthor.name
            }
        });
    }, 5000);
});

app.get('/quote', (req, res) => {
    const { token, authorId } = req.query;

    if (!validateToken(token)) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or missing authentication token'
        });
    }

    const numericAuthorId = parseInt(authorId);
    if (isNaN(numericAuthorId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid author ID format'
        });
    }

    const authorQuotes = quotes.filter(q => q.authorId === numericAuthorId);

    if (authorQuotes.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'No quotes found for this author'
        });
    }

    setTimeout(() => {
        const randomQuote = authorQuotes[Math.floor(Math.random() * authorQuotes.length)];
        res.json({
            success: true,
            data: {
                quoteId: randomQuote.quoteId,
                authorId: randomQuote.authorId,
                quote: randomQuote.quote
            }
        });
    }, 5000);
});

app.delete('/logout', (req, res) => {
    const { token } = req.query;

    const index = tokens.findIndex(t => t.token === token);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Token not found' });
    }

    tokens.splice(index, 1);
    res.json({ success: true, data: {} });
});

app.options('*', cors());

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint not found' });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});