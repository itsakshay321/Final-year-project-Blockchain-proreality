import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Web3 from 'web3';

// Slide animation for dialogs
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} />;
});

// Table Columns
const columns = [
  { id: 'propertyId', label: 'Property ID', minWidth: 100 },
  { id: 'name', label: 'Full Name', minWidth: 100 },
  { id: 'laddress', label: 'Land Details', minWidth: 170 },
  { id: 'lstate', label: 'State', minWidth: 100 },
  { id: 'lcity', label: 'City', minWidth: 100 },
  { id: 'lamount', label: 'Total Amount (ETH)', minWidth: 100 },
  { id: 'document', label: 'Documents', minWidth: 100 },
  { id: 'images', label: 'Land Images', minWidth: 100 },
  { id: 'isGovtApproved', label: 'Govt. Approval Status', minWidth: 100 },
  { id: 'isAvailable', label: 'Availability', minWidth: 100 },
  { id: 'actions', label: 'Actions', minWidth: 100 },
];

const styles = {
  root: {
    width: '100%',
  },
};

class TableComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assetList: [],
      openImageDialog: false,
      openTransactionDialog: false,
      images: [],
      selectedProperty: null,
      transactionDetails: null,
    };
  }

  // Load available properties from local storage
  componentDidMount = () => {
    const storedProperties = JSON.parse(localStorage.getItem('propertyData')) || [];
    const availableProperties = storedProperties.filter((property) => property.isAvailable === "Yes");

    this.setState({ assetList: availableProperties });
  };

  // Handle property purchase request
  handleRequestToBuy = async (property) => {
    if (!window.ethereum) {
      alert("MetaMask not detected. Please install MetaMask.");
      return;
    }

    const web3 = new Web3(window.ethereum);
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const accounts = await web3.eth.getAccounts();
      const buyerAddress = accounts[0]; // The connected wallet

      console.log("Buyer Address: ", buyerAddress);

      // Mock transaction details
      const mockTransaction = {
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`, // Mock Transaction Hash
        blockNumber: Math.floor(Math.random() * 1000000),
        gasUsed: Math.floor(Math.random() * 500000) + 21000,
        buyerAddress,
        amount: property.lamount, // ETH amount from property details
      };

      this.setState({
        openTransactionDialog: true,
        transactionDetails: mockTransaction,
        selectedProperty: property,
      });

      // Update availability status locally
      this.setState((prevState) => {
        const updatedList = prevState.assetList.map((p) =>
          p.propertyId === property.propertyId ? { ...p, requester: buyerAddress } : p
        );

        localStorage.setItem('propertyData', JSON.stringify(updatedList));

        return { assetList: updatedList.filter((p) => p.isAvailable === "Yes") };
      });
    } catch (error) {
      console.error("Transaction Error: ", error);
      alert("Transaction failed.");
    }
  };

  handleViewImages = (imageArray) => {
    if (imageArray && imageArray.length > 0) {
      this.setState({
        openImageDialog: true,
        images: [...imageArray],
      });
    } else {
      alert("No images available.");
    }
  };

  handleCloseImageDialog = () => {
    this.setState({ openImageDialog: false, images: [] });
  };

  handleCloseTransactionDialog = () => {
    this.setState({ openTransactionDialog: false, transactionDetails: null });
  };

  render() {
    return (
      <Paper style={styles.root}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                    <b>{column.label}</b>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.assetList.map((row) => (
                <TableRow hover role="checkbox" key={row.propertyId}>
                  {columns.map((column) => {
                    const value = row[column.id];

                    return (
                      <TableCell key={column.id}>
                        {column.id === "document" ? (
                          row.document ? (
                            <a href={row.document} download="document.pdf">
                              View Document
                            </a>
                          ) : (
                            <span style={{ color: "gray" }}>No Document</span>
                          )
                        ) : column.id === "images" ? (
                          row.imageBase64Array && row.imageBase64Array.length > 0 ? (
                            <Button variant="contained" color="primary" onClick={() => this.handleViewImages(row.imageBase64Array)}>
                              View Images
                            </Button>
                          ) : (
                            <span style={{ color: "gray" }}>No Images</span>
                          )
                        ) : column.id === "isAvailable" ? (
                          <Button variant="contained" color="primary" onClick={() => this.handleRequestToBuy(row)}>
                            Request to Buy
                          </Button>
                        ) : column.id === "actions" ? (
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() =>
                              this.setState((prevState) => ({
                                assetList: prevState.assetList.filter((property) => property.propertyId !== row.propertyId),
                              }))
                            }
                          >
                            Remove
                          </Button>
                        ) : (
                          value
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Image Dialog */}
        <Dialog open={this.state.openImageDialog} onClose={this.handleCloseImageDialog} maxWidth="md" fullWidth>
          <DialogTitle>View Images</DialogTitle>
          <DialogContent dividers>
            {this.state.images.map((image, index) => (
              <img key={index} src={image} alt={`Uploaded ${index + 1}`} style={{ width: "100%", maxHeight: "400px", objectFit: "contain" }} />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseImageDialog} color="primary">Close</Button>
          </DialogActions>
        </Dialog>

        {/* Transaction Dialog */}
        <Dialog open={this.state.openTransactionDialog} onClose={this.handleCloseTransactionDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogContent dividers>
            {this.state.transactionDetails && (
              <div>
                <p><b>Transaction Hash:</b> {this.state.transactionDetails.txHash}</p>
                <p><b>Block Number:</b> {this.state.transactionDetails.blockNumber}</p>
                <p><b>Gas Used:</b> {this.state.transactionDetails.gasUsed}</p>
                <p><b>Buyer Address:</b> {this.state.transactionDetails.buyerAddress}</p>
                <p><b>Amount:</b> {this.state.transactionDetails.amount} ETH</p>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseTransactionDialog} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }
}

export default withStyles(styles)(TableComponent);