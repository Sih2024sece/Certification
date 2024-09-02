import { create } from 'ipfs-http-client';
import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt'; // Import your RSA library or implementation

const STATIC_RSA_PUBLIC_KEY = "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUF0NWxZb3FXdW4yQ3FBZkpmZDBCQwplNnlabDNtQ1pNMFhGdVpIVG91ZG1GcS96cXlYeGJvYlRFNW1UY3FCbUlIQm9Cd0FtWHMwTUZUdThtSUpMNVE3CjdvR3owbkFHUmRqeXJZWk55aVA5aUxKK1ZFT0s2OEE2bWgrNUJHMFhXbmN2OXVLZENaMkI4ZWdsVlBVTG1sSjUKTzJTNjBDbDlSeU5ubGxGb1pUTWp5cC9EdGFmdks1eVlLMmhyTFVaQnlnenRKWjVuNDZ0YTBGUDFzR0dYTmxLbAphZndidWpLZEphdE1aczRubkQvM2E4WFhodUxja09EMHlrSTJtMGJGc2Y4dDQ0VDVhVkpYek01ckhVWkVLQVFxClZ5Zlp1UWdRVExUV3NKaHF0aWd6K2UrT1JRZzNuQ1FMMXVUWk03RlZPT3dHQ1M3Nzhuell2ODh6ZzVzNVArZ0cKTndJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg=="
const STATIC_RSA_PRIVATE_KEY = "LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFb2dJQkFBS0NBUUVBdDVsWW9xV3VuMkNxQWZKZmQwQkNlNnlabDNtQ1pNMFhGdVpIVG91ZG1GcS96cXlYCnhib2JURTVtVGNxQm1JSEJvQndBbVhzME1GVHU4bUlKTDVRNzdvR3owbkFHUmRqeXJZWk55aVA5aUxKK1ZFT0sKNjhBNm1oKzVCRzBYV25jdjl1S2RDWjJCOGVnbFZQVUxtbEo1TzJTNjBDbDlSeU5ubGxGb1pUTWp5cC9EdGFmdgpLNXlZSzJockxVWkJ5Z3p0Slo1bjQ2dGEwRlAxc0dHWE5sS2xhZndidWpLZEphdE1aczRubkQvM2E4WFhodUxjCmtPRDB5a0kybTBiRnNmOHQ0NFQ1YVZKWHpNNXJIVVpFS0FRcVZ5Zlp1UWdRVExUV3NKaHF0aWd6K2UrT1JRZzMKbkNRTDF1VFpNN0ZWT093R0NTNzc4bnpZdjg4emc1czVQK2dHTndJREFRQUJBb0lCQUFaZXBzYkFDSzZqYS9ZWQpWRkU5SFkzUVZNaCt2WENvMlI0cnFJdU82Q0xkcFYzU3dlQ1RxelJ6c1cxL1lVWTFvNVdXMmpzam5VcHBpTlR5CnVhc3h2NmlNVGNSVGoyd25SdUxKd2NqUTJkYy9HYU95NFU3UGtUeDV3dkdSTTVMVCtQdmVENkVKZmtxV05CcEIKdmZKZDNnZW8vSnJuTzlEelN1U1M2YkN2emlKYzJPdEdFMFo3V1k3UU0waWdQYWpEckhFR0tZcmdkN25STjV2YQpJaFVseXc4WGtqSFFpVGlUa3RhM1lyWkwvR3phUm5TcWZiNWF1TzJDZjRhdUNUNGhWWWw3UEw5TjRreDYzK3RKCkt5am1MSDVDQXJxd1BXRDlURUhwUTFsb1U1REE0WE81N213Y1BXRDN3VGlucEEwa25lbjE3RXVUY29tOE81RzkKbVU4clF1RUNnWUVBODlqS01BcStjMGpVOUhTRytDVTRYSE1wd2p4WkZOQmtDMzQrcXd0ZzF5Q3BTTXIrWGJuegpTQk1OckZ0dDZRanplNHZzTlRUT1dvNkppWnprTGJ6UmVqeTlXMFJnVW44REUrMDgzNTA0R1RUaXlCT0JYRHFGClA5MnU5K0Q0U0ZkS3k1S3oyWVlLZlFUa0drWHJSQU85amZtUVk4ZTRIZ2p5VW5abnkzVm5vbUVDZ1lFQXdML2MKdWs0NlM0eEFuNlNYT1NyaDArZHNsVVlFVDhOWVFkaWVTckdOOGlRRnlUQjhxN3VlYVgwUThSdmY3ZzJaYVBRaAorVXlleTlKMnN5ZFVjbmlvTk9iQUhHajkzL3VkWldzbVFuYWVUR1ZDeGxoQzNDUFpWNFk4UGdJdHZaQnc5VXRJCjMyK1VKVGZZVGZFU3QrRDdkWUFQU0FwRmNHQ3JUZzROS1VNTm41Y0NnWUJZK1d4azlUYWl5QnQwQ3lUSVhJUmgKTDJBNFVGN011bkVXeEh6SFdvSitYSnVJUlJGbFQ1bFdYaVZxRTM1YVBucmhSSi91bGhNSmRlTDNoSGk1dTZEUApzbVFCYmtTYk5WOEJJVnBKMllzRG40bDBLYkhVM2tHS21TL2pvSUhYbTRwZUYyeHFYWDlzT0tHbWVJYXNyWlMzCnZpMFNTMmlDQlErdVNTZjhWQjE1WVFLQmdIUTV2UUZpZG1oanMvd1BwVmhGY1ZMenMxZjNsbFg2ZHRlTnBUVnAKQnl6QlovTy9GdzMrM2pEQngxdDc4WFY4SWN0Vm1yN1c0dElJb0thNnlvTVVHbWw3MHMvT3gzY3VJK1NwemJJNgpFSTRFYVZWc2x6UmpNWVZEWGtRTjBFTUVPL2pOWXEzSWZFNU05Rk5iVUd3c2I3U1VlYUo0L3hJYVdIR0NxNUQ3CjY5VVZBb0dBUG0wY1hZUE1JYWlMT3NxL2NlWEVTdkRCYXJoMTdnWlZkanZMZHl6cFJEb3pxTkxqTnJmZ3NuYlEKQlBqbFc5dXpZckZKUFNiVERKY1FlbG5lTHk5QVRiQVFCWmJrQ1poQktnV0x5OHp6V05nUkRJNHo0d0NIdjhKZAp6VDllUVVlVjhWVG1VMEM1WGt1S0hUTHhMaGw5VzcxMENqOHNjUjZwNUZEdVFHeEczY2s9Ci0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0tCg=="
const STATIC_AES_KEY = "9a2fee989d4b19968110854d7709913ad52b76177af3eb06a9df184dee3d30a7"
const STATIC_IV = "9280083303e7dddc185f66f342ec4863"

