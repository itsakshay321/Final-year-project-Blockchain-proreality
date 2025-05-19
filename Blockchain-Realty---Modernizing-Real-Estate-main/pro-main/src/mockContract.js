import LandRegistry from '../abis/LandRegistry.json';

// Mock Blockchain Data
const mockProperties = [
    {
        propertyId: "1",
        owner: "0x4Eaa8961CfE1A20Ae2f471ba7A46EB6cbFB9D05e",
        name: "John Doe",
        email: "john@example.com",
        contact: "+1234567890",
        pan: "ABCDE1234F",
        occupation: "Engineer",
        address: "123 Street, City",
        state: "California",
        city: "Los Angeles",
        postalCode: "90001",
        laddress: "456 Street, City",
        lstate: "California",
        lcity: "San Francisco",
        lpostalCode: "94102",
        larea: "500 sq ft",
        lamount: "10 ETH",
        isGovtApproved: true,
        isAvailable: true,
        requester: "0x0000000000000000000000000000000000000000",
        requestStatus: "Pending",
        document: "doc1.pdf",
        images: ["image1.jpg", "image2.jpg"]
    }
];

// Mock Contract Methods
const mockContract = {
    methods: {
        async viewAssets() {
            return mockProperties.map(p => p.propertyId);
        },
        async landInfoOwner(propertyId) {
            return mockProperties.find(p => p.propertyId === propertyId);
        }
    }
};

export default mockContract;
