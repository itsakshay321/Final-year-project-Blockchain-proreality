import React, { Component } from 'react';
import Web3 from 'web3';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Container } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    '& .MuiFormLabel-root': {
      color: '#fff',
    },
    '&  .MuiInputBase-root': {
      color: '#fff',
    },
    '& .MuiButton-containedPrimary': {
      backgroundColor: '#328888',
      fontFamily: "'Roboto Condensed', sans-serif",
    },
  },
  message: {
    marginTop: '10px',
    color: '#4CAF50',
    fontSize: '16px',
    textAlign: 'center',
  },
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      account: null,
    };
  }

  componentDidMount = async () => {
    if (window.localStorage.getItem('authenticated') === 'true') {
      this.props.history.push('/dashboard_govt');
    }
  };

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  };

  connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];

        this.setState({ account });
        window.localStorage.setItem('web3account', account);
        console.log('MetaMask connected:', account);
      } catch (error) {
        console.error('MetaMask connection error:', error);
        window.alert('MetaMask connection failed.');
      }
    } else {
      window.alert('MetaMask is not installed. Please install MetaMask to continue.');
    }
  };

  handleSubmit = async () => {
    const { username, password, account } = this.state;

    if (!account) {
        alert('Please connect MetaMask before logging in.');
        return;
    }

    let data = { username, password, account };

    console.log('Sending login request:', data); // ✅ Debugging log

    if (username && password) {
        axios.post('http://localhost:3001/login', data)
            .then((response) => {
                console.log('Server response:', response); // ✅ Debugging log

                if (response.status === 200) {
                    window.alert('Login Successful');
                    window.localStorage.setItem('authenticated', true);
                    window.localStorage.setItem('token', response.data);
                    window.location = '/dashboard_govt';

                    this.setState({ username: '', password: '' });
                } else {
                    alert('Wrong Credentials');
                    this.setState({ username: '', password: '' });
                }
            })
            .catch(error => {
                console.error('Login error:', error.response ? error.response.data : error.message);
                alert(`Login failed: ${error.response ? error.response.data : error.message}`);
            });
    } else {
        alert('All fields are required');
    }
};


  render() {
    const { classes } = this.props;
    const { account } = this.state;

    return (
      <div className="profile-bg">
        <Container style={{ marginTop: '40px' }} className={classes.root}>
          <div className="login-text">Registration Department</div>
          <div className="input">
            <TextField
              id="username"
              type="text"
              label="Username"
              placeholder="Enter Your Username"
              fullWidth
              value={this.state.username}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              onChange={this.handleChange('username')}
            />
            <TextField
              id="password"
              type="password"
              label="Password"
              placeholder="Enter Your Password"
              fullWidth
              value={this.state.password}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              onChange={this.handleChange('password')}
            />
          </div>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={this.connectMetaMask}
            >
              Connect MetaMask
            </Button>
          </div>

          {/* Display MetaMask Connected Account */}
          {account && (
            <div className={classes.message}>
              MetaMask connected: {account}
            </div>
          )}

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              onClick={this.handleSubmit}
            >
              Login
            </Button>
          </div>
        </Container>
      </div>
    );
  }
}

export default withStyles(styles)(Login);
