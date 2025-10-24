<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tribute to Virat Kohli</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            background-color: #f4f4f9;
            color: #333;
        }
        h1 {
            color: #ff4500;
        }
        img {
            width: 200px;
            border-radius: 50%;
            margin: 20px 0;
        }
        button {
            margin: 10px;
            padding: 10px 20px;
            font-size: 16px;
            background-color: #ff4500;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        button:hover {
            background-color: #d93a00;
        }
        select {
            padding: 10px;
            font-size: 16px;
            margin-top: 20px;
        }
        .achievements {
            margin-top: 30px;
            padding: 10px;
            background-color: #fff;
            border-radius: 8px;
            display: inline-block;
            text-align: left;
            max-width: 400px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>
    <h1>Tribute to Virat Kohli</h1>
    <img src="https://upload.wikimedia.org/wikipedia/commons/d/d1/Virat_Kohli_portrait.jpg" alt="Virat Kohli">

    <div>
        <button onclick="displayMessage('records')">Records as Batsman</button>
        <button onclick="displayMessage('captaincy')">Remarks on Captaincy</button>
    </div>

    <select id="format" onchange="displayFormatMessage()">
        <option value="">Select Cricket Format</option>
        <option value="ipl">IPL</option>
        <option value="odi">ODI</option>
        <option value="test">Test-Cricket</option>
    </select>

    <div class="achievements" id="achievements">
        <h3>Achievements</h3>
        <p><strong>IPL:</strong> Captained RCB for 8 seasons and scored over 6,000 runs.</p>
        <p><strong>ODI:</strong> Fastest to reach 10,000 runs in ODI cricket.</p>
    </div>

    <script>
        function displayMessage(type) {
            if (type === 'records') {
                alert("Virat Kohli holds the record for the fastest ODI century and has scored 70+ international centuries.");
            } else if (type === 'captaincy') {
                alert("Under his captaincy, India held the No. 1 spot in Test cricket for 42 months.");
            }
        }

        function displayFormatMessage() {
            const format = document.getElementById('format').value;
            let message = "";
            switch (format) {
                case "ipl":
                    message = "Virat Kohli is the highest run-scorer in IPL history.";
                    break;
                case "odi":
                    message = "Virat Kohli's ODI average is among the highest in the history of cricket.";
                    break;
                case "test":
                    message = "Virat Kohli has scored 7 double centuries in Test cricket.";
                    break;
                default:
                    message = "Select a format to see his achievement.";
            }
            alert(message);
        }
    </script>
</body>
</html>