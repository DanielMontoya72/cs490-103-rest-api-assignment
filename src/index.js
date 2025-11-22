const express = require('express');
const crypto = require('crypto');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());


// **************************************************************
// Put your implementation here
// If necessary to add imports, please do so in the section above
const users = []

app.post('/users', (req, res) => {
    try {
        // make a uuid then build the user
        const uuid = crypto.randomUUID();
        const user = { id: uuid, ...req.body };

        // if the user we built doesn't have name or email, return error
        if (!user.name || !user.email) {
            res.status(400).json({ error: "Missing required fields: name and/or email" });
            return;
        }

        // otherwise, we're good, so add and return the user
        users.push(user);
        res.status(201).json(user);
        
    } catch(e) {
        res.status(500).json({ error : e });
    }
    
});

app.get('/users/:id', (req, res) => {
    try {
        // get the id, then find the user
        const id = req.params.id;
        const user = users.find(u => u.id === id);
        
        // error for user not found
        if (!user) {
            res.status(404).json({ error : "User not found" });
        }

        // otherwise, we're good, so return the user
        res.status(200).json(user);
    } catch(e) {
        res.status(500).json({ error : e });
    }

});

app.put('/users/:id', (req, res) => {
    try {
        // find where the user is
        const id = req.params.id;
        const userIndex = users.findIndex(u => u.id === id);

        // if the user was not found, return error
        if (userIndex === -1) {
            res.status(404).json({ error : "User not found" });
            return;
        }
        
        // if name or email was not provided in request, return error
        if (!req.body.name || !req.body.email) {
            res.status(400).json({ error: "Missing required fields for update: name and/or email" });
            return;
        }

        // otherwise, we're good, so update and return the user
        users[userIndex] = { id: id, ...req.body };
        res.status(200).json(users[userIndex]);

    } catch(e) {
        res.status(500).json({ error : e });
    }

});

app.delete('/users/:id', (req, res) => {
    try {
        // find where the user is
        id = req.params.id;
        const userIndex = users.findIndex(u => u.id === id);

        // if the user was not found, return error
        if (userIndex === -1) {
            res.status(404).json({ error : "User not found" });
            return;
        }

        // otherwise, we're good, so delete the user and return 204 No Content
        users.splice(userIndex, 1);
        res.status(204).send();

    } catch(e) {
        res.status(500).json({ error : e });
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Do not touch the code below this comment
// **************************************************************

// Start the server (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

module.exports = app; // Export the app for testing