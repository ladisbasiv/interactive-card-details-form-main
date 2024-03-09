const cardValidators = {
    cardOwnerName(event) {
        const target = event.target;

        updateCard(target);
        removeErrors(target);

        if (validateBlank(target)) return;

        if (!target.value.match(/^[a-z\s]*$/i)) {
            showValidationError(target, 'Wrong format, only latin letters');
        }
    },

    cardNumber(event) {
        const target = event.target;

        updateCard(target);
        removeErrors(target);

        if (validateBlank(target)) return;

        if (!target.value.match(/^[\s\d]*$/)) {
            showValidationError(target, 'Wrong format, only numbers');
            return;
        }

        if (target.value.match(/\s/)) {
            target.value = target.value.match(/\d/g).join('');
        }

        if (target.value.length < 16 || target.value.length > 16) {
            showValidationError(target, 'Must be 16 digits');
        }
    },

    cardExpMonth(event) {
        const target = event.target;

        updateCard(target);
        removeErrors(target);

        if (validateBlank(target)) return;

        if (!target.value.match(/^\d*$/)) {
            showValidationError(target, 'Only numbers');
            return;
        }

        if (target.value.length < 2) {
            showValidationError(target, 'Must be MM YYYY format');
            return;
        }

        target.nextElementSibling.dispatchEvent(new InputEvent('input'));
    },

    cardExpYear(event) {
        const target = event.target;

        updateCard(target);
        removeErrors(target);

        if (target.parentElement.parentElement.querySelector('.error')) return;

        if (validateBlank(target)) return;
        if (!target.value.match(/^\d*$/)) {
            showValidationError(target, 'Only numbers');
            return;
        }

        if (target.value.length < 4) {
            showValidationError(target, 'Must be MM YYYY format');
        }
    },

    cardCVC(event) {
        const target = event.target;

        updateCard(target);
        removeErrors(target);

        if (validateBlank(target)) return;

        if (!target.value.match(/^\d*$/)) {
            showValidationError(target, 'Only numbers');
            return;
        }

        if (target.value.length < 3) {
            showValidationError(target, 'Must be 3 digits');
        }
    }
};

function showValidationError(input, errorText) {
    input.classList.add('validation-error');

    let error = document.createElement('p');
    error.classList.add('error');
    error.textContent = errorText;

    if (['cardExpMonth', 'cardExpYear'].includes(input.name)) {
        input.parentElement.after(error);
    } else {
        input.after(error);
    }
}

function removeErrors(input) {
    input.classList.remove('validation-error');

    if (['cardExpMonth', 'cardExpYear'].includes(input.name)) {
        input.parentElement.parentElement.querySelectorAll('.error').forEach(err => err.remove());
        return;
    }
    input.parentElement.querySelectorAll('.error').forEach(err => err.remove());
}

function validateBlank(input) {

    if (input.name === 'cardExpYear') {
        input.parentElement.parentElement.querySelector('.error') && input.classList.add('validation-error');
    }

    if (!input.value && !input.classList.contains('validation-error')) {
        showValidationError(input, `Can't be blank`);
        return true;
    }

    return false;
}

function addValidators() {
    const cardForm = document.forms.cardForm;

    for (let element of cardForm.elements) {
        element.addEventListener('input', cardValidators[element.name]);
    }
}

function updateCard(input) {
    const field = document.querySelector(`.${input.dataset.update}`);

    if (input.dataset.update === 'card-expire-date') {
        let date = field.innerText.split('/');
        date[input.name === 'cardExpMonth' ? 0 : 1] = input.value;
        field.innerText = date.join('/');

        input.name === 'cardExpMonth' && input.nextElementSibling.dispatchEvent(new InputEvent('input'));
        return;
    }

    if (input.dataset.update === 'card-number') {
        let numbers = input.value.split('');
        let edited = '';

        for (let i = 1; i <= input.value.length; i++) {
            edited += numbers[i - 1];
            if (i % 4 === 0) {
                edited += ' ';
            }
        }

        field.innerText = edited;
        return;
    }

    field.innerText = input.value;
}

document.getElementById('submit-button').onclick = event => {
    event.preventDefault();
    const cardForm = document.forms.cardForm;

    for (element of cardForm.elements) {
        validateBlank(element);
    }

    if (!document.querySelector('.error')) {
        // cardForm.submit()
        const completedPanel = document.querySelector('.completed');
        cardForm.replaceWith(completedPanel);
        completedPanel.style.display = 'initial';
        cardForm.style.display = 'none';
    }
};

addValidators();