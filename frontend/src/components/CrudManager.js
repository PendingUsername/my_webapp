// src/components/CrudManager.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, List, ListItem, ListItemText, IconButton, Box, Snackbar, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GetAppIcon from '@mui/icons-material/GetApp';

// Component to manage CRUD operations
const CrudManager = ({ token }) => {
  const [items, setItems] = useState([]); // State to store items fetched from the backend
  const [newItems, setNewItems] = useState([{ name: '', description: '' }]); // State for new items to be added
  const [editMode, setEditMode] = useState(false); // State to toggle edit mode
  const [itemToEdit, setItemToEdit] = useState(null); // State to store item being edited
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' }); // State for snackbar messages

  // Fetch items when the component mounts
  useEffect(() => {
    fetchItems();
  }, []);

  // Fetch items from the backend API
  const fetchItems = () => {
    axios
      .get('http://localhost:8000/api/items/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setItems(response.data)) // Update items state with fetched data
      .catch((error) => {
        console.error('Error fetching items:', error);
        showSnackbar('Failed to fetch items.', 'error');
      });
  };

  // Update state when input fields are changed
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newItems];
    updatedItems[index][field] = value;
    setNewItems(updatedItems); // Update newItems state with modified values
  };

  // Add an empty input field for adding a new item
  const addNewItemField = () => {
    setNewItems([...newItems, { name: '', description: '' }]);
  };

  // Add multiple items to the backend
  const addItems = () => {
    const itemsToAdd = newItems.filter((item) => item.name.trim() !== '' && item.description.trim() !== ''); // Filter out empty items
    if (itemsToAdd.length === 0) return;

    const addItemRequests = itemsToAdd.map((item) =>
      axios.post('http://localhost:8000/api/items/', item, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    );

    // Send requests to add items in parallel
    Promise.all(addItemRequests)
      .then((responses) => {
        setItems([...items, ...responses.map((res) => res.data)]); // Update items state with added items
        setNewItems([{ name: '', description: '' }]); // Reset input fields
        showSnackbar('Items added successfully!', 'success');
      })
      .catch((error) => {
        console.error('Error adding items:', error);
        showSnackbar('Failed to add items.', 'error');
      });
  };

  // Start edit mode for an item
  const startEditItem = (item) => {
    setEditMode(true);
    setItemToEdit(item);
    setNewItems([{ name: item.name, description: item.description }]); // Pre-fill input fields with item details
  };

  // Update an item in the backend
  const updateItem = () => {
    if (!itemToEdit) return;

    axios
      .put(`http://localhost:8000/api/items/${itemToEdit.id}/`, newItems[0], {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setItems(items.map((item) => (item.id === itemToEdit.id ? response.data : item))); // Update item in items state
        setNewItems([{ name: '', description: '' }]); // Reset input fields
        setEditMode(false); // Exit edit mode
        setItemToEdit(null);
        showSnackbar('Item updated successfully!', 'success');
      })
      .catch((error) => {
        console.error('Error updating item:', error);
        showSnackbar('Failed to update item.', 'error');
      });
  };

  // Delete an item from the backend
  const deleteItem = (itemId) => {
    axios
      .delete(`http://localhost:8000/api/items/${itemId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setItems(items.filter((item) => item.id !== itemId)); // Remove item from items state
        showSnackbar('Item deleted successfully!', 'success');
      })
      .catch((error) => {
        console.error('Error deleting item:', error);
        showSnackbar('Failed to delete item.', 'error');
      });
  };

  // Download the resume file
  const downloadResume = () => {
    window.open('http://localhost:8000/static/resume.pdf', '_blank'); // Open resume link in a new tab
  };

  // Show a snackbar message with a given severity level
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  // Close the snackbar message
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
        <h2>Manage Items</h2>
        <Button
          variant="contained"
          color="primary"
          startIcon={<GetAppIcon />}
          onClick={downloadResume}
        >
          Download Resume
        </Button>
      </Box>

      {/* Render input fields for adding new items */}
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

      <Box display="flex" gap="10px" marginBottom="20px">
        <Button variant="contained" onClick={addNewItemField}>
          Add Another Item
        </Button>
        <Button variant="contained" color={editMode ? 'secondary' : 'primary'} onClick={editMode ? updateItem : addItems}>
          {editMode ? 'Update Item' : 'Add Items'}
        </Button>
      </Box>

      {/* List of items */}
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

      {/* Snackbar for showing success or error messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CrudManager;
