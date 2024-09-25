const express = require('express');
const cors = require('cors');
const cheerio = require('cheerio'); // Cheerio for parsing HTML

const app = express();
const PORT = 4000;

app.use(cors());

app.get('/fetch-data', async (req, res) => {
  try {
    const partnumber = req.query.partnumber;
    const url = `https://www.alldatasheet.com/distributor/view.jsp?Searchword=${partnumber}`;

    // Fetch the external page
    const response = await fetch(url);
    const data = await response.text();

    // Load the HTML into Cheerio
    const $ = cheerio.load(data);

    // Use Cheerio to find elements
    const fetchedDistributer = $('div:nth-of-type(4) table:nth-of-type(2) tbody tr:nth-of-type(2) td:nth-of-type(1)');
    const fetchedPartNumber = $('div:nth-of-type(4) table:nth-of-type(2) tbody tr:nth-of-type(2) td:nth-of-type(2) a b');
    const fetchedMan = $('div:nth-of-type(4) table:nth-of-type(2) tbody tr:nth-of-type(2) td:nth-of-type(3)');
    const fetchedDescription = $('div:nth-of-type(4) table:nth-of-type(2) tbody tr:nth-of-type(2) td:nth-of-type(4)');
    const fetchedPrice = $('div:nth-of-type(4) table:nth-of-type(2) tbody tr:nth-of-type(2) td:nth-of-type(5) table tbody tr td');
    const fetchedQuantity = $('div:nth-of-type(4) table:nth-of-type(2) tbody tr:nth-of-type(2) td:nth-of-type(6)');

    // Extract the text content
    //console.log(targetElement);
    // console.log(fetchedDistributer.text());
    // console.log(fetchedPartNumber.text());
    // console.log(fetchedMan.text());
    // console.log(fetchedPrice.text());

    // Make some more processing on the Distributer name
    let processedData_Distributer = fetchedDistributer.text() || 'No data found';
    let firstDigitIndex = processedData_Distributer.search(/\d/); // Searching fpr the first digit
    let processedData_Distributer_filtered = processedData_Distributer.substring(0, firstDigitIndex);


    let processedData_PartNumber = fetchedPartNumber.text() || 'No data found';
    let processedData_Man = fetchedMan.text() || 'No data found';
    let processedData_Discription = fetchedDescription.text();
    let processedData_Price = fetchedPrice.text() || 'No data found';
    let processedData_Quantity = fetchedQuantity.text() || 'No data found';


    // Send the processed data back to the requester
    res.send({ 
        distributer: processedData_Distributer_filtered,
        partNumber: processedData_PartNumber,
        manufacturer: processedData_Man,
        description: processedData_Discription,
        price: processedData_Price,
        quantity: processedData_Quantity
    });

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch data' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
