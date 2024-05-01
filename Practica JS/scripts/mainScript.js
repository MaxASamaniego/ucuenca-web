/*
NOTAS:
    - Para facilitar el proceso de prueba de la interfaz, las consultas y los hijos se generan de forma aleatoria:
        + Para los hijos, se escoge un número aleatorio n entre 0 y 5, este es el número de hijos, se calcula una edad máxima para
          los mismos, en este caso la edad del padre -15 años (en caso de que el paciente tenga 15 años o menos, no se agregan
          hijos). Se escogen n nombres de forma aleatoria de la lista predefinida *names* y se escogen edades aleatorias entre 0 y
          la edad máxima calculada.
        + Para las consultas, se escoge un número aleatorio n entre 0 y 20 que será el número de consultas. Para cada consulta, se
          escoge un motivo aleatorio de la lista *motives* y una fecha aleatoria entre la fecha de nacimiento del paciente y la
          fecha actual.

    - Al cambiar el tema entre claro y oscuro, el texto tarda mucho más en realizar la transición, esto es un bug de los navegadores
      basados en Chromium (funciona bien en Firefox) que aparentemente tiene que ver con la acumulación del tiempo de transición
      de elementos padres a hijos al definir la transición de forma global.

    - El usuario de prueba (Felix Elgato) tiene datos no validados debido a que fueron incrustados directamente en el código
      únicamente con fines demostrativos.
*/

const countries = {
    "ec": {
        name: "Ecuador",
        cities: ["Cuenca", "Machala"]
    },
    "mx": {
        name: "México",
        cities: ["Guadalajara", "Monterrey"]
    },
    "us": {
        name: "Estados Unidos",
        cities: ["Nueva York", "Washington DC"]
    }
}

const names = [
"Samson Butler",
"Jace Moon",
"Addisyn Wise",
"Hope Melendez",
"Clara Stuart",
"Magdalena Boone",
"Xander Branch",
"Sarahi Huerta",
"Jose Haley",
"Urijah Mcdonald",
"Gavin Mclaughlin",
"Sasha Fuentes"
]

const motives = [
    "Chequeo general",
    "Cirugía",
    "Enfermedad"
]

function random(min, max) {
    return Math.floor((Math.random() * max) + min);
}

function getRandomNonRepeatingElements(array, n) {
    const shuffledArray = array.slice();
    
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    
    return shuffledArray.slice(0, n);
}

function randomChoice(arr) {
    return arr[Math.floor(arr.length * Math.random())];
}

function randomDate(minDate) {
    const today = new Date();
    const minDateTime = new Date(minDate);

    const timeDiff = today.getTime() - minDateTime.getTime();

    const randomTime = Math.floor(Math.random() * timeDiff);
    const randomDateTime = new Date(minDateTime.getTime() + randomTime);

    return randomDateTime;
}

function isEven(n) {
    return (n & 1) === 0;
}

function validateID(id) {
    if (id.length != 10) {
        return false;
    }

    const digits = id.slice(0, 9).split("")
    const verification = id[9];
    let values = []

    for (let i = 0; i < digits.length; i++) {
        if (isEven(i)) {
            const val = Number(digits[i]) * 2
            values.push(val > 9 ? val - 9 : val)
        } else {
            values.push(Number(digits[i]))
        }
    }

    let result = values.reduce((acc, current) => acc + current) % 10;

    return verification == (10 - result)%10;
}

class Patient {
    constructor(name, lastName, id, country, city, address, phone, birthDate, profilePic) {
        this.update(name, lastName, id, country, city, address, phone, birthDate, profilePic)
    }

    update(name, lastName, id, country, city, address, phone, birthDate, profilePic) {
        this.name = name;
        this.lastName = lastName;
        this.id = id;
        this.country = country;
        this.city = city;
        this.address = address;
        this.phone = phone;
        this.birthDate = new Date(birthDate);
        this.age = undefined;
        this.profilePic = profilePic;
        this.consults = undefined;
        this.children = undefined;
    }

