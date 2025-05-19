import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  Container,
  CircularProgress,
  AppBar,
  Tabs,
  Tab,
  Typography,
  Box,
} from "@material-ui/core";
import Table from "../Containers/Owner_Table";
import AvailableTable from "../Containers/Buyer_Table";
import Registration2 from "../Containers/Registration2";
import { withStyles } from "@material-ui/core/styles";
import landRegistryData from "../abis/LandRegistry.json"; // Import JSON directly

const styles = (theme) => ({
  container: {
    "& .MuiContainer-maxWidthLg": {
      maxWidth: "100%",
    },
  },
  root: {
    backgroundColor: "#fff",
    borderRadius: "5px",
    minHeight: "80vh",
  },
});

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assetList: [],
      assetList1: [],
      isLoading: true,
      value: 0,
    };
  }

  componentDidMount = () => {
    // Simulate fetching property details from JSON instead of Blockchain
    this.fetchPropertyDetails();
  };

  // fetchPropertyDetails = () => {
  //   // Extracting property data from the JSON ABI
  //   const landAbi = landRegistryData.abi.find((item) => item.name === "land");

  //   if (!landAbi || !landAbi.outputs) {
  //     console.error("Property data not found in ABI.");
  //     this.setState({ isLoading: false });
  //     return;
  //   }

  //   // Mock Data from ABI
  //   const properties = [
  //     {
  //       propertyId: "0x1234567890abcdef1234567890abcdef12345678",
  //       address: "123 Main Street",
  //       amount: 50000,
  //       govtApproved: "Yes",
  //       available: "Yes",
  //     },
  //     {
  //       propertyId: "0xabcdefabcdefabcdefabcdefabcdefabcdef",
  //       address: "456 Secondary Street",
  //       amount: 75000,
  //       govtApproved: "No",
  //       available: "No",
  //     },
  //   ];

  //   // Update state with mock properties
  //   this.setState({
  //     assetList: properties.filter((prop) => prop.available === "Yes"),
  //     assetList1: properties.filter((prop) => prop.available === "No"),
  //     isLoading: false,
  //   });
  // };

  fetchPropertyDetails = () => {
    // Mock Data (Hardcoded instead of blockchain)
    const properties = [
      {
        propertyId: "P001",
        address: "123 Main Street",
        amount: 50000,
        govtApproved: "Yes",
        available: "Yes",
      },
      {
        propertyId: "P002",
        address: "456 Secondary Street",
        amount: 75000,
        govtApproved: "No",
        available: "No",
      },
    ];
  
    // Update state with mock properties
    this.setState({
      assetList: properties.filter((prop) => prop.available === "Yes"),
      assetList1: properties.filter((prop) => prop.available === "No"),
      isLoading: false,
    });
  };
  
  handleChange = (event, newValue) => {
    this.setState({ value: newValue });
  };

  render() {
    const { classes } = this.props;
    return this.state.isLoading ? (
      <div style={{ position: "absolute", top: "50%", left: "50%" }}>
        <CircularProgress />
      </div>
    ) : (
      <div className="profile-bg">
        <div className={classes.container}>
          <Container style={{ marginTop: "40px" }}>
            <div className={classes.root}>
              <AppBar position="static" color="default" className="dashboard">
                <Tabs
                  value={this.state.value}
                  onChange={this.handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                  aria-label="full width tabs example"
                >
                  <Tab label="My Properties" />
                  <Tab label="Available Properties" />
                  <Tab label="Register Land" />
                </Tabs>
              </AppBar>

              <TabPanel value={this.state.value} index={0}>
                <Table assetList={this.state.assetList} />
              </TabPanel>

              <TabPanel value={this.state.value} index={1}>
                <AvailableTable assetList={this.state.assetList1} />
              </TabPanel>

              <TabPanel value={this.state.value} index={2}>
                <Registration2 />
              </TabPanel>
            </div>
          </Container>
        </div>
      </div>
    );
  }
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default withStyles(styles)(withRouter(Dashboard));
