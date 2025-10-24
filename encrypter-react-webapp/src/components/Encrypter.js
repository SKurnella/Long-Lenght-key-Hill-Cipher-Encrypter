import React, { useState } from 'react';
import './Encrypter.css';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

export default function Encrypter() {

    const gcd_calculator = (a, b) => {
        while (b > 0) {
            let temp = a % b;
            a = b;
            b = temp;
        }
        return a;
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

    const key_validator = (key) => {
        let final_determinant = determinant(keyToAsciiSquareMatrix(key, Math.sqrt(key.length)));
        if (final_determinant < 0) {
            final_determinant += 97;
        }
        return gcd_calculator(final_determinant, 97) === 1;
    }

    const padder = (msg, key) => {
        let msg_length = msg.length;
        let key_length = key.length;
        if (msg_length % Math.ceil(Math.sqrt(key_length)) !== 0) {
            return msg.padEnd(
                msg_length + (Math.ceil(Math.sqrt(key_length)) - (msg_length % Math.ceil(Math.sqrt(key_length)))),
                ' '
            );
        }
        return msg;
    };

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
    };

    const keyToAsciiSquareMatrix = (str, n) => {
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
    };

    function multiplyMatrices(vector, matrix) {
        const n = vector.length;
        const result = new Array(n).fill(0);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                result[i] += vector[j] * matrix[j][i];
            }
        }
        for (let i = 0; i < result.length; i++) {
            result[i] = result[i] % 97;
        }
        return result;
    }

    function encrypt(msg, key) {
        let paddedString = padder(msg, key);
        let paddedMatrix = paddedStringToMatrix(paddedString, key.length);
        let keyMatrix = keyToAsciiSquareMatrix(key, Math.ceil(Math.sqrt(key.length)));
        let encryptedMatrix = [];
        for (let set of paddedMatrix) {
            encryptedMatrix.push(multiplyMatrices(set, keyMatrix));
        }
        let encryptedString = '';
        for (let row of encryptedMatrix) {
            for (let col of row) {
                encryptedString += String.fromCharCode(col + 31);
            }
        }
        return encryptedString;
    }

    const [textToCopy, setTextToCopy] = useState('');
    const [inputVisionStatus, setInputVisionStatus] = useState("password");
    const [keyVisionStatus, setKeyVisionStatus] = useState("password");
    const [visionLogo1, setVisionLogo1] = useState("fa-solid fa-eye");
    const [visionLogo2, setVisionLogo2] = useState("fa-solid fa-eye");
    const [inputValue, setInputValue] = useState("");
    const [outputVal, setOutputVal] = useState("");
    const [keyValue, setKeyValue] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVisible, setAlertVisible] = useState(false);
    const [copyAlertVisible, setCopyAlertVisible] = useState(false);

    const handleCopyClick = (e) => {
        e.preventDefault();
        setTextToCopy(keyValue);
        setCopyAlertVisible(true);
        setTimeout(() => {
            setCopyAlertVisible(false);
        }, 2000);
    };

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
        if (!keyValue || !checkedValue) {
            setAlertMessage("Fields cannot be empty");
            setAlertVisible(true);
            setTimeout(() => {
                setAlertVisible(false);
            }, 2000);
            return;
        }

        if (keyValue.length === 4 || keyValue.length === 9 || keyValue.length === 16) {
            if (key_validator(keyValue)) {
                let encryptedText = encrypt(checkedValue, keyValue);
                setOutputVal(encryptedText);
            } else {
                setAlertMessage("Invalid Key");
                setAlertVisible(true);
                setKeyValue("");
                setInputValue("");
                setTimeout(() => {
                    setAlertVisible(false);
                }, 2000);
            }
        } else {
            setAlertMessage("Invalid Key Length");
            setAlertVisible(true);
            setKeyValue("");
            setInputValue("");
            setTimeout(() => {
                setAlertVisible(false);
            }, 2000);
        }
    };

    return (
        <>
            <div className="container">
                <div className="form-box">
                    <h1 id="sign-in-up">ENCRYPTER</h1>
                    <form>
                        <div className="input-group">
                            <div className="input-field" id="name-field">
                                <i className="fa-solid fa-key"></i>
                                <input
                                    type={inputVisionStatus}
                                    value={inputValue}
                                    onChange={(val) => setInputValue(val.target.value)}
                                    placeholder="Enter the Key you want to Encrypt with"
                                />
                                <button className='copyButton' onClick={(event) => visionHandler(event, 1)}>
                                    <i className={visionLogo1}></i>
                                </button>
                            </div>

                            <div className="input-field">
                                <i className="fa-solid fa-lock-open"></i>
                                <input
                                    type={keyVisionStatus}
                                    value={keyValue}
                                    onChange={(val) => setKeyValue(val.target.value)}
                                    placeholder="Enter Text to be Encrypted"
                                />
                                <button className='copyButton' onClick={(event) => visionHandler(event, 2)}>
                                    <i className={visionLogo2}></i>
                                </button>
                            </div>
                            <div className="input-field">
                                <i className="fa-solid fa-lock"></i>
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
                            Encrypt
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
