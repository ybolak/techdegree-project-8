let employees = [];
const urlAPI = `https://randomuser.me/api/?results=12&inc=name, picture, email, location, phone, dob &noinfo &nat=US`;
const gridContainer = document.querySelector('.grid-container');
const overlay = document.querySelector('.overlay');
const modalContainer = document.querySelector('.modal-content');
const modalClose = document.querySelector('.modal-close');


fetch(urlAPI)
    .then(res => res.json())
    .then(res => res.results)
    .then(data => employees = data)
    .then(displayEmployees)
    .catch(err => console.log(err));


function displayEmployees (employeeData) {
    let employeeHTML = '';

    employeeData.forEach((employee, index) => {
        let name = employee.name;
        let email = employee.email;
        let city = employee.location.city;
        let picture = employee.picture;
     
        employeeHTML += `
            <div class="card" data-index="${index}">
                <img class="avatar" src="${picture.large}">
                <div class="text-container">
                    <h2 class="name">${name.first} ${name.last}</h2>
                    <p class="email">${email}</p>
                    <p class="address">${city}</p>
                </div>
            </div>
        `;
    });

    gridContainer.innerHTML = employeeHTML;
}


function displayModal (index) {
    let {name, dob, phone, email, location: {city, street, state, postcode}, picture} = employees[index];
    let date = new Date(dob.date);
    const modalHTML = `
        <div data-index="${index}">
            <img class="avatar" src="${picture.large}">
            <div class="text-container">
                <h2 class="name">${name.first} ${name.last}</h2>
                <p class="email">${email}</p>
                <p class="address">${city}</p>
                <hr />
                <div class="details">
                    <p>${phone}</p>
                    <p class="address">${street.number} ${street.name}, ${state} ${postcode}</p>
                    <p>Birthday: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
                </div>
            </div>
        </div>
    `;
    overlay.classList.remove('hidden');
    modalContainer.innerHTML = modalHTML;
}

gridContainer.addEventListener('click', e => {
    if(e.target !== gridContainer) {
        const card = e.target.closest('.card');
        const index = card.getAttribute('data-index');
        
        displayModal(index);
    }
});

modalClose.addEventListener('click', () => {
    overlay.classList.add('hidden');
});


/* ============================================= */
/*                 Search Bar                    */
/* ============================================= */

const searchBar = document.getElementById('searchBar');

searchBar.addEventListener('input', (e) => {
    let searchString = e.target.value.toLowerCase();
    const filteredEmployees = employees.filter((employee) => {
        return (
            employee.name.first.toLowerCase().includes(searchString) || 
            employee.name.last.toLowerCase().includes(searchString)
        );
    });
    displayEmployees(filteredEmployees);
});


/* ============================================= */
/*           Next and Previous Button            */
/* ============================================= */

const button = document.querySelector('.btn');

button.addEventListener('click', (e) => {
    if(e.target.tagName === 'BUTTON') {
        const card = e.target.parentElement.previousElementSibling.firstElementChild;
        let index = card.getAttribute('data-index');

        if(e.target.className === 'previous') {  
            if (index > 0) {         
                index--;
            } else if(index == 0) {
                index = 11;
            }
            displayModal(index); 
        } else {
            if (index < 11) {
                index++;
            } else if (index == 11) {
                index = 0;
            }
            displayModal(index);
        }
    }
});



