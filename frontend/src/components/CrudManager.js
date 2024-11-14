// src/components/CrudManager.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CrudManager = ({ token }) => {
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
    console.log('Fetching items with token:', token); // Debugging statement to check token value
    axios
      .get('http://localhost:8000/api/items/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setItems(response.data))
      .catch((error) => {
        console.error('Error fetching items:', error);
        if (error.response && error.response.status === 401) {
          alert('Session expired. Please log in again.');
          window.location.reload(); // Refresh page to prompt login again
        }
      });
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
    const itemsToAdd = newItems.filter((item) => item.name.trim() !== '' && item.description.trim() !== '');
    if (itemsToAdd.length === 0) return;

    console.log('Adding items with token:', token); // Debugging statement to check token value

    const addItemRequests = itemsToAdd.map((item) =>
      axios.post('http://localhost:8000/api/items/', item, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    );

    Promise.all(addItemRequests)
      .then((responses) => {
        setItems([...items, ...responses.map((res) => res.data)]);
        setNewItems([{ name: '', description: '' }]); // Reset input fields to one empty item
      })
      .catch((error) => {
        console.error('Error adding items:', error);
        if (error.response && error.response.status === 401) {
          alert('Session expired. Please log in again.');
          window.location.reload(); // Refresh page to prompt login again
        }
      });
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

    console.log('Updating item with token:', token); // Debugging statement to check token value

    axios
      .put(`http://localhost:8000/api/items/${itemToEdit.id}/`, newItems[0], {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setItems(items.map((item) => (item.id === itemToEdit.id ? response.data : item)));
        setNewItems([{ name: '', description: '' }]);
        setEditMode(false);
        setItemToEdit(null);
      })
      .catch((error) => {
        console.error('Error updating item:', error);
        if (error.response && error.response.status === 401) {
          alert('Session expired. Please log in again.');
          window.location.reload(); // Refresh page to prompt login again
        }
      });
  };

  // Function to delete an item
  const deleteItem = (itemId) => {
    console.log('Deleting item with token:', token); // Debugging statement to check token value

    axios
      .delete(`http://localhost:8000/api/items/${itemId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setItems(items.filter((item) => item.id !== itemId));
      })
      .catch((error) => {
        console.error('Error deleting item:', error);
        if (error.response && error.response.status === 401) {
          alert('Session expired. Please log in again.');
          window.location.reload(); // Refresh page to prompt login again
        }
      });
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
        color={editMode ? 'secondary' : 'primary'}
        onClick={editMode ? updateItem : addItems}
        style={{ marginBottom: '20px' }}
      >
        {editMode ? 'Update Item' : 'Add Items'}
      </Button>

      <List>
        {items.map((item) => (
          <ListItem
            key={item.id}
            secondaryAction={
              <>
                <IconButton edge="end" aria-label="edit" onClick={() => startEditItem(item)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => deleteItem(item.id)}>
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemText primary={item.name} secondary={item.description} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default CrudManager;
