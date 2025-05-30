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
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions'
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import axios from 'axios';
import Land from '../abis/LandRegistry.json'; // Import your contract ABI here



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Define table column headings
const columns = [
  { id: 'propertyId', label: 'Property ID', minWidth: 100 },
  { id: 'name', label: 'Full Name', minWidth: 100 },
  { id: 'laddress', label: 'Land Details', minWidth: 170 },
  { id: 'lstate', label: 'State', minWidth: 100 },
  { id: 'lcity', label: 'City', minWidth: 100 },
  { id: 'lamount', label: 'Total Amount (in Rs)', minWidth: 100 },
  { id: 'document', label: 'Documents', minWidth: 100 },
  { id: 'images', label: 'Land Images', minWidth: 100 },
  { id: 'isGovtApproved', label: 'Status of Land Approval (by the Govt.)', minWidth: 100 },
  
  { id: 'isAvailable', label: 'Land Availability Status', minWidth: 100 },
  { id: 'requester', label: 'Requestor Info', minWidth: 100 },
  { id: 'actions', label: 'Actions', minWidth: 100 }, // New column for actions (e.g., remove button)
];

const styles = (theme) => ({
  root: {
    width: '100%',
  },
});

class TableComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assetList: [], // State to hold the list of assets
      openTransactionDialog: false,
      isLoading: true,
      open: false,
      open1: false,
      images: [],
    };
  }


  // componentDidMount = async () => {
  //   const web3 = window.web3
  //   const accounts = await web3.eth.getAccounts()
  //   await window.localStorage.setItem('web3account', accounts[0])
  //   this.setState({ account: accounts[0] })
  //   const networkId = await web3.eth.net.getId()
  //   const LandData = Land.networks[networkId]
  //   if (LandData) {
  //     const landList = new web3.eth.Contract(Land.abi, LandData.address)
  //     this.setState({ landList })
  //   } else {
  //     window.alert('Token contract not deployed to detected network.')
  //   }
  // }

  componentDidMount = () => {
    const storedProperties = JSON.parse(localStorage.getItem('propertyData')) || [];
    const manualAddress = localStorage.getItem('manualAddress')?.toLowerCase();
  
    const filteredProperties = storedProperties
      .filter((property) =>
        property.ownerWallet?.toLowerCase() === manualAddress
      )
      .map((property, index) => ({
        ...property,
        propertyId: property.propertyId || `P00${index + 1}`,
        isAvailable: property.isAvailable || "No",
      }));
  
    this.setState({
      assetList: filteredProperties,
      isLoading: false,
    });
  };
  
  
  

  handleVerifyLand = async (propertyId) => {
    try {
      await this.state.landList.methods.govtStatus(propertyId, "Not Approved", "Not Available").send({
        from: this.state.account,
        gas: 1000000,
      });
      // Reload the page or update the state as needed
      window.location.reload();
    } catch (error) {
      console.error("Error verifying land:", error);
      // Handle error, show error message, etc.
    }
  };




  // handleAccept = async (id) => {
  //   await this.state.landList.methods.makeAvailable(id).send({
  //     from: this.state.account,
  //     gas: 1000000,
  //   })

  //   window.location.reload()
  // }

  handleAccept = (id) => {
    this.setState((prevState) => {
      const updatedList = prevState.assetList.map((property) =>
        property.propertyId === id ? { ...property, isAvailable: "Yes" } : property
      );
  
      // Update local storage
      localStorage.setItem('propertyData', JSON.stringify(updatedList));
  
      return { assetList: updatedList };
    });
  };
  
  
  handleProcessRequest = async (id, n, address, name) => {
    await this.state.landList.methods.processRequest(id, n).send({
      from: this.state.account,
      gas: 1000000,
    })
    const user = await this.state.landList.methods.getUser(address).call()

    if (user) {
      this.setState({
        uid: user[0],
        uname: user[1],
        ucontact: user[2],
        uemail: user[3],
        ucode: user[4],
        ucity: user[5],
        exist: user[6],
      })
    }
    let data = {
      lemail: this.state.uemail,
      subject:
        n == 3
          ? `${name} has accepted your requested.`
          : `${name} has rejected your requested.`,
      message:
        n == 3
          ? `${name} has accepted your requested. Please check your account.`
          : `${name} has rejected your requested. Please check your account.`,
    }

    console.log(data)
    await axios
      .post('http://localhost:3001/send_mail', data)
      .then((response) => {
        if (response.status == 200) {
          alert('Message Sent.')
        } else {
          alert('Message failed to send.')
        }
      })
    window.location.reload()
  }
  handleRequesterInfo = (address) => {
    // Open the user info dialog
    this.setState({ open: true });
  
    // Get property/requester data from localStorage
    const propertyData = JSON.parse(localStorage.getItem('propertyData')) || [];
  
    // Find property with matching requester address
    const matchingProperty = propertyData.find(
      (property) => property.requester?.toLowerCase() === address.toLowerCase()
    );
  
    if (matchingProperty) {
      const user = {
        uid: matchingProperty.uid || "N/A",
        uname: matchingProperty.uname || "N/A",
        ucontact: matchingProperty.ucontact || "N/A",
        uemail: matchingProperty.uemail || "N/A",
        ucode: matchingProperty.ucode || "N/A",
        ucity: matchingProperty.ucity || "N/A",
      };
  
      // Mock transaction details
      const mockTransaction = {
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        blockNumber: Math.floor(Math.random() * 1000000),
        gasUsed: Math.floor(Math.random() * 500000) + 21000,
        buyerAddress: address,
        amount: matchingProperty.lamount || 0,
      };
  
      // Set both user and transaction data to state
      this.setState({
        ...user,
        exist: true,
        openTransactionDialog: true,
        transactionDetails: mockTransaction,
        selectedProperty: matchingProperty,
      });
    } else {
      alert("No requester info found for this address.");
    }
  };
  
  handleClose = () => {
    this.setState({ open: false })
  }
  handleViewImages = (imageArray) => {
    if (imageArray && imageArray.length > 0) {
      console.log("Images Received in handleViewImages:", imageArray); // Debugging Output
  
      this.setState({
        open1: true, // Open modal
        images: [...imageArray], // Ensure images are set correctly
      }, () => console.log("State Updated with Images: ", this.state.images)); // Debugging after state update
    } else {
      alert("No images available.");
    }
  };
  
  
  
  
  
  handleClose1 = () => {
    console.log("Closing modal..."); // Debugging output
    this.setState({ open1: false, images: [] });
  };

  handleCloseTransactionDialog = () => {
    this.setState({ openTransactionDialog: false, transactionDetails: null });
  };
  

  // // Function to remove property
  // removeProperty = async (id) => {
  //   try {
  //     // Call the smart contract function to remove the property
  //     await this.state.landList.methods.removeProperty(id).send({
  //       from: this.state.account,
  //       gas: 1000000,
  //     });
  //     // Reload the page or update the state as needed
  //     window.location.reload();
  //   } catch (error) {
  //     console.error("Error removing property:", error);
  //     // Handle error, show error message, etc.
  //   }
  // };

  removeProperty = (id) => {
    this.setState((prevState) => {
      // Filter out the removed property
      const updatedList = prevState.assetList.filter((property) => property.propertyId !== id);
  
      // Update local storage
      localStorage.setItem('propertyData', JSON.stringify(updatedList));
  
      return { assetList: updatedList };
    });
  };
  

  // Render method to display the table
  render() {
    const { classes, assetList } = this.props;
  
    return (
    
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    <b>{column.label}</b>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
  {this.state.assetList.map((row, index) => (
    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
      {columns.map((column) => {
        const value = row[column.id];

        return (
          <TableCell key={column.id} align={column.align}>
            {column.id === "document" ? (
              row["documentBase64"] ? (
                <a href={row["documentBase64"]} download="document.pdf">
                  View Document
                </a>
              ) : (
                <span style={{ color: "gray" }}>No Document</span>
              )
            ) : column.id === "images" ? (  // ✅ Correct placement for View Images
              row["imageBase64Array"] && row["imageBase64Array"].length > 0 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    console.log("Button Clicked for Row:", row.propertyId); // Debugging
                    console.log("Images Sent to handleViewImages:", row["imageBase64Array"]); // Debugging
                    this.handleViewImages(row["imageBase64Array"]);
                  }}
                >
                  View Images
                </Button>
              ) : (
                <span style={{ color: "gray" }}>No Images</span>
              )
            ) : column.id === "actions" ? (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => this.removeProperty(row["propertyId"])}
              >
                Remove
              </Button>
            ) : column.id === "isAvailable" ? ( // ✅ Show status with button
              value === "Yes" ? (
                <span style={{ color: "green", fontWeight: "bold" }}>Available</span>
              ) : (
                <>
                  <span style={{ color: "red", fontWeight: "bold", marginRight: "10px" }}>
                    Not Available
                  </span>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => this.handleAccept(row["propertyId"])}
                  >
                    Make Available
                  </Button>
                </>
              )
            ) : column.id === "isGovtApproved" ? ( // ✅ Handle land registration status
              value === "NULL" || !value ? (
                <span style={{ color: "orange", fontWeight: "bold" }}>Not Yet Verified</span>
              ) : (
                value
              )
            ) : column.id === "requester" ? ( // ✅ Handle request info
              !value || value === "0x0000000000000000000000000000000000000000" ? (
                <span style={{ color: "gray", fontWeight: "bold" }}>No Request</span>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => this.handleRequesterInfo(row["requester"])}
                >
                  View Request
                </Button>
              )
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

         {/* ✅ Add the Dialog Modal Here (After TableContainer) */}
      <Dialog
        open={this.state.open1}
        onClose={this.handleClose1}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">View Images</DialogTitle>
        <DialogContent dividers>
          {this.state.images.length > 0 ? (
            this.state.images.map((image, index) => (
              <img
                key={index}
                src={image} // Display Base64 images correctly
                alt={`Uploaded Image ${index + 1}`}
                style={{
                  width: "100%",
                  maxHeight: "400px",
                  display: "block",
                  marginBottom: "10px",
                  objectFit: "contain",
                }}
              />
            ))
          ) : (
            <p style={{ color: "red" }}>No images available</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose1} color="primary">
            Close
          </Button>
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


// import React, { Component } from 'react';
// import { withStyles } from '@material-ui/core/styles';
// import Paper from '@material-ui/core/Paper';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import Button from '@material-ui/core/Button';
// import Grid from '@material-ui/core/Grid';
// import Dialog from '@material-ui/core/Dialog';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogActions from '@material-ui/core/DialogActions'
// import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';
// import Slide from '@material-ui/core/Slide';
// import axios from 'axios';
// import Land from '../abis/LandRegistry.json'; // Import your contract ABI here



// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

// // Define table column headings
// const columns = [
//   { id: 'property', label: 'Property ID', minWidth: 100 },
//   { id: 'name', label: 'Full Name', minWidth: 100 },
//   { id: 'laddress', label: 'Land Details', minWidth: 170 },
//   { id: 'lstate', label: 'State', minWidth: 100 },
//   { id: 'lcity', label: 'City', minWidth: 100 },
//   { id: 'lamount', label: 'Total Amount (in Rs)', minWidth: 100 },
//   { id: 'document', label: 'Documents', minWidth: 100 },
//   { id: 'images', label: 'Land Images', minWidth: 100 },
//   { id: 'isGovtApproved', label: 'Status of Land Approval (by the Govt.)', minWidth: 100 },
  
//   { id: 'isAvailable', label: 'Land Availability Status', minWidth: 100 },
//   { id: 'requester', label: 'Requestor Info', minWidth: 100 },
//   { id: 'actions', label: 'Actions', minWidth: 100 }, // New column for actions (e.g., remove button)
// ];

// const styles = (theme) => ({
//   root: {
//     width: '100%',
//   },
// });

// class TableComponent extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       assetList: [], // State to hold the list of assets
//       isLoading: true,
//       open: false,
//       open1: false,
//       images: [],
//     };
//   }


//   componentDidMount = async () => {
//     const web3 = window.web3
//     const accounts = await web3.eth.getAccounts()
//     await window.localStorage.setItem('web3account', accounts[0])
//     this.setState({ account: accounts[0] })
//     const networkId = await web3.eth.net.getId()
//     const LandData = Land.networks[networkId]
//     if (LandData) {
//       const landList = new web3.eth.Contract(Land.abi, LandData.address)
//       this.setState({ landList })
//     } else {
//       window.alert('Token contract not deployed to detected network.')
//     }
//   }


//   handleVerifyLand = async (propertyId) => {
//     try {
//       await this.state.landList.methods.govtStatus(propertyId, "Not Approved", "Not Available").send({
//         from: this.state.account,
//         gas: 1000000,
//       });
//       // Reload the page or update the state as needed
//       window.location.reload();
//     } catch (error) {
//       console.error("Error verifying land:", error);
//       // Handle error, show error message, etc.
//     }
//   };




//   handleAccept = async (id) => {
//     await this.state.landList.methods.makeAvailable(id).send({
//       from: this.state.account,
//       gas: 1000000,
//     })

//     window.location.reload()
//   }
//   handleProcessRequest = async (id, n, address, name) => {
//     await this.state.landList.methods.processRequest(id, n).send({
//       from: this.state.account,
//       gas: 1000000,
//     })
//     const user = await this.state.landList.methods.getUser(address).call()

//     if (user) {
//       this.setState({
//         uid: user[0],
//         uname: user[1],
//         ucontact: user[2],
//         uemail: user[3],
//         ucode: user[4],
//         ucity: user[5],
//         exist: user[6],
//       })
//     }
//     let data = {
//       lemail: this.state.uemail,
//       subject:
//         n == 3
//           ? `${name} has accepted your requested.`
//           : `${name} has rejected your requested.`,
//       message:
//         n == 3
//           ? `${name} has accepted your requested. Please check your account.`
//           : `${name} has rejected your requested. Please check your account.`,
//     }

//     console.log(data)
//     await axios
//       .post('http://localhost:3001/send_mail', data)
//       .then((response) => {
//         if (response.status == 200) {
//           alert('Message Sent.')
//         } else {
//           alert('Message failed to send.')
//         }
//       })
//     window.location.reload()
//   }
//   handleRequesterInfo = async (address) => {
//     this.setState({ open: true })
//     const user = await this.state.landList.methods.getUser(address).call()

//     if (user) {
//       this.setState({
//         uid: user[0],
//         uname: user[1],
//         ucontact: user[2],
//         uemail: user[3],
//         ucode: user[4],
//         ucity: user[5],
//         exist: user[6],
//       })
//     }
//   }
//   handleClose = () => {
//     this.setState({ open: false })
//   }
//   handleViewImages = async (images) => {
//     this.setState({ open1: true })
//     //window.alert('Hello');

//     if (images) {
//       this.setState({
//         images: images,
//       })
//     }
//   }
//   handleClose1 = () => {
//     this.setState({ open1: false })
//   }

//   // Function to remove property
//   removeProperty = async (id) => {
//     try {
//       // Call the smart contract function to remove the property
//       await this.state.landList.methods.removeProperty(id).send({
//         from: this.state.account,
//         gas: 1000000,
//       });
//       // Reload the page or update the state as needed
//       window.location.reload();
//     } catch (error) {
//       console.error("Error removing property:", error);
//       // Handle error, show error message, etc.
//     }
//   };

//   // Render method to display the table
//   render() {
//     const { classes, assetList } = this.props;
  
//     return (
    
//       <Paper className={classes.root}>
//         <TableContainer className={classes.container}>
//           <Table stickyHeader aria-label="sticky table">
//             <TableHead>
//               <TableRow>
//                 {columns.map((column) => (
//                   <TableCell
//                     key={column.id}
//                     align={column.align}
//                     style={{ minWidth: column.minWidth }}
//                   >
//                     <b>{column.label}</b>
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {assetList.map((row) => {
                
//                 return (
//                   <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
//                     {columns.map((column) => {
//                       const value = row[column.id];
//                       return (
//                         <TableCell key={column.id} align={column.align}>
//                           {column.id === "isAvailable" &&
//                             value === "GovtApproved" ? (
//                             <Button
//                               variant="contained"
//                               color="primary"
//                               onClick={() => this.handleAccept(row["property"])}
//                             >
//                               Make Available
//                             </Button>
//                           )  : column.id === "isAvailable" &&
//                             value === "Pending" ? (
//                             <Grid container spacing={2}>
//                               <Grid item>
//                                 <Button
//                                   variant="contained"
//                                   color="primary"
//                                   onClick={() =>
//                                     this.handleProcessRequest(
//                                       row["property"],
//                                       3,
//                                       row["requester"],
//                                       row["name"]
//                                     )
//                                   }
//                                 >
//                                   Accept
//                                 </Button>
//                               </Grid>
//                               <Grid item>
//                                 <Button
//                                   variant="contained"
//                                   color="secondary"
//                                   onClick={() =>
//                                     this.handleProcessRequest(
//                                       row["property"],
//                                       2,
//                                       row["requester"],
//                                       row["name"]
//                                     )
//                                   }
//                                 >
//                                   Reject
//                                 </Button>
//                               </Grid>
//                             </Grid>
//                           ) : column.id === "requester" &&
//                             value !== "0x0000000000000000000000000000000000000000" ? (
//                             <Button
//                               variant="contained"
//                               color="primary"
//                               onClick={() =>
//                                 this.handleRequesterInfo(row["requester"])
//                               }
//                             >
//                               View Request
//                             </Button>
//                           ) : column.id === "requester" &&
//                             value === "0x0000000000000000000000000000000000000000" ? (
//                             <span>No Requestor</span>
//                           ) : column.id === "document" ? (
//                             <a href={row["document"]} download>
//                               Download Document
//                             </a>
//                           ) : column.id === "images" ? (
//                             <Button
//                               variant="contained"
//                               color="primary"
//                               onClick={() =>
//                                 this.handleViewImages(row["images"])
//                               }
//                             >
//                               View Images
//                             </Button>
//                           ) : column.id === "isGovtApproved" && value === "NULL" ? (
//                             <Button
//                               variant="contained"
//                               color="secondary"
//                               onClick={() =>
//                                 this.handleVerifyLand(row["property"])
//                               }
//                             >
//                               Verify Land
//                             </Button>
//                           ) : column.id === "actions" ? (
//                             <Button
//                               variant="contained"
//                               color="secondary"
//                               onClick={() =>
//                                 this.removeProperty(row["property"])
//                               }
//                             >
//                               Remove
//                             </Button>
//                           ) : (
//                             value
//                           )}
//                           <Dialog
//                             open={this.state.open}
//                             TransitionComponent={Transition}
//                             keepMounted
//                             onClose={this.handleClose}
//                             aria-labelledby="alert-dialog-slide-title"
//                             aria-describedby="alert-dialog-slide-description"
//                           >
//                             <DialogTitle
//                               id="alert-dialog-slide-title"
//                               style={{ textAlign: 'center' }}
//                             >
//                               {'Requestor Details'}
//                             </DialogTitle>
//                             <DialogContent>
//                               <DialogContentText id="alert-dialog-slide-description">
//                                 <b>Name:</b> {this.state.uname}
//                                 <br />
//                                 {/* <b>Address:</b> {row['requester']}
//                                 <br /> */}
//                                 <b>Contact Number:</b> {this.state.ucontact}
//                                 <br />
//                                 <b>Email ID:</b> {this.state.uemail}
//                                 <br />
//                                 <b>City:</b> {this.state.ucity}
//                                 <br />
//                                 <b>Postal Code:</b> {this.state.ucode}
//                               </DialogContentText>
//                             </DialogContent>
//                             <DialogActions>
//                               <Button
//                                 onClick={this.handleClose}
//                                 color="primary"
//                               >
//                                 Close
//                               </Button>
//                             </DialogActions>
//                           </Dialog>
//                           <Dialog
//                             open={this.state.open1}
//                             TransitionComponent={Transition}
//                             keepMounted
//                             onClose={this.handleClose1}
//                             aria-labelledby="alert-dialog-slide-title"
//                             aria-describedby="alert-dialog-slide-description"
//                           >
//                             <DialogTitle
//                               id="alert-dialog-slide-title"
//                               style={{ textAlign: 'center' }}
//                             >
//                               {'View Images'}
//                             </DialogTitle>
//                             <DialogContent>
//                               <DialogContentText id="alert-dialog-slide-description">
//                                 {this.state.images.map((image) => (
//                                   <img
//                                     src={image}
//                                     style={{
//                                       height: '300px',
//                                       width: '400px',
//                                       margin: '10px',
//                                     }}
//                                   />
//                                 ))}
//                               </DialogContentText>
//                             </DialogContent>
//                             <DialogActions>
//                               <Button
//                                 onClick={this.handleClose1}
//                                 color="primary"
//                               >
//                                 Close
//                               </Button>
//                             </DialogActions>
//                           </Dialog>
//                         </TableCell>
//                       );
//                     })}
//                   </TableRow>
//                 );
         
//               })}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>
      
//     );
//   }
// }

// export default withStyles(styles)(TableComponent);