const ipfs = create({
  host: 'localhost',
  port: '5001',
  protocol: 'http',
});
function removeTillComma(str) {
  // Find the index of the comma
  const commaIndex = str.indexOf(',');

  // If comma is found, return the substring after the comma
  if (commaIndex !== -1) {
    return str.substring(commaIndex + 1).trim();
  }

  // If no comma is found, return the original string
  return str;
}

function base64ToUint8Array(base64String) {
  // Decode the base64 string
  const binaryString = atob(base64String);

  // Create a Uint8Array from the binary string
  const length = binaryString.length;
  const bytes = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
}

async function decryptFile(encryptedFileData, aesKey , iv) {


  if (!aesKey) {
      throw new Error('Failed to decrypt AES key');
  }

  // Decrypt the file data with AES
  const decrypted = CryptoJS.AES.decrypt(encryptedFileData, CryptoJS.enc.Hex.parse(aesKey), {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CFB,
      padding: CryptoJS.pad.NoPadding,
  }).toString(CryptoJS.enc.Utf8);

  const imageString = removeTillComma(decrypted)

  console.log("Decrypted file contents",removeTillComma(decrypted))

  // Convert the decrypted data to a Uint8Array
  const byteArray = base64ToUint8Array(imageString)

  return byteArray;
}

export default async function getAndDecryptFile(_fileInfo) {
  console.log("in getAndDecryptFile", _fileInfo);
  const { fileHash, encryptedAesKey } = _fileInfo;

  try {
    const stream = ipfs.cat(fileHash);
    let encryptedData = '';

    for await (const chunk of stream) {
      encryptedData += new TextDecoder().decode(chunk);
    }

    console.log(encryptedData)

    const decryptedContent = await decryptFile(encryptedData, STATIC_AES_KEY, STATIC_IV);
    console.log("decrypted file", decryptedContent);

    // Step 1: Convert Uint8Array to Blob
    const blob = new Blob([decryptedContent], { type: 'image/jpeg' }); // Adjust the MIME type if needed

    // Step 2: Create an object URL from the Blob
    const url = URL.createObjectURL(blob);

    // Open the image in a new tab
    window.open(url, '_blank');

    return url;
  } catch (error) {
    console.error('Error retrieving or decrypting file:', error);
    throw new Error('Failed to retrieve or decrypt the file.');
  }
}
