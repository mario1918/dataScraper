const express = require('express');
const cors = require('cors');
const DOMParser = require('xmldom').DOMParser;

const app = express();
const PORT = 4000;
app.use(cors());
// Route to call external URL and return processed data to the requester
app.get('/fetch-data', async (req, res) => {
  try {
    const partnumber = req.query.partnumber
    // Example: External URL to fetch data from
    const url = `https://www.alldatasheet.com/distributor/view.jsp?Searchword=${partnumber}`;

    //app.use(express.json());
 

    // Fetch data from the external URL
    const response = await fetch(url);
    let data = await response.text();
    console.log('data: ' + data)
    data = data.replace(/\n/g, '');;
    const dom = data;

    //const parser = new DOMParser();
    //const document = await parser.parseFromString(dom,'text/html');

    
    const parser = new DOMParser();
    const document = await parser.parseFromString(dom,'text/html')


    const divElements = await document.getElementsByTagNameNS("*","div");
    for(let i=0;i<divElements.length;i++){
        console.log();
        console.log("dev Element: " + i + divElements[i].textContent) 
        //console.log(divElements[i].textContent);
    }
    
    

     processedData = data;
    console.log("processedData");
    // Send the processed data back to the requester
    res.send(processedData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch data' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});