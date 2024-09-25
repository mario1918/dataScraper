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
    // const fetchedDistributer = $('div:nth-of-type(4) table:nth-of-type(2) tbody tr:nth-of-type(2) td:nth-of-type(1)');
    // const fetchedPartNumber = $('div:nth-of-type(4) table:nth-of-type(2) tbody tr:nth-of-type(2) td:nth-of-type(2) a b');
    // const fetchedMan = $('div:nth-of-type(4) table:nth-of-type(2) tbody tr:nth-of-type(2) td:nth-of-type(3)');
    // const fetchedDescription = $('div:nth-of-type(4) table:nth-of-type(2) tbody tr:nth-of-type(2) td:nth-of-type(4)');
    // const fetchedPrice = $('div:nth-of-type(4) table:nth-of-type(2) tbody tr:nth-of-type(2) td:nth-of-type(5) table tbody tr td');
    // const fetchedQuantity = $('div:nth-of-type(4) table:nth-of-type(2) tbody tr:nth-of-type(2) td:nth-of-type(6)');

    const distributors = [];

    // Traverse the table rows
    $('div:nth-of-type(4) table:nth-of-type(2) tbody tr').each((i, tr) => {
      const distributorCell = $(tr).find('td[valign="top"]');

      // If a distributor cell is found, we add the distributor to our array
      if (distributorCell.length > 0) {
        distributors.push({
          distributor: distributorCell.text().trim(),
          parts: []
        });


        // Check if there is already a distributor in the array before trying to add parts
        if (distributors.length > 0) {
          // Extract the part information from each row
          const partNumberCell = $(tr).find('td:nth-child(2)');
          const manufacturerCell = $(tr).find('td:nth-child(3)');
          const descriptionCell = $(tr).find('td:nth-child(4)');
          const priceCell = $(tr).find('td:nth-child(5)');
          const quantityCell = $(tr).find('td:nth-child(6)');

          // If there's a part number, it means this row contains part data
          if (partNumberCell.text().trim()) {
            const currentDistributor = distributors[distributors.length - 1];
            currentDistributor.parts.push({
              partNumber: partNumberCell.text().trim(),
              manufacturer: manufacturerCell.text().trim(),
              description: descriptionCell.text().trim(),
              price: priceCell.text().trim(),
              quantity: quantityCell.text().trim()
            });
          }
        }
      }
      else {
        if (distributors.length > 0) {
          // Extract the part information from each row
          const partNumberCell = $(tr).find('td:nth-child(1) a b');
          const manufacturerCell = $(tr).find('td:nth-child(2)');
          const descriptionCell = $(tr).find('td:nth-child(3)');
          const priceCell = $(tr).find('td:nth-child(4)');
          const quantityCell = $(tr).find('td:nth-child(5)');

          // If there's a part number, it means this row contains part data
          if (partNumberCell.text().trim()) {
            const currentDistributor = distributors[distributors.length - 1];
            currentDistributor.parts.push({
              partNumber: partNumberCell.text().trim(),
              manufacturer: manufacturerCell.text().trim(),
              description: descriptionCell.text().trim(),
              price: priceCell.text().trim(),
              quantity: quantityCell.text().trim()
            });
          }
        }

      }


    });


    res.send({

      distributors
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
