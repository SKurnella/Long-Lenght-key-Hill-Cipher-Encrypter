import React, { useState } from 'react';
import './Decrypter.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import CopyToClipboard from 'react-copy-to-clipboard';
export default function Decrypter() {
    const padder = (msg, key) => {
        let msg_length = msg.length;
        let key_length = key.length;
        if (msg_length % Math.ceil(Math.sqrt(key_length)) !== 0) {
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

    const paddedStringToMatrix = (paddedString, key_length) => {
        let paddedMatrix = [];
        for (let i = 0; i < paddedString.length; i += Math.ceil(Math.sqrt(key_length))) {
            let row = [];
            for (let j = 0; j < Math.ceil(Math.sqrt(key_length)); j++) {
                row[j] = paddedString.charCodeAt(i + j) - 31;
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
        for (let i = 0; i < result.length; i++) {
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

    const inverseFinder = (final_determinant) => {
        let r1 = 97, r2 = final_determinant;
        let r, q = Math.floor(r1 / r2);
        let t1 = 0, t2 = 1, t = 0;
        while (r2 > 0) {
            r = r1 % r2;
            t = t1 - (t2 * q);
            r1 = r2;
            r2 = r;
            q = Math.floor(r1 / r2);
            t1 = t2;
            t2 = t;
        }
        return t1;
    }

    const decodingKeyMatrixGenerator = (inverse, keyMatrix) => {
        for (let i = 0; i < keyMatrix.length; i++) {
            for (let j = 0; j < keyMatrix[i].length; j++) {
                keyMatrix[i][j] = keyMatrix[i][j] * inverse;
                let floor = Math.floor(keyMatrix[i][j] / 97);
                keyMatrix[i][j] = keyMatrix[i][j] / 97;
                keyMatrix[i][j] = keyMatrix[i][j] - floor;
                keyMatrix[i][j] = Math.round(keyMatrix[i][j] * 97);

                if (keyMatrix[i][j] < 0) {
                    keyMatrix[i][j] += 97;
                }
            }
        }
        return keyMatrix;
    }

    const decrypt = (msg, key) => {
        let keymatrix = keyToAsciiSquareMatrix(key);
        let Determinant = determinant(keymatrix);
        let decodingMatrixKey = decodingKeyMatrixGenerator(inverseFinder(Determinant), adjointMatrix(keymatrix));
        let textMatrix = paddedStringToMatrix(msg, key.length)
        let decodedText = "";
        for (let set of textMatrix) {
            let decodedSet = multiplyMatrices(set, decodingMatrixKey)
            for (let i = 0; i < decodedSet.length; i++) {
                decodedSet[i] = decodedSet[i] % 97;
                decodedText = decodedText + String.fromCharCode(decodedSet[i] + 31);
            }
        }

        console.log(decodedText)
        return (decodedText)
    }

    const [inputVisionStatus, setInputVisionStatus] = useState("password");
    const [keyVisionStatus, setKeyVisionStatus] = useState("password");
    const [visionLogo1, setVisionLogo1] = useState("fa-solid fa-eye");
    const [visionLogo2, setVisionLogo2] = useState("fa-solid fa-eye");
    const [inputValue, setInputValue] = useState("");
    const [outputVal, setOutputVal] = useState("");
    const [keyValue, setKeyValue] = useState("");
    const [alertVisible, setAlertVisible] = useState(false);
    const [copyAlertVisible, setCopyAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const visionHandler = (event, button) => {
        event.preventDefault();
        if (button === 1) {
            if (inputVisionStatus === "password") {
                setInputVisionStatus("text");
                setVisionLogo1("fa-solid fa-eye-slash");
            } else {
                setInputVisionStatus("password");
                setVisionLogo1("fa-solid fa-eye");
            }
        } else if (button === 2) {
            if (keyVisionStatus === "password") {
                setKeyVisionStatus("text");
                setVisionLogo2("fa-solid fa-eye-slash");
            } else {
                setKeyVisionStatus("password");
                setVisionLogo2("fa-solid fa-eye");
            }
        }
    }

    const handleClick = (keyValue, checkedValue) => {
        if (keyValue.length === 4 || keyValue.length === 9 || keyValue.length === 16) {
            let encryptedText = decrypt(checkedValue, keyValue);
            setOutputVal(encryptedText);
        } else {
            setAlertMessage("Invalid Key");
            setAlertVisible(true);
            setTimeout(() => {
                setAlertVisible(false);
            }, 2000);
        }
    };

    const handleCopyClick = () => {
        navigator.clipboard.writeText(outputVal)
            .then(() => {
                setCopyAlertVisible(true);
                setTimeout(() => {
                    setCopyAlertVisible(false);
                }, 2000);
            })
            .catch(() => {
                setAlertMessage("Failed to copy text");
                setAlertVisible(true);
                setTimeout(() => {
                    setAlertVisible(false);
                }, 2000);
            });
    };

    return (
        <>
            <div className="container">
                <div className="form-box">
                    <h1 id="sign-in-up">DECRYPTER</h1>
                    <form>
                        <div className="input-group">
                            <div className="input-field" id="name-field">
                                <i className="fa-solid fa-key"></i>
                                <input
                                    type={inputVisionStatus}
                                    onChange={(val) => setInputValue(val.target.value)}
                                    placeholder="Enter the Key you want to Decrypt with"
                                />
                                <button className='copyButton' onClick={(event) => visionHandler(event, 1)}>
                                    <i className={visionLogo1}></i>
                                </button>
                            </div>
                            <div className="input-field">
                                <i className="fa-solid fa-lock"></i>
                                <input
                                    type={keyVisionStatus}
                                    onChange={(val) => setKeyValue(val.target.value)}
                                    placeholder="Enter Text to be Encrypted"
                                />
                                <button className='copyButton' onClick={(event) => visionHandler(event, 2)}>
                                    <i className={visionLogo2}></i>
                                </button>
                            </div>
                            <div className="input-field">
                                <i className="fa-solid fa-lock-open"></i>
                                <label className='label'>{outputVal}</label>
                                <CopyToClipboard text={outputVal}>
                                    <button className='copyButton' onClick={handleCopyClick}>
                                        <i className="fa-solid fa-copy"></i>
                                    </button>
                                </CopyToClipboard>
                            </div>
                        </div>
                    </form>
                    <div className="submit">
                        <button onClick={() => handleClick(inputValue, keyValue)} id="submitBtn">
                            Decrypt
                        </button>
                    </div>
                    {alertVisible && (
                        <div className="alert alert-danger mt-3 alert-dismissible fade show" role="alert">
                            {alertMessage}
                            <button type="button" className="btn-close" aria-label="Close" onClick={() => setAlertVisible(false)}></button>
                        </div>
                    )}
                    {copyAlertVisible && (
                        <div className="alert alert-success mt-3 alert-dismissible fade show" role="alert">
                            Text copied to clipboard!
                            <button type="button" className="btn-close" aria-label="Close" onClick={() => setCopyAlertVisible(false)}></button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