    getAge() {
        if(this.age === undefined) {
            const currentDate = new Date();

            const timeDiff = currentDate.getTime() - this.birthDate.getTime();

            const msInYear = 1000 * 60 * 60 * 24 * 365.25;
            const msInMonth = msInYear / 12;
            const msInDay = 1000 * 60 * 60 * 24;

            const years = Math.floor(timeDiff / msInYear);
            const months = Math.floor((timeDiff % msInYear) / msInMonth);
            const days = Math.floor(((timeDiff % msInYear) % msInMonth) / msInDay);
            const hours = Math.floor((((timeDiff % msInYear) % msInMonth) % msInDay) / (1000 * 60 * 60));

            this.age = {
                years: years,
                months: months,
                days: days,
                hours: hours
            };
        }

        return this.age;
    }

    getBirthDate() {
        return `${this.birthDate.getDate()}/${this.birthDate.getMonth() + 1}/${this.birthDate.getFullYear()}`;
    }

    getBirthHour() {
        return `${this.birthDate.getHours()}H${this.birthDate.getMinutes()}`;
    }

    getConsults() {
        if (this.consults === undefined) {
            this.consults = []
            const consultsNumber = random(0, 20);

            if (consultsNumber === 0) {
                this.consults.push({
                    motive: "Sin registros",
                    date: "-",
                    time: "-"
                })
                return this.consults;
            }

            for (let i = 0; i < consultsNumber; i++) {
                const consultDate = randomDate(this.birthDate);
                const day = consultDate.getDate();
                const month = consultDate.getMonth();
                const hours = consultDate.getHours();
                const minutes = consultDate.getMinutes();

                const date = `${day < 10 ? "0" + day : day}/${month < 10 ? "0" + month : month}/${consultDate.getFullYear()}`;
                const time = `${hours < 10 ? "0" + hours : hours}H${minutes < 10 ? "0" + minutes : minutes}`;

                this.consults.push({
                    motive: randomChoice(motives),
                    date: date,
                    time: time
                })
            }


            this.consults.sort((a, b) => {
                const date1 = a.date.split('/');
                const date2 = b.date.split('/');

                const time1 = a.time.split('H');
                const time2 = b.time.split('H');

                const years = [Number(date1[2]), Number(date2[2])];
                const months = [Number(date1[1]), Number(date2[1])];
                const days = [Number(date1[0]), Number(date2[0])];
                const hours = [Number(time1[0]), Number(time2[0])];
                const minutes = [Number(time1[1]), Number(time2[1])];

                const result =  (
                    (years[0] - years[1]) * 10000 + 
                    (months[0] - months[1]) * 1000 + 
                    (days[0] - days[1]) * 100 + 
                    (hours[0] - hours[1]) * 10 + 
                    (minutes[0] - minutes[1])
                );

                return result;
            });
        }

        return this.consults;
    }

    getChildren() {
        if (this.children === undefined) {
            this.children = [];
            const childrenNumber = random(0, 5);
            let maxAge = this.getAge().years - 15;

            if (childrenNumber === 0 || maxAge <= 0) {
                this.children.push({
                    name: "Sin registros",
                    age: "-"
                })
                return this.children;
            }

            let childrenNames = getRandomNonRepeatingElements(names, childrenNumber);

            for (let i = 0; i < childrenNames.length; i++) {
                this.children.push({
                    name: childrenNames[i].split(" ")[0] + " " + this.lastName,
                    age: random(0, maxAge)
                });
            }

            this.children.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
        }

        return this.children;
    }

    personalInfoHTML() {
        const ageMap = this.getAge();

        let profPic;
        
        if (this.profilePic !== ""){
            profPic = `<img id="profile-pic" src="${this.profilePic}" alt="Foto de perfil">`;
        } else {
            profPic = userDefault.replace(`id="user-icon"`, `id="profile-pic"`);
        }

        return `
            <div class="gr-responsive-container l-gradient-border">
                <div id="pi-container" class="highlight-container">
                    ${profPic}
                    <span id="name" class="title">${this.name} ${this.lastName}</span>
                    <div id="pi-h-sep" class="h-separator"></div>
                    <div id="pi-v-sep" class="v-separator"></div>
                    <span id="id"><b>ID: ${this.id}</b></span>
                    <span id="country"><b>País: ${this.country}</b></span>
                    <span id="city"><b>Ciudad: ${this.city}</b></span>
                    <span id="address"><b>Dirección: ${this.address}</b></span>
                    <span id="phone"><b>Teléfono: ${this.phone}</b></span>
                    <span id="birth-date"><b>Fecha de nacimiento: ${this.getBirthDate()}</b></span>
                    <span id="birth-time"><b>Hora de nacimiento: ${this.getBirthHour()}</b></span>
                    <span id="age"><b>Edad: ${ageMap.years} años ${ageMap.months} meses ${ageMap.days} días ${ageMap.hours} horas</b></span>
                </div>
            </div>
        `;
    }

