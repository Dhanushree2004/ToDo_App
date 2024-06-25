import React, { useEffect, useState } from 'react';
import { Box, Grid, Button, TextField, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import axios from 'axios';

const TodoList = () => {
    const [todo, setTodo] = useState('');
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    function create() {
        axios.post('http://localhost:5000/posting', { todo })
            .then(() => {
                alert('Data has been posted successfully');
                setTodo('');
                getData();
            })
            .catch(() => {
                alert('Failed to post data');
            });
    }

    function getData() {
        axios.get('http://localhost:5000/getting')
            .then((response) => {
                setTodos(response.data);
            })
            .catch(() => {
                alert('Failed to retrieve data');
            });
    }

    const updatedTodo = (id, updatedData) => {
        axios.put(`http://localhost:5000/updating/${id}`, { todo: updatedData })
            .then(() => {
                console.log('Todo updated successfully');
                getData();
            })
            .catch((error) => {
                console.error('Failed to update todo:', error);
                alert('Failed to update todo');
            });
    };

    const handleEditButtonClick = (id) => {
        const newdata = prompt("Enter the new data");

        if (newdata === null || newdata.trim() === '') {
            alert("Please enter valid new data");
            return;
        }

        updatedTodo(id, newdata.trim());
    };

    function deleteTodo(id) {
        axios.delete(`http://localhost:5000/deleting/${id}`)
            .then(() => {
                getData();
            })
            .catch(() => {
                alert("Failed to delete data");
            })
    }

    return (
        <Box mt={25} mx={10}>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} md={6}>
                    <TextField
                        id="todo"
                        label="Todo"
                        variant="outlined"
                        fullWidth
                        value={todo}
                        onChange={(e) => setTodo(e.target.value)}
                    />
                </Grid>
                <br/>
                <Grid item xs={6} md={3}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={create}
                        fullWidth
                    >
                        Post
                    </Button>
                </Grid>
                <Grid item xs={6} md={3}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={getData}
                        fullWidth
                    >
                        Get All
                    </Button>
                </Grid>
            </Grid>

            <List style={{ marginTop: '25px' }}>
                {todos.map((item) => (
                    <ListItem key={item._id} disablePadding>
                        <ListItemText primary={item.todo} />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="edit" onClick={() => handleEditButtonClick(item._id)}>
                                <Edit />
                            </IconButton>
                            <IconButton edge="end" aria-label="delete" onClick={() => deleteTodo(item._id)}>
                                <Delete />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default TodoList;
