const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
const port = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/tododb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to database');
    })
    .catch((err) => {
        console.error(err);
    });

const DBSchema = new mongoose.Schema({
    todo: { type: String, required: true },
});

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const DBModel = mongoose.model('Todo', DBSchema);
const UserModel = mongoose.model('User', UserSchema);

app.use(express.json());
app.use(cors());

app.post('/signup', async (req, resp) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({ username, password: hashedPassword });
        await user.save();
        resp.send('Signup successful');
    } catch (error) {
        console.error(error);
        resp.status(500).send('Signup failed');
    }
});

app.post('/posting', async (req, resp) => {
    try {
        const user = new DBModel(req.body);
        const results = await user.save();
        const datasending = results.toObject(); //save as object
        resp.send(datasending); //give response to frontend
    } catch (e) {
        console.error(e);
        resp.status(500).send('Something Went Wrong');
    }
});

app.get('/getting', async (req, resp) => {
    try {
        const todos = await DBModel.find({}, 'todo');
        resp.json(todos);
    } catch (e) {
        console.error(e);
        resp.status(500).send('Failed to retrieve todos');
    }
});

app.put('/updating/:id', async (req, res) => {
    const { id } = req.params;
    const { todo } = req.body;

    try {
        const updatedTodo = await DBModel.findByIdAndUpdate(
            id,
            { todo },
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).send('Todo not found');
        }

        res.json(updatedTodo);
    } catch (error) {
        console.error('Failed to update todo:', error);
        res.status(500).send('Failed to update todo');
    }
});

app.delete('/deleting/:id', async (req, resp) => {
    try {
        const { id } = req.params;
        const result = await DBModel.findByIdAndDelete(id);

        if (!result) {
            return resp.status(404).send('Todo not found');
        }

        resp.send('Todo deleted successfully');
    } catch (e) {
        console.error(e);
        resp.status(500).send('Failed to delete todo');
    }
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
