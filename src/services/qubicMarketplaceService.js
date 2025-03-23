// src/services/qubicMarketplaceService.js

// This module provides functions to interact with the Qubic Marketplace contract
// via the backend API and Qubic Snap (if available).

// Function to get the buyer identity using Qubic Snap via MetaMask
export async function getQubicIdentity() {
  // Check if MetaMask is available
  if (!(window.ethereum && window.ethereum.isMetaMask)) {
    return null;
  }
  try {
    // Request public identity from the Qubic Snap
    const publicId = await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: 'npm:@qubic-lib/qubic-mm-snap', // Snap ID for Qubic
        request: {
          method: 'getPublicId',
          params: { accountIdx: 0, confirm: false }
        }
      }
    });
    console.log("Obtained Qubic Public ID:", publicId);
    return publicId;
  } catch (e) {
    console.warn("Failed to get identity from Qubic Snap:", e);
    return null;
  }
}

// Function to create a new agreement using the backend API
export async function createAgreement(service) {
  // Extract necessary data from the service object
  // Assume 'price' is provided in a human-readable format (e.g., 180 for 180 USDC)
  const { price, description } = service;
  
  // Set fixed seller identity as per requirements
  const seller = "WEVWZOHASCHODGRVRFKZCGUDGHEDWCAZIZXWBUHZEAMNVHKZPOIZKUEHNQSJ";
  
  // Get buyer identity from Qubic Snap (if available)
  const buyer = await getQubicIdentity();
  if (!buyer) {
    // Inform the user to connect their Qubic wallet
    alert("Please connect your Qubic wallet to proceed.");
    return null;
  }
  
  // Convert price to minimal units (assuming 6 decimals, e.g., USDC)
  const amount = Math.round(price * 1e6);
  
  // Calculate a deadline (current time + 7 days in milliseconds)
  // Note: In a real Qubic environment, you may want to calculate based on ticks.
  const deadline = Date.now() + (7 * 24 * 60 * 60 * 1000);
  
  // Build the payload for the API call
  const payload = {
    buyer,        // Qubic buyer identity (obtained from Snap)
    amount,       // Price in minimal units
    description,  // Service description
    deadline      // Deadline (as timestamp; backend should convert as needed)
  };
  
  try {
    // Call the backend API endpoint
    const response = await fetch('/api/createAgreement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error("Error creating agreement:", result.error);
      alert("Failed to create agreement: " + result.error);
      return null;
    }
    
    console.log("Agreement created successfully:", result);
    alert("Agreement created successfully on the Qubic blockchain!");
    return result;
    
  } catch (err) {
    console.error("Error connecting to the backend API:", err);
    alert("Connection error. Please try again later.");
    return null;
  }
}
