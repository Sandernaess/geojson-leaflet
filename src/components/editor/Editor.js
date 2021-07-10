import React, { useEffect} from 'react'

// MUI components
import { IconButton, Tooltip, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

// MUI icons 
import EditIcon from '@material-ui/icons/Edit';

function Editor(props) {
    const [open, setOpen] = React.useState(false);
    const [title, setTitle] = React.useState(''); 
    const [snippet, setSnippet] = React.useState('');

    const { feature } = props; 

    useEffect(() => {
        setTitle(feature.properties.title);
        setSnippet(feature.properties.snippet);
    }, [feature.properties.title, feature.properties.snippet])

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    }

    const handleSnippetChange = (event) => {
        setSnippet(event.target.value);
    }

    const handleOpen = () => {
        setOpen(true); 
    }

    const handleClose = () => {
        setOpen(false); 
    }

    const handleSubmit = () => {
        props.callback(title, snippet)
        handleClose();
    }

    return (
        <div>
            <IconButton onClick={handleOpen} color="primary">
                <Tooltip title="Edit marker" aria-label="Edit a marker" placement="bottom">
                    <EditIcon color="primary"/>
                </Tooltip>
            </IconButton>
            
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit feature</DialogTitle>
                <DialogContent>
                    <TextField onChange={handleTitleChange} value={title} autoFocus margin="dense" id="title" label="Title" type="text" fullWidth />
                    <TextField onChange={handleSnippetChange}  value={snippet} margin="dense" id="title" label="Snippet" type="text" fullWidth />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">Save</Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}

export default Editor
