const optionsDiv = document.getElementById("options-div");

function findOptionIndex(inputElement) {
    return Array.prototype.indexOf.call(optionsDiv.children, inputElement);
}

function dynamicInputsListener(parent, inputElement) {
    inputElement.addEventListener("input", (e) => {
        const value = e.target.value;
        const index = findOptionIndex(inputElement);
        const childrenLength = parent.children.length;

        if (value.length === 0) {
            parent.removeChild(inputElement);

            parent.lastChild.placeholder = `Opción ${childrenLength - 1}`;
            
            if (index === childrenLength - 2) {
                parent.lastChild.focus();
            }
        }else if (index === childrenLength - 1) {
            const optionInput = document.createElement("input");
            optionInput.classList.add("block")
            optionInput.type = "text";
            optionInput.name = "option";
            optionInput.placeholder = `Opción ${childrenLength + 1}`;
            parent.appendChild(optionInput);

            dynamicInputsListener(parent, optionInput);
        }
    });
}

dynamicInputsListener(optionsDiv, document.getElementById("option"));

function setVisible(element, visible) {
    if (visible) {
        element.classList.remove("hidden");
    } else {
        element.classList.add("hidden");
    }
}

const textRadio = document.getElementById("text-question");
const trueFalseRadio = document.getElementById("true-false-question");
const multipleOptionRadio = document.getElementById("multiple-question");

textRadio.addEventListener("input", () => {
    setVisible(optionsDiv, false);
});

trueFalseRadio.addEventListener("input", () => {
    setVisible(optionsDiv, false);
});

multipleOptionRadio.addEventListener("input", (e) => {
    setVisible(optionsDiv, true);
});

const questionNumberForm = document.getElementById("question-number");
const questionTypeForm = document.getElementById("question-type-form");
const questionnaireForm = document.getElementById("questionnaire");

function getFormData(form) {
    return Object.fromEntries(new FormData(form).entries());
}

let questionNumber;

questionNumberForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (questionNumberForm.checkValidity()) {
        const data = getFormData(questionNumberForm);
        questionNumber = Number(data.number);

        setVisible(questionNumberForm, false);
        setVisible(questionTypeForm, true);
    }
});

let questionCount = 1;
const questions = []

questionTypeForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (questionTypeForm.checkValidity()) {
        const data = getFormData(questionTypeForm);
        const questionInputElement = document.getElementById("question-input");

        const question = document.createElement("label");
        question.classList.add("block");
        question.innerHTML = `<b>${data.question}</b><br>`;

        questions.push(data.question)

        let questionInput;

        switch (data.questionType) {
            case "text":
                questionInput = `
                    ${data.question}<br>
                    <input type="text" name="answer${questionCount}" placeholder="Su respuesta" required>
                `;
                break;
        
            case "trueFalse":
                questionInput = `
                ${data.question}<br>
                <label class="block">
                    <input type="radio" name="answer${questionCount}" value="true" required>
                    Verdadero
                </label>
                <label class="block">
                    <input type="radio" name="answer${questionCount}" value="false" required>
                    Falso
                </label>
                `;
                break;

            case "multiple":
                questionInput = `${data.question}<br>`;

                const optionInputs = document.querySelectorAll('input[name="option"]');

                let optionCount = 0;

                optionInputs.forEach((input) => {
                    if (input.value === '') {
                        return;
                    }
                    questionInput += `
                    <label class="block">
                        <input class="oneRequiredCheck" type="checkbox" name="answer${questionCount}" value="${input.value}">
                        ${input.value}
                    </label>
                    `;
                    optionCount++;
                });

                if (optionCount <= 1) {
                    alert("Ingrese al menos dos opciones")
                    return;
                }

                break;

            default:
                throw new Error("Invalid question type!")
        }

        const questionsDiv = document.getElementById("questions-div");

        const div = document.createElement("div");
        div.innerHTML += questionInput;

        questionsDiv.appendChild(div);
        setVisible(questionnaireForm, true);
        questionInputElement.value = "";
        questionInputElement.focus();
        
        if(questionCount === questionNumber) {
            setVisible(questionTypeForm, false);
            setVisible(document.getElementById("answer-button"), true);
        }
        
        questionCount++;
    }
});

const resultDiv = document.getElementById("results");

questionnaireForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (questionnaireForm.checkValidity()) {
        const data = {};

        for (const [name, value] of new FormData(questionnaireForm).entries()) {
            if (!data[name]) {
                data[name] = []
            }

            data[name].push(value);
        }

        let results = "<h2>Resultados</h2>";
        let count = 0;

        for (const key in data) {
            results += `
            <b>${count + 1}) ${questions[count]}</b><br><br>
            <b>Respuesta:</b> ${data[key].map((value) => value === "true" ? "Verdadero" : value === "false" ? "Falso" : value).join(", ")}<br><br><br>
            `;
            count++;
        }

        resultDiv.innerHTML = results;
        setVisible(questionnaireForm, false);
        setVisible(resultDiv, true);
    }
});