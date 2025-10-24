const padder = (msg , key) => {
    let msg_length = msg.length;
    let key_length = key.length;
    if(msg_length % Math.ceil(Math.sqrt(key_length)) !== 0) {
        return msg.padEnd(msg_length + (Math.ceil(Math.sqrt(key_length)) - (msg_length % Math.ceil(Math.sqrt(key_length)))), '#');
    }
}

const minor = (matrix, row, col) => {
    const minorMatrix = [];
    for (let i = 0; i < matrix.length; i++) {
        if (i !== row) {
            const minorRow = [];
            for (let j = 0; j < matrix[i].length; j++) {
                if (j !== col) {
                    minorRow.push(matrix[i][j]);
                }
            }
            minorMatrix.push(minorRow);
        }
    }
    return minorMatrix;
}

const determinant = (matrix) => {
    const n = matrix.length;
    if (n === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
    if (n === 3) {
        return matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
               matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
               matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]);
    }
    if (n === 4) {
        let det = 0;
        for (let i = 0; i < 4; i++) {
            det += (i % 2 === 0 ? 1 : -1) * matrix[0][i] * determinant(minor(matrix, 0, i));
        }
        return det;
    }
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
const keyToAsciiSquareMatrix = (str) => {
    const n = Math.sqrt(str.length);
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

function adjointMatrix(matrix) {
    const n = matrix.length;

    if (n > 4 || matrix.some(row => row.length !== n)) {
        throw new Error("The function supports matrices up to 4x4.");
    }

    // Function to compute the minor matrix
    function minor(matrix, row, col) {
        const minorMatrix = matrix
            .filter((_, i) => i !== row)
            .map(row => row.filter((_, j) => j !== col));
        return minorMatrix;
    }

    // Function to compute the determinant of a matrix
    function determinant(matrix) {
        const n = matrix.length;
        if (n === 1) {
            return matrix[0][0];
        }
        if (n === 2) {
            return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        }
        if (n === 3) {
            return matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
                   matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
                   matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]);
        }
        if (n === 4) {
            let det = 0;
            for (let i = 0; i < 4; i++) {
                det += (i % 2 === 0 ? 1 : -1) * matrix[0][i] * determinant(minor(matrix, 0, i));
            }
            return det;
        }
        throw new Error("Matrix size not supported for determinant calculation.");
    }

    // Initialize the adjoint matrix
    const adjoint = Array.from({ length: n }, () => Array(n).fill(0));

    // Compute the cofactor matrix
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const minorMatrix = minor(matrix, i, j);
            const cofactor = determinant(minorMatrix);
            adjoint[j][i] = (i + j) % 2 === 0 ? cofactor : -cofactor; // Transpose while assigning
        }
    }

    return adjoint;
}




function multiplyMatrices(vector, matrix) {
    const n = vector.length;
    const result = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            result[i] += ((vector[j] * matrix[j][i]));
        }
    }
    result[0] = result[0] % 97;
    result[1] = result[1] % 97;
    return result;
}

const inverseFinder = (final_determinant) => {
    let r1 = 97 , r2 = final_determinant;
    let r, q = Math.floor(r1 / r2);
    let t1 = 0 , t2 = 1 , t = 0;
    while(r2 > 0) {
        r = r1 % r2;
        t = t1 - (t2 * q);
        r1 = r2;
        r2 = r;
        q = Math.floor(r1/r2);
        t1 = t2;
        t2 = t;
    }
    return t1;
}

const decodingKeyMatrixGenerator = (inverse , keyMatrix) => {
    for(let i = 0 ; i < keyMatrix.length ; i++) {
        for(let j = 0 ; j < keyMatrix[i].length ; j++){
            keyMatrix[i][j] = keyMatrix[i][j] * inverse;
            let floor = Math.floor(keyMatrix[i][j] / 97);
            keyMatrix[i][j] = keyMatrix[i][j] / 97;
            keyMatrix[i][j] = keyMatrix[i][j] - floor;
            keyMatrix[i][j] = Math.round(keyMatrix[i][j] * 97);

            if(keyMatrix[i][j] < 0) {
                keyMatrix += 97;
            }
        }
        
    }
    return keyMatrix;
}
const decrypt = (msg , key) => {
let keymatrix = keyToAsciiSquareMatrix(key);
let Determinant = determinant(keymatrix);
let decodingMatrixKey = decodingKeyMatrixGenerator(inverseFinder(Determinant) , adjointMatrix(keymatrix));
let textMatrix = paddedStringToMatrix(msg , key.length)
let decodedText = "";
for(let set of textMatrix) {
    let decodedSet = multiplyMatrices(set , decodingMatrixKey)
    for(let i=0 ; i<decodedSet.length ; i++) {
        decodedSet[i] = decodedSet[i] % 97;
        decodedText = decodedText + String.fromCharCode(decodedSet[i] + 31);
    }
}

console.log(decodedText)
}


decrypt("gbsUvPm3w*uE(c^8fI0##pc" , "M'lu;lce`ZawjX~d")