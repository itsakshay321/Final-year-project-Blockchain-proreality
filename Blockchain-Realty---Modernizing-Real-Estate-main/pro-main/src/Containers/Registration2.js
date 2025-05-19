import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Container } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import axios from 'axios';

// ✅ Pinata API Keys (Replace with your own)
const PINATA_API_KEY = "YOUR_PINATA_API_KEY";
const PINATA_SECRET_API_KEY = "YOUR_PINATA_SECRET_API_KEY";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      pan: '',
      occupation: '',
      state: '',
      address: '',
      postalCode: '',
      city: '',
      contact: '',
      laddress: '',
      lstate: '',
      lcity: '',
      lamount: '',
      larea: '',
      lpostalCode: '',
      document: null,
      documentHash: '',
      images: [],
      imageHashes: [],
      checked: false,
      ownerWallet: '', // ✅ New state for wallet address
    };
  }

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  };

  handleChangeCheckbox = () => {
    this.setState({ checked: !this.state.checked });
  };

  onDocumentChange = async (event) => {
    const file = event.target.files[0];
    this.setState({ document: file });

    if (file) {
      const hash = await this.uploadToPinata(file);
      this.setState({ documentHash: hash });
    }
  };

  onImageChange = async (event) => {
    const files = Array.from(event.target.files);
    this.setState({ images: files });

    const uploadedHashes = [];
    for (let file of files) {
      const hash = await this.uploadToPinata(file);
      uploadedHashes.push(hash);
    }
    this.setState({ imageHashes: uploadedHashes });
  };

  uploadToPinata = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const pinataMetadata = JSON.stringify({
        name: file.name,
      });
      formData.append("pinataMetadata", pinataMetadata);

      const pinataOptions = JSON.stringify({
        cidVersion: 1,
      });
      formData.append("pinataOptions", pinataOptions);

      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY,
        },
      });

      return res.data.IpfsHash;
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      return null;
    }
  };

  handleSubmit = async () => {
    const { document, images } = this.state;
    const propertyData = { ...this.state }; // Copy all state data
  
    // Convert document to Base64
    if (document) {
      propertyData.documentBase64 = await this.convertToBase64(document);
    }
  
    // Convert images to Base64
    if (images.length > 0) {
      const imageBase64Array = await Promise.all(images.map(file => this.convertToBase64(file)));
      propertyData.imageBase64Array = imageBase64Array;
    }
  
    // Retrieve existing data from localStorage
    let storedData = JSON.parse(localStorage.getItem('propertyData')) || [];
  
    // Ensure it's an array
    if (!Array.isArray(storedData)) {
      storedData = [];
    }
  
    // Add new property data to the array
    storedData.push(propertyData);
  
    // Save updated array back to localStorage
    localStorage.setItem('propertyData', JSON.stringify(storedData));
  
    alert('Property Registered Successfully!');
    console.log('Updated Property Data Stored:', storedData);
  };
  
  // Utility function to convert a file to Base64
  convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  

  render() {
    return (
      <Container style={{ marginTop: '30px' }}>
        <h1 style={{ textAlign: 'center', fontWeight: '600' }}>Owner's Details</h1>
        <TextField label="Owner Wallet Address" fullWidth margin="normal" onChange={this.handleChange('ownerWallet')} />
        <TextField label="Owner's Name" fullWidth margin="normal" onChange={this.handleChange('name')} />
        <TextField label="Email ID" fullWidth margin="normal" onChange={this.handleChange('email')} />
        <TextField label="Contact Number" fullWidth margin="normal" onChange={this.handleChange('contact')} />
        <TextField label="PAN Number" fullWidth margin="normal" onChange={this.handleChange('pan')} />
        <TextField label="Occupation" fullWidth margin="normal" onChange={this.handleChange('occupation')} />
        <TextField label="Permanent Address" fullWidth margin="normal" onChange={this.handleChange('address')} />
        <TextField label="State" fullWidth margin="normal" onChange={this.handleChange('state')} />
        <TextField label="City" fullWidth margin="normal" onChange={this.handleChange('city')} />
        <TextField label="Postal Code" fullWidth margin="normal" onChange={this.handleChange('postalCode')} />

        <h1 style={{ textAlign: 'center', fontWeight: '600', marginTop: '30px' }}>Land Details</h1>

        <TextField label="Land Address" fullWidth margin="normal" onChange={this.handleChange('laddress')} />
        <TextField label="State" fullWidth margin="normal" onChange={this.handleChange('lstate')} />
        <TextField label="City" fullWidth margin="normal" onChange={this.handleChange('lcity')} />
        <TextField label="Postal Code" fullWidth margin="normal" onChange={this.handleChange('lpostalCode')} />
        <TextField label="Area (sq. meters)" fullWidth margin="normal" onChange={this.handleChange('larea')} />
        <TextField label="Total Amount (Rs)" fullWidth margin="normal" onChange={this.handleChange('lamount')} />

        <h3>Upload Legal Document</h3>
        <input type="file" onChange={this.onDocumentChange} accept=".pdf,.doc,.docx" />
        {this.state.documentHash && <p>IPFS Hash: {this.state.documentHash}</p>}

        <h3>Upload Land Images</h3>
        <input type="file" multiple onChange={this.onImageChange} accept="image/*" />
        <div>
          {this.state.imageHashes.length > 0 &&
            this.state.imageHashes.map((hash, index) => (
              <p key={index}>Image {index + 1}: {hash}</p>
            ))}
        </div>

        <FormControlLabel
          style={{ marginTop: '20px' }}
          control={<Checkbox checked={this.state.checked} onChange={this.handleChangeCheckbox} color="primary" />}
          label="I agree to the Terms and Conditions"
        />

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Button variant="contained" color="primary" endIcon={<SendIcon />} onClick={this.handleSubmit} disabled={!this.state.checked}>
            Submit
          </Button>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          Already Registered? <a href="/dashboard">Check Status</a>
        </div>
      </Container>
    );
  }
}

export default Register;
