import React, { Component } from 'react';
import Web3 from 'web3';
import {
  Container,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  root: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #e0f7fa 0%, #80cbc4 100%)',
  },
  paper: {
    padding: theme.spacing(6),
    maxWidth: 400,
    width: '100%',
    textAlign: 'center',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  },
  title: {
    fontFamily: "'Roboto Condensed', sans-serif",
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginBottom: theme.spacing(4),
    color: '#004d40',
  },
  button: {
    marginTop: theme.spacing(2),
    backgroundColor: '#328888',
    color: '#fff',
    fontFamily: "'Roboto Condensed', sans-serif",
    '&:hover': {
      backgroundColor: '#256b6b',
    },
  },
  orText: {
    margin: theme.spacing(4, 0, 2),
    fontFamily: "'Roboto Condensed', sans-serif",
    color: '#555',
  },
  textField: {
    marginTop: theme.spacing(1),
  },
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      manualAddress: '',
    };
  }

  connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];

        window.localStorage.setItem('web3account', account);
        window.location = '/dashboard';
      } catch (error) {
        console.error('MetaMask connection error:', error);
        window.alert('MetaMask connection failed.');
      }
    } else {
      window.alert('MetaMask is not installed. Please install MetaMask to continue.');
    }
  };

  handleManualAddressChange = (event) => {
    const manualAddress = event.target.value;
    this.setState({ manualAddress });
    localStorage.setItem('manualAddress', manualAddress);
  };

  render() {
    const { classes } = this.props;
    const { manualAddress } = this.state;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper} elevation={3}>
          <Typography className={classes.title}>User Login</Typography>

          <Button
            variant="contained"
            className={classes.button}
            endIcon={<SendIcon />}
            onClick={this.connectMetaMask}
            fullWidth
          >
            Login with MetaMask
          </Button>

          <Typography variant="body1" className={classes.orText}>
            Or enter your wallet address manually
          </Typography>

          <TextField
            className={classes.textField}
            variant="outlined"
            label="Wallet Address"
            value={manualAddress}
            onChange={this.handleManualAddressChange}
            fullWidth
          />
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(Login);
