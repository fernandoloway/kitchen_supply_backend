
'use strict';

const crypto = require('crypto');

const ENCRYPTION_KEY = 'XwPp9xazJ0ku5CZnlmgAx2Dld8SHkAeT'; // Must be 256 bytes (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text) {
 let iv = crypto.randomBytes(IV_LENGTH);
 let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
 let encrypted = cipher.update(text);

 encrypted = Buffer.concat([encrypted, cipher.final()]);

 return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
 let textParts = text.split(':');
 let iv = new Buffer(textParts.shift(), 'hex');
 let encryptedText = new Buffer(textParts.join(':'), 'hex');
 let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
 let decrypted = decipher.update(encryptedText);

 decrypted = Buffer.concat([decrypted, decipher.final()]);

 return decrypted.toString();
}

module.exports = {
    encrypt: encrypt,
    decrypt: decrypt
}



// console.log(encrypt('12345'))

// console.log(decrypt('e914c602354e598ddc4080eb75271fd0:4cc0b210cc402e5fe3d660e0b6b114ab'))

