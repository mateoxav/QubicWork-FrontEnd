// backend/server.js

// Import required modules
const express = require('express');
const { exec } = require('child_process');
const app = express();

// Middleware to parse JSON bodies in requests
app.use(express.json());

// Qubic CLI and contract configuration variables
const CONTRACT_IDENTITY = "MARKETPLACE"; // Contract identifier (name or public key)
const NODE_IP = "194.164.234.92";          // Qubic node IP from deployment info
const NODE_PORT = "31841";                 // Qubic node port from deployment info
const PRIVATE_KEY = process.env.QUBIC_PRIVKEY; // Private key from environment variable
const SELLER_ID = "WEVWZOHASCHODGRVRFKZCGUDGHEDWCAZIZXWBUHZEAMNVHKZPOIZKUEHNQSJ"; // Fixed seller identity

// Endpoint to create a new agreement in the Marketplace contract
app.post('/api/createAgreement', async (req, res) => {
  try {
    // Destructure request payload
    const { buyer, amount, description, deadline } = req.body;

    // Validate required fields
    if (!buyer || !amount || !description || !deadline) {
      return res.status(400).json({ error: "Incomplete data for CreateAgreement" });
    }

    // Convert amount to hex (uint64: 8 bytes) and pad it
    const amountHex = Number(amount).toString(16).padStart(16, '0');

    // Convert description to hex (UTF-8)
    let descHex = Buffer.from(description, 'utf8').toString('hex');
    // Optionally: adjust or pad description to meet fixed size if needed

    // Convert deadline to hex (uint32: 4 bytes) and pad it
    const deadlineHex = Number(deadline).toString(16).padStart(8, '0');

    // For buyer and seller, assume they are already in the required string/hex format
    const buyerHex = buyer; // Buyer obtained from Qubic Snap
    const sellerHex = SELLER_ID; // Fixed seller identity

    // Concatenate parameters for the CreateAgreement input struct in order:
    // buyer | seller | amount | description | deadline
    const inputDataHex = buyerHex + sellerHex + amountHex + descHex + deadlineHex;
    
    // Calculate the input size in bytes (each 2 hex characters = 1 byte)
    const inputSizeBytes = inputDataHex.length / 2;
    
    // Function index for CreateAgreement in the contract (assumed to be 0)
    const functionIndex = 0;
    
    // Build the Qubic CLI command
    // Command structure:
    // qubic-cli -nodeip <NODE_IP> -nodeport <NODE_PORT> -privatekey <PRIVATE_KEY>
    //   -sendcustomtransaction <CONTRACT_IDENTITY> <functionIndex> <AMOUNT_SENT> <inputSizeBytes> <inputDataHex>
    const cliCommand = `qubic-cli -nodeip ${NODE_IP} -nodeport ${NODE_PORT} -privatekey ${PRIVATE_KEY} ` +
                       `-sendcustomtransaction ${CONTRACT_IDENTITY} ${functionIndex} 0 ${inputSizeBytes} ${inputDataHex}`;
    
    // Execute the CLI command
    exec(cliCommand, (error, stdout, stderr) => {
      if (error || stderr) {
        console.error("Qubic CLI error:", error || stderr);
        return res.status(500).json({ error: "Contract invocation failed: " + (error ? error.message : stderr) });
      }
      console.log("Qubic CLI output:", stdout);
      return res.json({ success: true, result: stdout.trim() });
    });
    
  } catch (err) {
    console.error("Unexpected backend error:", err);
    res.status(500).json({ error: "Internal server error while processing the request." });
  }
});

// Start the server on port 4000 (or any port you choose)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Qubic API server listening on port ${PORT}`));

