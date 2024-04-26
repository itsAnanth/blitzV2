import React, { useContext, useState } from 'react';
import { Button, Dialog, DialogActions } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FireBaseContext } from '../../../contexts/firebase.context';
import { ThemeContext } from 'styled-components';
import AccountManager from '../../../structures/AccountManager';
import { LoaderContext } from '../../../contexts/loader.context';


export default function DeleteAccount() {
    const [open, setOpen] = React.useState(false);
    const authContext = useContext(FireBaseContext);
    const themeContext = useContext(ThemeContext);
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState("");
    const loaderContext = useContext(LoaderContext);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteAccount = async() => {
        const user = await AccountManager.deleteUserAccount();
        if (user.error) {
            setError(true)
            setErrorText(user.detail.split("/")[1].split("-").join(" "));
            return;
        }

        loaderContext.setLoaderText('Deleting account');
        loaderContext.setLoader(true)

    }

    return (

        <>
            <Button
                variant="contained"
                color="error"
                onClick={handleClickOpen}
            >Delete Account</Button>
            <React.Fragment>
                <Dialog
                    PaperProps={{
                        style: {
                            backgroundColor: themeContext.tertiary,
                            color: themeContext.text
                        }
                    }}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    {error && 
                        <DialogContentText sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }} color="red">
                            {errorText}
                        </DialogContentText>
                    }
                    <DialogTitle style={{
                        color: themeContext.text
                    }} id="alert-dialog-title">
                        {"Account Deletion"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText style={{
                            color: themeContext.lightText,
                            marginBottom: '1.5rem'
                        }} id="alert-dialog-description">
                            {`This action will permanently delete all data associated with your current account`}
                        </DialogContentText>
                        <DialogContentText style={{
                            color: themeContext.lightText,
                            marginBottom: '1.5rem'
                        }}>
                            {`${authContext.user?.displayName} (userId: ${authContext.user?.uid})`}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button
                            variant='contained'
                            color='error'
                            onClick={deleteAccount} autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        </>
    );
}