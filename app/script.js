// Declaring elements
let btn_search = document.getElementById("button-search");
let txt_search = document.getElementsByName("searchBox");
let table_result = document.getElementById("tbl-body-part-result");
let table = document.getElementById("table");

// Adding event listener for the search button
btn_search.addEventListener('click', async function () {

    // Getting the value of the search box
    let partNumber = txt_search[0].value;
    console.log(partNumber.toUpperCase());

    let url = `http://localhost:4000/fetch-data?partnumber=${partNumber.toUpperCase()}`;
    let data_response = await fetch(url);
    let data = await data_response.json();


    table_result.innerHTML = '';
    table.classList.remove('hidden');

    data.distributors.forEach(element => {
        let tr = document.createElement("tr");
        let td_distributer = document.createElement("td");
        let td_empty = document.createElement("td");

        td_distributer.textContent = element.distributor;
        tr.appendChild(td_distributer);
        tr.appendChild(td_empty);

        element.parts.forEach(part => {
            let partRowBreak = document.createElement("tr");

            let td_partNum = document.createElement("td");
            let td_man = document.createElement("td");
            let td_description = document.createElement("td");
            let td_price = document.createElement("td");
            let td_quantity = document.createElement("td");


            td_partNum.textContent = part.partNumber;
            td_man.textContent = part.manufacturer;
            td_description.textContent = part.description;
            td_price.textContent = part.price;
            td_quantity.textContent = part.quantity;


            partRowBreak.appendChild(td_partNum);
            partRowBreak.appendChild(td_man);
            partRowBreak.appendChild(td_description);
            partRowBreak.appendChild(td_price);
            partRowBreak.appendChild(td_quantity);
            td_empty.appendChild(partRowBreak);



        });
        table_result.appendChild(tr);



    });


    // // Create the row
    // let tr = document.createElement("tr");
    // // Creating the cells
    // let td_distributer = document.createElement("td");
    // let td_partNum = document.createElement("td");
    // let td_man = document.createElement("td");
    // let td_description = document.createElement("td");
    // let td_price = document.createElement("td");
    // let td_quantity = document.createElement("td");

    // // Assigning cells values
    // td_distributer.textContent = data.distributer;
    // td_partNum.textContent = data.partNumber;
    // td_man.textContent = data.manufacturer;
    // td_description.textContent = data.description;
    // td_price.textContent = data.price;
    // td_quantity.textContent = data.quantity;

    // tr.appendChild(td_distributer);
    // tr.appendChild(td_partNum);
    // tr.appendChild(td_man);
    // tr.appendChild(td_description);
    // tr.appendChild(td_price);
    // tr.appendChild(td_quantity);

    // table_result.appendChild(tr);


});
