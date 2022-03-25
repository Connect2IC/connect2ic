// For the live demo
// the Principal or Account id is set in the URL as a query string
// Here's an example,
// http://demo.plugwallet.ooo/buy-me-a-coffee?id=cujev-3mrbh-xae&amount=4_000_000
const urlParams = new URLSearchParams(window.location.search);

// Receiver's account id
// a valid Principal ID or Account ID
const receiverAccountId = urlParams.get('id');

// Coffee amount in e8s
// fractional units of ICP tokens
// For example, 0.2 ICP is 20_000_000 e8s.
const coffeeAmount = Number(urlParams.get('amount').replaceAll('_', ''));

// Initialises the application listeners and handlers
function main() {
  const button = document.querySelector('#buy-me-coffee');
  button.addEventListener("click", onButtonPress);
}

// Button press handler
async function onButtonPress(el) {
  // Disables the button events (click)
  el.target.disabled = true;

  // Assigns the request for the Plug wallet connection
  // result value to `hasAllowed`
  const hasAllowed = await window.ic?.plug?.requestConnect();

  // If truthy proceeds to the next step (request balance)
  // otherwise updates the button text with failure message
  if (hasAllowed) {
    // Updates the button text
    el.target.textContent = "Plug wallet is connected";

    // Assigns the request balance result value to balance
    const requestBalanceResponse = await window.ic?.plug?.requestBalance();

    // Pick the balance value for the first account
    const balance = requestBalanceResponse[0]?.value;

    // Check if the current balance is at least the coffee cost
    // for the example only, we have not considered gas fees (in cycles)
    // If truthy proceeds to the next step (request transfer)
    // otherwise updates the button text with failure message
    if (balance > 0) {
      // Updates the button text
      el.target.textContent = "Plug wallet has enough balance";

      // Update the button text after a few seconds
      // of displaying the previous message `...enough balance`
      // while waiting for the `requestTransfer` to complete
      setTimeout(() => {
        el.target.textContent = "Requesting transfer...";
      }, 3000);

      // The argument that we'll pass on requestTransfer call
      const requestTransferArg = {
        to: receiverAccountId,
        amount: coffeeAmount,
      };

      // Assigns the request transfer result value to transfer
      const transfer = await window.ic?.plug?.requestTransfer(requestTransferArg);

      // Assigns the latest transaction status to a variable transferStatus
      const transferStatus = transfer?.transactions?.transactions[0]?.status;

      // On transfer, we update the button text
      // in accordance to the transfer state (success or failure)
      if (transferStatus === 'COMPLETED') {
        el.target.textContent = `Plug wallet transferred ${coffeeAmount} e8s`;
      } else if (transferStatus === 'PENDING') {
        el.target.textContent = "Plug wallet is pending.";
      } else {
        el.target.textContent = "Plug wallet failed to transfer";
      }
    } else {
      el.target.textContent = "Plug wallet doesn't have enough balance";
    }
  } else {
    el.target.textContent = "Plug wallet connection was refused";
  }

  // reset to initial state
  // after 5 seconds
  setTimeout(() => {
    el.target.disabled = false;
    el.target.textContent = "Buy me a coffee"
  }, 8000);
}

// Calls the Main function when the document is ready
document.addEventListener("DOMContentLoaded", main);