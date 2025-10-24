const gcd_calculator = (a , b) => {
    while (b > 0) {
        let temp = a%b;
        
        a = b;
        b = temp;
    }
    return a;
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


const key_validator = (key) => {
        let final_determinant = determinant(keyToAsciiSquareMatrix(key , Math.sqrt(key.length)));
        final_determinant < 0 ? final_determinant += 97 : final_determinant;
        if(gcd_calculator(final_determinant , 97) == 1) {
            return true;
        }else {
            return false;
        }
}

const key_generator = (length) => {
        let key = "";
        while(key == "") {
            let dummy_key = "";
            for(let i = 0; i < length; i++) {
                let random_number = Math.floor(Math.random() * (127 - 32)) + 32;
                dummy_key += String.fromCharCode(random_number);
            }
            if(key_validator(dummy_key) == true) {
                key = dummy_key;
            }
        }
        console.log(key);
}
key_generator(4);

// let size = parseInt(prompt("Enter the size of the key : "));
// if(size === 4 || size === 9 || size === 16) {
//     key_generator(size);
// }
