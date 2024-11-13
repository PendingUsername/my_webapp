// src/components/CrudManager.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CrudManager = () => {
  const [items, setItems] = useState([]);
  const [newItems, setNewItems] = useState([{ name: '', description: '' }]);
  const [editMode, setEditMode] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  // Fetch items from the backend API when the component mounts
  useEffect(() => {
    fetchItems();
  }, []);

  // Function to fetch all items from the API
  const fetchItems = () => {
    axios.get('http://localhost:8000/api/items/')
      .then(response => setItems(response.data))
      .catch(error => console.error('Error fetching items:', error));
  };

  // Function to handle changes in input fields for multiple items
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newItems];
    updatedItems[index][field] = value;
    setNewItems(updatedItems);
  };

  // Function to add a new empty item field
  const addNewItemField = () => {
    setNewItems([...newItems, { name: '', description: '' }]);
  };

  // Function to add multiple items at once
  const addItems = () => {
    // Filter out items that are empty
    const itemsToAdd = newItems.filter(item => item.name.trim() !== '' && item.description.trim() !== '');
    if (itemsToAdd.length === 0) return;

    // Make a POST request for each valid item
    const addItemRequests = itemsToAdd.map(item => axios.post('http://localhost:8000/api/items/', item));

    Promise.all(addItemRequests)
      .then(responses => {
        setItems([...items, ...responses.map(res => res.data)]);
        setNewItems([{ name: '', description: '' }]);  // Reset input fields to one empty item
      })
      .catch(error => console.error('Error adding items:', error));
  };

  // Function to enter edit mode for an item
  const startEditItem = (item) => {
    setEditMode(true);
    setItemToEdit(item);
    setNewItems([{ name: item.name, description: item.description }]);
  };

  // Function to update an item
  const updateItem = () => {
    if (!itemToEdit) return;

    axios.put(`http://localhost:8000/api/items/${itemToEdit.id}/`, newItems[0])
      .then(response => {
        setItems(items.map(item => item.id === itemToEdit.id ? response.data : item));
        setNewItems([{ name: '', description: '' }]);
        setEditMode(false);
        setItemToEdit(null);
      })
      .catch(error => console.error('Error updating item:', error));
  };

  // Function to delete an item
  const deleteItem = (itemId) => {
    axios.delete(`http://localhost:8000/api/items/${itemId}/`)
      .then(() => {
        setItems(items.filter(item => item.id !== itemId));
      })
      .catch(error => console.error('Error deleting item:', error));
  };

  return (
    <div>
      <h2>Manage Items</h2>
      {newItems.map((item, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <TextField
            value={item.name}
            onChange={(e) => handleItemChange(index, 'name', e.target.value)}
            label="Item Name"
            variant="outlined"
            style={{ marginRight: '10px' }}
          />
          <TextField
            value={item.description}
            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
            label="Item Description"
            variant="outlined"
          />
        </div>
      ))}

      <Button
        variant="contained"
        onClick={addNewItemField}
        style={{ marginBottom: '20px', marginRight: '10px' }}
      >
        Add Another Item
      </Button>
      <Button
        variant="contained"
        color={editMode ? "secondary" : "primary"}
        onClick={editMode ? updateItem : addItems}
        style={{ marginBottom: '20px' }}
      >
        {editMode ? "Update Item" : "Add Items"}
      </Button>

      <List>
        {items.map(item => (
          <ListItem key={item.id} secondaryAction={
            <>
              <IconButton edge="end" aria-label="edit" onClick={() => startEditItem(item)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => deleteItem(item.id)}>
                <DeleteIcon />
              </IconButton>
            </>
          }>
            <ListItemText primary={item.name} secondary={item.description} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default CrudManager;