    consultsHTML() {
        let consultData = "";

        this.getConsults().forEach(consult => {
            consultData += `<tr>
                <td>${consult.motive}</td>
                <td class="centered-td">${consult.date}</td>
                <td class="centered-td">${consult.time}</td>
            </tr>`;
        });

        return `<div class="gr-responsive-container l-gradient-border">
            <table id="consult-table" class="rounded-table">
                <thead>
                    <tr id="table-header">
                        <th>Motivo de consulta</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                    </tr>
                </thead>

                <tbody>
                    ${consultData}
                </tbody>
            </table>
        </div>`
    }

    childrenHTML() {
        let childrenData = "";

        this.getChildren().forEach(child => {
            childrenData += `<tr>
                <td>${child.name}</td>
                <td>${child.age}</td>
            </tr>`;
        });

        return `<div class="gr-responsive-container l-gradient-border">
            <table id="children-table" class="rounded-table">
                <thead>
                    <tr id="table-header">
                        <th>Nombre</th>
                        <th class="centered-td">Edad</th>
                    </tr>
                </thead>

                <tbody>
                    ${childrenData}
                </tbody>
            </table>
        </div>`;
    }
}

const testUser = new Patient("Felix", "Elgato", "0000000000", "Ecuador", "Cuenca", "N/A", "0000000000", "1999-11-24T11:25", "assets/imgs/cat.png")
const users = [];

users.push(testUser)

const userDefault = `
    <svg id="user-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM15 9C15 10.6569 13.6569 12 12 12C10.3431 12 9 10.6569 9 9C9 7.34315 10.3431 6 12 6C13.6569 6 15 7.34315 15 9ZM12 20.5C13.784 20.5 15.4397 19.9504 16.8069 19.0112C17.4108 18.5964 17.6688 17.8062 17.3178 17.1632C16.59 15.8303 15.0902 15 11.9999 15C8.90969 15 7.40997 15.8302 6.68214 17.1632C6.33105 17.8062 6.5891 18.5963 7.19296 19.0111C8.56018 19.9503 10.2159 20.5 12 20.5Z"/>
    </svg>
`

const dataEditHTML = `
<div id="form-root-container" class="gr-responsive-container l-gradient-border">
    <div class="highlight-container">
        <form id="form" action="#" method="post">
            <label class="visually-hidden" for="name-input">Nombre</label>
            <input name="name" type="text" id="name-input" placeholder="Nombre" pattern=".{2,}" required>

            <label class="visually-hidden" for="last-name-input">Apellido</label>
            <input name="lastName" type="text" id="last-name-input" placeholder="Apellido" pattern=".{2,}" required>

            <label class="visually-hidden" for="id-input">Identificación</label>
            <input name="id" type="number" id="id-input" placeholder="Identificación" pattern="[0-9]{10}" required>

            <label class="visually-hidden" for="phone-input">Teléfono</label>
            <input name="phone" type="tel" id="phone-input" placeholder="Teléfono" pattern="[0-9]{10}" required>

            <div id="birthdate-div">
                <label id="birthdate-label" for="birthdate-input">Fecha de nacimiento: </label>
                <input type="datetime-local" id="birthdate-input" required>
            </div>

            <label class="visually-hidden" for="address-input">Dirección</label>
            <input name="address" type="text" id="address-input" placeholder="Dirección" pattern=".{2,}" required>

            <label class="visually-hidden" for="city-select">Ciudad</label>
            <select name="city" id="city-select"></select>

            <label class="visually-hidden" for="country-select">País</label>
            <select name="country" id="country-select">
                <option value="ec">Ecuador</option>
                <option value="mx">México</option>
                <option value="us">Estados Unidos</option>
            </select>

            <div id="edit-v-sep" class="v-separator"></div>
            <div id="edit-h-sep" class="h-separator"></div>

            <img id="profile-image" src=""/>

            <label id="image-label" class="accented-button" for="image-input">Subir imagen</label>
            <input type="file" id="image-input">
            <button type="submit" id="submit-button" class="accented-button">Guardar</button>
        </form>
    </div>
</div>
`

