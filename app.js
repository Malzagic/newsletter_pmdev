const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    const { firstName, lastName, email } = req.body;

    // change api keys to .env 
    const apiKey = process.env.API_KEY;
    const audienceID = process.env.AUDIENCE_ID;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                },
            }
        ],
    }

    const jsonData = JSON.stringify(data);

    const url = `https://us21.api.mailchimp.com/3.0/lists/${audienceID}`;
    const options = {
        method: "POST",
        auth: `przemek2142@gmail.com:${apiKey}`,
    }

    const request = https.request(url, options, (response) => {

        response.on("data", (data) => {
            const getData = JSON.parse(data)

            if (getData.error_count === 1) res.sendFile(__dirname + "/failure.html");
            else res.sendFile(__dirname + "/success.html");
        });
    });

    request.write(jsonData);
    request.end();

});

app.post("/failure", (req, res) => {
    res.redirect("/")
});

app.listen(port, () => {
    console.log(`Server is running at: ${port} port`);
});