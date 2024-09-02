import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';// Import your RSA library or implementation

const STATIC_RSA_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr3t0V6G+lBfWq3hiz5d7
fYcGxsbdVmsQb+XQoXoi/N+fVcOeMwYbhImbmMvD3/W0+lA9Db9xeiwZFrGjeoxO
eP3NzZHRJppH6S3GsKAs4xsDJy7sf4zPbMyJQNzQyOUvD3/Y0MWImmgLRoNOkfjf
K90...
-----END PUBLIC KEY-----`;

const STATIC_RSA_PRIVATE_KEY = "LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFb2dJQkFBS0NBUUVBdDVsWW9xV3VuMkNxQWZKZmQwQkNlNnlabDNtQ1pNMFhGdVpIVG91ZG1GcS96cXlYCnhib2JURTVtVGNxQm1JSEJvQndBbVhzME1GVHU4bUlKTDVRNzdvR3owbkFHUmRqeXJZWk55aVA5aUxKK1ZFT0sKNjhBNm1oKzVCRzBYV25jdjl1S2RDWjJCOGVnbFZQVUxtbEo1TzJTNjBDbDlSeU5ubGxGb1pUTWp5cC9EdGFmdgpLNXlZSzJockxVWkJ5Z3p0Slo1bjQ2dGEwRlAxc0dHWE5sS2xhZndidWpLZEphdE1aczRubkQvM2E4WFhodUxjCmtPRDB5a0kybTBiRnNmOHQ0NFQ1YVZKWHpNNXJIVVpFS0FRcVZ5Zlp1UWdRVExUV3NKaHF0aWd6K2UrT1JRZzMKbkNRTDF1VFpNN0ZWT093R0NTNzc4bnpZdjg4emc1czVQK2dHTndJREFRQUJBb0lCQUFaZXBzYkFDSzZqYS9ZWQpWRkU5SFkzUVZNaCt2WENvMlI0cnFJdU82Q0xkcFYzU3dlQ1RxelJ6c1cxL1lVWTFvNVdXMmpzam5VcHBpTlR5CnVhc3h2NmlNVGNSVGoyd25SdUxKd2NqUTJkYy9HYU95NFU3UGtUeDV3dkdSTTVMVCtQdmVENkVKZmtxV05CcEIKdmZKZDNnZW8vSnJuTzlEelN1U1M2YkN2emlKYzJPdEdFMFo3V1k3UU0waWdQYWpEckhFR0tZcmdkN25STjV2YQpJaFVseXc4WGtqSFFpVGlUa3RhM1lyWkwvR3phUm5TcWZiNWF1TzJDZjRhdUNUNGhWWWw3UEw5TjRreDYzK3RKCkt5am1MSDVDQXJxd1BXRDlURUhwUTFsb1U1REE0WE81N213Y1BXRDN3VGlucEEwa25lbjE3RXVUY29tOE81RzkKbVU4clF1RUNnWUVBODlqS01BcStjMGpVOUhTRytDVTRYSE1wd2p4WkZOQmtDMzQrcXd0ZzF5Q3BTTXIrWGJuegpTQk1OckZ0dDZRanplNHZzTlRUT1dvNkppWnprTGJ6UmVqeTlXMFJnVW44REUrMDgzNTA0R1RUaXlCT0JYRHFGClA5MnU5K0Q0U0ZkS3k1S3oyWVlLZlFUa0drWHJSQU85amZtUVk4ZTRIZ2p5VW5abnkzVm5vbUVDZ1lFQXdML2MKdWs0NlM0eEFuNlNYT1NyaDArZHNsVVlFVDhOWVFkaWVTckdOOGlRRnlUQjhxN3VlYVgwUThSdmY3ZzJaYVBRaAorVXlleTlKMnN5ZFVjbmlvTk9iQUhHajkzL3VkWldzbVFuYWVUR1ZDeGxoQzNDUFpWNFk4UGdJdHZaQnc5VXRJCjMyK1VKVGZZVGZFU3QrRDdkWUFQU0FwRmNHQ3JUZzROS1VNTm41Y0NnWUJZK1d4azlUYWl5QnQwQ3lUSVhJUmgKTDJBNFVGN011bkVXeEh6SFdvSitYSnVJUlJGbFQ1bFdYaVZxRTM1YVBucmhSSi91bGhNSmRlTDNoSGk1dTZEUApzbVFCYmtTYk5WOEJJVnBKMllzRG40bDBLYkhVM2tHS21TL2pvSUhYbTRwZUYyeHFYWDlzT0tHbWVJYXNyWlMzCnZpMFNTMmlDQlErdVNTZjhWQjE1WVFLQmdIUTV2UUZpZG1oanMvd1BwVmhGY1ZMenMxZjNsbFg2ZHRlTnBUVnAKQnl6QlovTy9GdzMrM2pEQngxdDc4WFY4SWN0Vm1yN1c0dElJb0thNnlvTVVHbWw3MHMvT3gzY3VJK1NwemJJNgpFSTRFYVZWc2x6UmpNWVZEWGtRTjBFTUVPL2pOWXEzSWZFNU05Rk5iVUd3c2I3U1VlYUo0L3hJYVdIR0NxNUQ3CjY5VVZBb0dBUG0wY1hZUE1JYWlMT3NxL2NlWEVTdkRCYXJoMTdnWlZkanZMZHl6cFJEb3pxTkxqTnJmZ3NuYlEKQlBqbFc5dXpZckZKUFNiVERKY1FlbG5lTHk5QVRiQVFCWmJrQ1poQktnV0x5OHp6V05nUkRJNHo0d0NIdjhKZAp6VDllUVVlVjhWVG1VMEM1WGt1S0hUTHhMaGw5VzcxMENqOHNjUjZwNUZEdVFHeEczY2s9Ci0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0tCg=="
const STATIC_AES_KEY = "9a2fee989d4b19968110854d7709913ad52b76177af3eb06a9df184dee3d30a7"
const STATIC_IV = "9280083303e7dddc185f66f342ec4863"

export default async function FileEncrypt(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const fileData = reader.result;

            // Encrypt the file data with static AES key
            const encryptedFileData = CryptoJS.AES.encrypt(fileData, CryptoJS.enc.Hex.parse(STATIC_AES_KEY), {
                iv: CryptoJS.enc.Hex.parse(STATIC_IV),
                mode: CryptoJS.mode.CFB,
                padding: CryptoJS.pad.NoPadding,
            }).toString();

            // Encrypt the static AES key with RSA public key using JSEncrypt
            try {

                // Prepare the result
                const result = {
                    file: encryptedFileData
                }

                resolve(result);
            } catch (error) {
                console.error("Encryption error:", error);
                reject(error);
            }
        };

        reader.onerror = (error) => reject(error);

        reader.readAsDataURL(file);  // Read file data as base64
    });
}
