// src/components/CrudManager.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import GetAppIcon from '@mui/icons-material/GetApp';
import { saveAs } from 'file-saver';
import { DataGrid } from '@mui/x-data-grid';

const CrudManager = ({ token }) => {
  const [items, setItems] = useState([]);
  const [newItems, setNewItems] = useState([{ name: '', description: '' }]);
  const [editMode, setEditMode] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch items from the backend API when the component mounts
  useEffect(() => {
    if (token) {
      fetchItems();
    }
  }, [token]);

  // Function to fetch all items from the API
  const fetchItems = () => {
    axios
      .get('http://localhost:8000/api/items/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setItems(response.data))
      .catch((error) => {
        console.error('Error fetching items:', error);
        showSnackbar('Failed to fetch items.', 'error');
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

  // Function to remove an item field from the new items list
  const removeNewItemField = (index) => {
    const updatedItems = newItems.filter((_, i) => i !== index);
    setNewItems(updatedItems);
  };

  // Function to add multiple items at once
  const addItems = () => {
    const itemsToAdd = newItems.filter((item) => item.name.trim() !== '' && item.description.trim() !== '');
    if (itemsToAdd.length === 0) return;

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
        showSnackbar('Items added successfully!', 'success');
      })
      .catch((error) => {
        console.error('Error adding items:', error);
        showSnackbar('Failed to add items.', 'error');
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
        showSnackbar('Item updated successfully!', 'success');
      })
      .catch((error) => {
        console.error('Error updating item:', error);
        showSnackbar('Failed to update item.', 'error');
      });
  };

  // Function to delete an item
  const deleteItem = (itemId) => {
    axios
      .delete(`http://localhost:8000/api/items/${itemId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setItems(items.filter((item) => item.id !== itemId));
        showSnackbar('Item deleted successfully!', 'error');
      })
      .catch((error) => {
        console.error('Error deleting item:', error);
        showSnackbar('Failed to delete item.', 'error');
      });
  };

  // Function to download the resume
  const downloadResume = () => {
    window.open('http://localhost:8000/static/resume.pdf', '_blank');
  };

  // Function to show the snackbar message
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  // Function to handle closing the snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Function to export items to CSV
  const exportToCSV = () => {
    if (items.length === 0) {
      showSnackbar('No items to export.', 'warning');
      return;
    }

    const csvRows = [
      ['ID', 'Name', 'Description'], // Header row
      ...items.map((item) => [item.id, item.name, item.description]), // Data rows
    ];

    const csvContent = csvRows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'items.csv');
    showSnackbar('Items exported successfully!', 'success');
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150, editable: true },
    { field: 'description', headerName: 'Description', width: 250, editable: true },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit Item">
            <IconButton edge="end" aria-label="edit" onClick={() => startEditItem(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Item">
            <IconButton edge="end" aria-label="delete" onClick={() => deleteItem(params.row.id)}>
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
        <h2>Manage Items</h2>
        <Tooltip title="Download Resume">
          <Button variant="contained" color="primary" startIcon={<GetAppIcon />} onClick={downloadResume}>
            Download Resume
          </Button>
        </Tooltip>
      </Box>

      {newItems.map((item, index) => (
        <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
          <TextField
            value={item.name}
            onChange={(e) => handleItemChange(index, 'name', e.target.value)}
            label="Item Name"
            variant="outlined"
            style={{ marginRight: '10px', minWidth: '200px' }}
            InputProps={{
              style: { maxWidth: '400px' },
            }}
          />
          <TextField
            value={item.description}
            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
            label="Item Description"
            variant="outlined"
            style={{ minWidth: '200px' }}
            InputProps={{
              style: { maxWidth: '400px' },
            }}
          />
          <Tooltip title="Remove Item">
            <IconButton edge="end" aria-label="delete" onClick={() => removeNewItemField(index)} style={{ marginLeft: '10px' }}>
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
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

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={items}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
        />
      </div>

      <Box marginY="20px">
        <Tooltip title="Export Items to CSV">
          <Button variant="contained" color="secondary" onClick={exportToCSV}>
            Export to CSV
          </Button>
        </Tooltip>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CrudManager;
