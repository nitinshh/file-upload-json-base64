const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

// Increase payload limit
app.use(express.json({ limit: "10mb" })); // Increase limit to 10MB
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/get", (req, res) => {
    res.render("test");
});

app.post('/upload', (req, res) => {
    try {
        const { name, image } = req.body;  // Extract name and image
        // console.log("ffffff", req.body)
        // return

        if (!image) {
            return res.status(400).send("No image provided");
        }

        // Extract image type from Base64 string
        const mimeType = image.match(/^data:(image\/\w+);base64,/);
        const extension = mimeType ? mimeType[1].split("/")[1] : "jpg";
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");  // Remove header

        const buffer = Buffer.from(base64Data, 'base64');
        const filePath = path.join(__dirname, 'uploads', `${Date.now()}-image.${extension}`);

        // Save the file to the server
        fs.writeFile(filePath, buffer, (err) => {
            if (err) {
                return res.status(500).send("Error saving image");
            }

            res.json({
                success: true,
                message: "Image uploaded successfully",
                filePath: filePath
            });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error occurred", error });
    }
});

// Create the uploads directory if it doesn't exist
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

const port = 3001;
app.listen(port, () => {
    console.log(`Server run on port ${port}`);
});
