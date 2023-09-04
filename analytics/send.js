const { WIN, A, CB, EP, EK } = require('./globals');
const ec = require('./eecClientEncrypt');
const afy = require('./asyncify');

// Function to send data to servers.
module.exports = CB && typeof WIN[CB] === 'function' && afy((...data) => WIN[CB].apply(WIN, data))
  || (A && (
  async (
    data, // data to send
    encryptionKey, // if true or a key, will encrypt using ECC Secp256k1 Encryption (aka Bitcoin encryption)
    uri = EP, // where to send it
    _ek = encryptionKey && typeof encryptionKey !== 'string' && EK || encryptionKey
  ) => {
    // Encrypt the data if needed.
    data = {
      accountId: A,
      ...data,
    };
    if (_ek) {
      try {
        data.userId && (data.userId = ec(data.userId, _ek));
        data.body && (data.body = ec(data.body, _ek));
        data.flag = 1;
      } catch (error) {
        // Could not encrypt the message.
        // It can happen with a probability of 1 / (2^256)
        return Promise.reject(error);
      }
    }

    // Try to stringify the content.
    // Could fail if data contains cycles.
    try {
      data = JSON.stringify(data);
    } catch (error) {
      // Handle the error
      // @Tristan: is it the best way to handle the error?
      console.error(error);
      return Promise.reject(error);
    }

    // Send data.
    return fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data
    })
      .then(response => response.json())
      .then(result => {
        // Handle the response
        // console.log(result);
        // console.log('Recorded', data);
        return result;
      })
      .catch(error => {
        // Handle the error
        // @Tristan: is it the best way to handle the error?
        console.error(error);
        return Promise.reject(error);
      });
  })
);