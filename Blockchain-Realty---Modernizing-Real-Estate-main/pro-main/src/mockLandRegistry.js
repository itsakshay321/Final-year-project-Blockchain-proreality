const mockLandRegistry = {
    land: {
      "1": {
        id: "0x1234567890abcdef1234567890abcdef12345678",
        ipfsHash: "QmExampleIPFSHash",
        laddress: "123 Main Street",
        lamount: 50000,
        key: 12345,
        isGovtApproved: "Yes",
        isAvailable: "Yes",
        requester: "0xabcdefabcdefabcdefabcdefabcdefabcdef",
        requestStatus: 1
      },
      "2": {
        id: "0xabcdefabcdefabcdefabcdefabcdefabcdef",
        ipfsHash: "QmAnotherExampleHash",
        laddress: "456 Secondary Street",
        lamount: 75000,
        key: 67890,
        isGovtApproved: "No",
        isAvailable: "No",
        requester: "0x9876543210abcdef9876543210abcdef98765432",
        requestStatus: 2
      }
    },
    viewAssets: function () {
      return Object.keys(this.land); // Returns array of property IDs
    },
    landInfoOwner: function (id) {
      return this.land[id] || null; // Returns property details
    }
  };
  
  export default mockLandRegistry;
  