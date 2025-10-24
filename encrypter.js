const padder = (msg , key) => {
    let msg_length = msg.length;
    let key_length = key.length;
    if(msg_length % Math.ceil(Math.sqrt(key_length)) !== 0) {
        return msg.padEnd(msg_length + (Math.ceil(Math.sqrt(key_length)) - (msg_length % Math.ceil(Math.sqrt(key_length)))), ' ');
    }
    return msg;
}

const paddedStringToMatrix = (paddedString , key_length) => {
    let paddedMatrix = [];
    for(let i=0 ; i<paddedString.length ; i+=Math.ceil(Math.sqrt(key_length))) {
        let row=[];
        for(let j=0 ; j<Math.ceil(Math.sqrt(key_length)) ; j++) {
            row[j] = paddedString.charCodeAt(i+j) - 31;
        }
        paddedMatrix.push(row);
    }
    return paddedMatrix;
}

const keyToAsciiSquareMatrix = (str , n) => {
    const len = str.length;
    const paddedStr = str.padEnd(n * n, ' ');

    const matrix = [];
    for (let i = 0; i < n; i++) {
        const row = [];
        for (let j = 0; j < n; j++) {
            row.push(paddedStr.charCodeAt(i * n + j) - 31);
        }
        matrix.push(row);
    }
    return matrix;
}

function multiplyMatrices(vector, matrix) {
    const n = vector.length;
    const result = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            result[i] += ((vector[j] * matrix[j][i]));
        }
    }
    for(let i=0 ; i<result.length ; i++) {
        result[i] = result[i] % 97;
    }
    return result;
}

function encrypt(msg, key) {
    let paddedString = padder(msg , key);
    let paddedMatrix = paddedStringToMatrix(paddedString , key.length);
    let keyMatrix = keyToAsciiSquareMatrix(key , Math.ceil(Math.sqrt(key.length)));
    let encrptedMatrix = [];
    for(let set of paddedMatrix) {
        encrptedMatrix.push(multiplyMatrices(set , keyMatrix));
    }
    let encryptedString = '';
    for(let row of encrptedMatrix) {
        for(let col of row) {
            encryptedString += String.fromCharCode(col+31);
        }
    }
    console.log(encryptedString);
}

encrypt("This is a sample text" , "M'lu;lce`ZawjX~d");



