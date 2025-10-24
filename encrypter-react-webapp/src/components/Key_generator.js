import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './Key_generator.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function KeyGenerator() {
    const gcd_calculator = (a, b) => {
        while (b > 0) {
            let temp = a % b;
            a = b;
            b = temp;
        }
        return a;
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
    };

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
    };

    const key_validator = (key) => {
        let final_determinant = determinant(keyToAsciiSquareMatrix(key, Math.sqrt(key.length)));
        if (final_determinant < 0) {
            final_determinant += 97;
        }
        return gcd_calculator(final_determinant, 97) === 1;
    };

    const key_generator = (length) => {
        let key = "";
        while (key === "") {
            let dummy_key = "";
            for (let i = 0; i < length; i++) {
                let random_number = Math.floor(Math.random() * (127 - 32)) + 32;
                dummy_key += String.fromCharCode(random_number);
            }
            if (key_validator(dummy_key)) {
                key = dummy_key;
            }
        }
        return key;
    };

    const [checkedValue, setCheckedValue] = useState(4);
    const [keyValue, setKeyValue] = useState("Your Key");
    const [textToCopy, setTextToCopy] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [loaderStyle, setLoaderStyle] = useState({
        maxHeight: "0px",
        color: "transparent",
        display: "none",
    });

    const handleClick = (checkedValue) => {
        console.log(checkedValue);
        let key = key_generator(checkedValue);
        setLoaderStyle({ maxHeight: "200px", });
        setTimeout(() => {
            setKeyValue(key);
            setLoaderStyle({ display: "none", cursor: "wait", });
        }, checkedValue * 250);
        setTextToCopy(key);
        console.log(key);
    };

    const handleCopyClick = (e) => {
        e.preventDefault();
        setTextToCopy(keyValue);
        setAlertVisible(true);
        setTimeout(() => {
            setAlertVisible(false);
        }, 2000);
    };

    return (
        <>
            <div className="container">
                <div className="form-box">
                    <h1 id="sign-in-up">KEY GENERATOR</h1>
                    <form>
                        <div className="input-group">
                            <div className="input-field" id="name-field">
                                <CopyToClipboard text={textToCopy}>
                                    <button className='copyButton' onClick={handleCopyClick}>
                                        <i className="fa-solid fa-copy"></i>
                                    </button>
                                </CopyToClipboard>
                                <label className='label'>{keyValue}</label>
                                <div className="center" style={loaderStyle}>
                                    <div className="wave"></div>
                                    <div className="wave"></div>
                                    <div className="wave"></div>
                                    <div className="wave"></div>
                                    <div className="wave"></div>
                                    <div className="wave"></div>
                                    <div className="wave"></div>
                                    <div className="wave"></div>
                                    <div className="wave"></div>
                                    <div className="wave"></div>
                                </div>
                            </div>
                        </div>
                        <div className='keysize-group'>
                            <input id="4" type="radio" name='size' value='4' onChange={val => setCheckedValue(parseInt(val.target.value))}></input>
                            <label htmlFor="4">4</label>
                            <input id="9" type="radio" name='size' value='9' onChange={val => setCheckedValue(parseInt(val.target.value))}></input>
                            <label htmlFor="9">9</label>
                            <input id="16" type="radio" name='size' value='16' onChange={val => setCheckedValue(parseInt(val.target.value))}></input>
                            <label htmlFor="16">16</label>
                        </div>
                    </form>
                    <div className="submit">
                        <button onClick={() => handleClick(checkedValue)} id="submitBtn">Generate</button>
                    </div>
                    {alertVisible && (
                        <div className="alert alert-success mt-3" role="alert">
                            Text copied to clipboard!
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
