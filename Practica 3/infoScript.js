function populateTable(data) {
    const tableBody = document.querySelector('#personTable tbody');
    
    tableBody.innerHTML = '';

    for (let id in data) {
        if (data.hasOwnProperty(id)) {
            const person = data[id];

            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.textContent = person.name;
            row.appendChild(nameCell);

            const lastNameCell = document.createElement('td');
            lastNameCell.textContent = person.lastName;
            row.appendChild(lastNameCell);

            const ageCell = document.createElement('td');
            ageCell.textContent = person.age;
            row.appendChild(ageCell);

            const idCell = document.createElement('td');
            idCell.textContent = person.id;
            row.appendChild(idCell);

            tableBody.appendChild(row);
        }
    }
}

const data = JSON.parse(localStorage.getItem("peopleInfo"));

populateTable(data);