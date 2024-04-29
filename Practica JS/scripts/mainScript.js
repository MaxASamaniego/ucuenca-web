const countries = [{
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
}]

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
            const childrenNumber = 0//random(0, 5);

            if (childrenNumber === 0) {
                this.children.push({
                    name: "Sin registros",
                    age: "-"
                })
                return this.children;
            }

            let childrenNames = getRandomNonRepeatingElements(names, childrenNumber);
            let maxAge = this.getAge().years - 15;

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

        return `
            <div id="pi-container" class="gr-responsive-container l-gradient-border">
                <img id="profile-pic" src="${this.profilePic}" alt="Foto de perfil">
                <span id="name" class="title">${this.name} ${this.lastName}</span>
                <div class="h-separator"></div>
                <div class="v-separator"></div>
                <span><b>ID: ${this.id}</b></span>
                <span><b>País: ${this.country}</b></span>
                <span><b>Ciudad: ${this.city}</b></span>
                <span><b>Dirección: ${this.address}</b></span>
                <span><b>Teléfono: ${this.phone}</b></span>
                <span><b>Fecha de nacimiento: ${this.getBirthDate()}</b></span>
                <span><b>Hora de nacimiento: ${this.getBirthHour()}</b></span>
                <span><b>Edad: ${ageMap.years} años ${ageMap.months} meses ${ageMap.days} días ${ageMap.hours} horas</b></span>
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

const testUser = new Patient("Felix", "Elgato", "0000000000", "Ecuador", "Cuenca", "N/A", "000000000", "1999-11-24T11:25", "assets/imgs/cat.png")

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

    editButton.addEventListener("click", () => {
        changeContent(`Yet another PLACEHOLDER. :D`);
    });
});