document.addEventListener("DOMContentLoaded", () => {
    const themeButton = document.getElementById("theme-button");
    const themeIconSunrays = document.getElementById("theme-icon-sunrays");
    const themeIconBody = document.getElementById("theme-icon-body");
    const allElements = document.querySelector("*");

    let darkTheme = false;

    themeButton.addEventListener("click", () => {
        themeIconSunrays.classList.toggle("active");
        themeIconBody.classList.toggle("active");

        darkTheme = !darkTheme

        if (darkTheme) {
            allElements.classList.add("dark-theme");
            allElements.classList.remove("light-theme");
        } else {
            allElements.classList.add("light-theme");
            allElements.classList.remove("dark-theme");
        }
    });

    const menuButton = document.getElementById("menu-button");
    const sideMenu = document.getElementById("sm-sticky");
    const menuIcon = document.getElementById("menu-icon");

    const personalInfoMenuItem = document.getElementById("info-menu-item");
    const consultMenuItem = document.getElementById("consult-menu-item");
    const childrenMenuItem = document.getElementById("children-menu-item");

    const mainContent = document.querySelector("main");

    const editButton = document.getElementById("edit-button");

    menuButton.addEventListener("click", () => {
        sideMenu.classList.toggle("active");
        menuIcon.classList.toggle("active");
    });

    document.body.addEventListener("click", (event) => {
        if (!sideMenu.contains(event.target) && !menuButton.contains(event.target)) {
            sideMenu.classList.remove("active");
            menuIcon.classList.remove("active");
        }
    });

    let changeContent = (newContent) => {
        mainContent.innerHTML = newContent;
    };

    let currentUser = testUser;

    personalInfoMenuItem.addEventListener("click", () => {
        personalInfoMenuItem.classList.add("active");
        consultMenuItem.classList.remove("active");
        childrenMenuItem.classList.remove("active");

        editButton.classList.remove("hidden");

        changeContent(currentUser.personalInfoHTML());
    });

    consultMenuItem.addEventListener("click", () => {
        personalInfoMenuItem.classList.remove("active");
        consultMenuItem.classList.add("active");
        childrenMenuItem.classList.remove("active");

        editButton.classList.add("hidden");

        changeContent(currentUser.consultsHTML())
    });

    childrenMenuItem.addEventListener("click", () => {
        personalInfoMenuItem.classList.remove("active");
        consultMenuItem.classList.remove("active");
        childrenMenuItem.classList.add("active");

        editButton.classList.add("hidden");

        changeContent(currentUser.childrenHTML())
    });

    const userContainer = document.getElementById("users-container");
    const userMenu = document.getElementById("users-menu");
    const userButton = document.getElementById("user-button");

    const setUserButtonImage = () => {
        if (currentUser.profilePic === "") {
            userButton.innerHTML = userDefault;
        } else {
            userButton.innerHTML = `<img class="header-avatar" src="${currentUser.profilePic}"/>`
        }
    };

    let callback = () => {};

    const displayUser = () => {
        personalInfoMenuItem.classList.add("active");
        consultMenuItem.classList.remove("active");
        childrenMenuItem.classList.remove("active");

        editButton.classList.remove("hidden");

        menuButton.classList.remove("hidden");
        setUserButtonImage();
        userButton.classList.remove("hidden");

        changeContent(currentUser.personalInfoHTML());
    };

    const populateUsers = () => {
        userMenu.innerHTML = "";

        users.forEach(user => {
            let image = ""

            if (user.profilePic === "") {
                image = userDefault.replace(`id="user-icon"`, `class="menu-avatar"`);
            } else {
                image = `<img src="${user.profilePic}" class="menu-avatar">`
            }

            const span = document.createElement("span")
            span.innerHTML = `${user.name} ${user.lastName}`;

            const userOption = document.createElement("div");
            userOption.classList.add("user-option");
            userOption.innerHTML = `${image}`;

            userOption.appendChild(span);

            userMenu.appendChild(userOption);

            span.addEventListener("click", () => {
                currentUser = user;
                displayUser();
                callback();
            })
        });
    };

    userButton.addEventListener("click", (event) => {
        const x = event.clientX;
        const y = event.clientY;

        populateUsers();

        userContainer.style.position = "absolute";
        userContainer.style.left = `${x}px`;
        userContainer.style.top = `${y}px`;

        const header = document.querySelector("header");
        header.appendChild(userContainer);
        callback = () => {
            header.removeChild(userContainer)
        }
    });

    populateUsers();

    const addUser = document.getElementById("add-user");
    addUser.addEventListener("click", () => {
        currentUser = undefined;
        editMode();
        callback();
    });

    let form;
    let editMode = () => {
        changeContent(dataEditHTML);
        editButton.classList.add("hidden");
        const imageInput = document.getElementById("image-input");

        imageInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
    
            if (file) {
                const reader = new FileReader();
    
                reader.onload = function(e) {
                    document.getElementById("profile-image").src = e.target.result;
                };
    
                reader.readAsDataURL(file);
            }
        });

        form = document.getElementById("form");

        const countrySelect = document.getElementById("country-select");

        const populateCities = () => {
            const val = countrySelect.value

            const citySelect = document.getElementById("city-select");
            while (citySelect.options.length > 0) citySelect.remove(0);

            countries[val].cities.forEach(element => {
                const opt = document.createElement("option");
                opt.value = element;
                opt.innerHTML = element;

                citySelect.appendChild(opt);
            });
        }

        populateCities();

        countrySelect.addEventListener("change", () => {
            populateCities();
        });

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            if (form.checkValidity()) {
                const name = document.getElementById("name-input").value;
                const lastName = document.getElementById("last-name-input").value;
                const id = document.getElementById("id-input").value;
                const phone = document.getElementById("phone-input").value;
                const birthdate = document.getElementById("birthdate-input").value;
                const address = document.getElementById("address-input").value;
                const countrySelect = document.getElementById("country-select");
                const country = countrySelect.options[countrySelect.selectedIndex].text;
                const citySelect = document.getElementById("city-select");
                const city = citySelect.options[citySelect.selectedIndex].text
                const profilePic = document.getElementById("profile-image").getAttribute("src");

                if (country === countries["ec"].name && !validateID(id)) {
                    alert("El valor ingresado no es una cédula ecuatoriana válida.");
                    return;
                }

                if (currentUser === undefined) {
                    currentUser = new Patient(name, lastName, id, country, city, address, phone, birthdate, profilePic);
                    users.push(currentUser);
                } else {
                    currentUser.update(name, lastName, id, phone, birthdate, address, country, city, profilePic);
                }

                const userButton = document.getElementById("user-button");

                if (currentUser.profilePic === "") {
                    userButton.innerHTML = userDefault;
                } else {
                    userButton.innerHTML = `<img class="header-avatar" src="${currentUser.profilePic}"/>`
                }

                displayUser();
            };
        });
    }

    const parseDateTimeLocal = (date) => {
        const dateCopy = new Date(date.getTime());
        dateCopy.setMinutes(dateCopy.getMinutes() - dateCopy.getTimezoneOffset());
        return dateCopy.toISOString().slice(0,16);
    }

    editButton.addEventListener("click", () => {
        editMode();
        
        const nameInput = document.getElementById("name-input");
        nameInput.value = currentUser.name;

        const lastNameInput = document.getElementById("last-name-input");
        lastNameInput.value = currentUser.lastName;

        const idInput = document.getElementById("id-input");
        idInput.value = currentUser.id;

        const phoneInput = document.getElementById("phone-input");
        phoneInput.value = currentUser.phone;

        const birthdateInput = document.getElementById("birthdate-input");
        birthdateInput.value = parseDateTimeLocal(currentUser.birthDate);
        
        const addressInput = document.getElementById("address-input");
        addressInput.value = currentUser.address;

        const countryInput = document.getElementById("country-select");
        for (const country in countries) {
            if (countries[country] === currentUser.country) {
                countryInput.value = element;
            }
        }

        const cityInput = document.getElementById("city-select");
        cityInput.value = currentUser.city;

        const profileImage = document.getElementById("profile-image");
        profileImage.src = currentUser.profilePic;
    });
});