class Person {
    constructor(name, lastName, age, id) {
        this.name = name;
        this.lastName = lastName;
        this.age = age;
        this.id = id;
    }
}

fetch("./test.json").then((response) => {localStorage.setItem("peopleInfo", JSON.stringify(response.json))});

const personDict = {};

const nameInput = document.getElementById("name-input");
const lastNameInput = document.getElementById("lastname-input");
const ageInput = document.getElementById("age-input");
const idInput = document.getElementById("id-input");

const personForm = document.getElementById("person-form");

personForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value;
    const lastName = lastNameInput.value;
    const age = parseInt(ageInput.value);
    const id = idInput.value;

    const person = new Person(name, lastName, age, id);

    if (id in personDict) {
        alert("Registro actualizado");
    } else {
        alert("Registro creado");
    }

    personDict[id] = person;
    localStorage.setItem("peopleInfo", JSON.stringify(personDict));
});