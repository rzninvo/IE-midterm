/* Checking the validation of the input name which we fetch from our text field */
function validateName(name) {
    regex = /^[A-Za-z ]{1,255}$/;
    return regex.test(name);
}

/* Getting the selected gender from our radio boxes */
function getGender() {
    for (let element of document.getElementsByName('gender')) {
        if (element.checked)
            return element.value;
    }
    return null;
}

/* Making the save-container visible, also setting its display to block so that our browser can place it in the flex lay-out */
function showSaveContainer(saved) {
    document.getElementById('saved-answer').innerHTML = saved;
    document.getElementById('save-container').style.display = 'block';
}

/* Making the alert box which is also a block and has a custom text
    that we give to the function. But this one is in the flex display of the giga panel */
function showAlert(text) {
    box = document.getElementById("alert-box");
    box.style.display = "block";
    box.innerHTML = text;
}

/* Taking our alert box's visibility */
function removeAlert() {
    document.getElementById("alert-box").style.display = "none";
}

/* The submit button click handler. */
document.getElementById('submit-button').onclick = (event) => {
    event.preventDefault();
    event.target.blur();
    /* resetting all the elements to it's default form. it's like we have refreshed the page but the alert box and maybe 
     the save container might be shown*/
    document.getElementById('gender-result').innerHTML = null;
    document.getElementById('probabilty-result').innerHTML = null;
    document.getElementById('save-container').style.display = 'none';
    for (let element of document.getElementsByName('gender')) {
        element.checked = false;
    }

    /* Checking the validation of the input name */
    name_field = document.getElementById('name-field');
    if (!validateName(name_field.value)) {
        showAlert('Name must not be bigger than 255 characters and must only contain Alphabet letters.');
        return;
    }

    showAlert('Computing Gender...');
    /* Giving the name to our api and fetching the result which is now in our data variable */
    const apiUrl = 'https://api.genderize.io/';
    let params = new URLSearchParams({
        "name": name_field.value,
    });
    fetch(apiUrl + '?' + params.toString())
        .then((resp) => {
            if (!resp.ok) {
                throw new Error('Network response was not ok!');
            }
            return resp.json();
        })
        .then((data) => {
            /* The last data given is updated to the current one */
            localStorage.setItem('last_data_name', data.name);
            localStorage.setItem('last_data_gender', data.gender);

            /* If gender = null then our api has failed to give us an answer */
            if (data.gender === null) {
                showAlert(`Could not guess the gender for ${data.name}`);
                return;
            }
            document.getElementById('gender-result').innerHTML = data.gender;
            document.getElementById('probabilty-result').innerHTML = data.probability;
            removeAlert();
        })
        .catch(error => {
            showAlert(error);
        });

    /* Checking whether the name that we got our gender for, has a saved gender or not. If so then we show the save container
        for this exact name */
    saved_name = localStorage.getItem(name_field.value);
    if (saved_name !== null) {
        showSaveContainer(saved_name);
    }
};

/* Save button click event handler */
document.getElementById('save-button').onclick = (event) => {
    event.preventDefault();
    event.target.blur();

    /*  Fetching the last name that we guessed the gender for */
    last_data = new Object
    last_data.name = localStorage.getItem('last_data_name')
    last_data.gender = localStorage.getItem('last_data_gender')
    console.log(last_data)
    gender = getGender();
    /* We want to check if our radio box has a gender selected or not. If it had a gender selected then that means that our 
    user wanted to save a gender for a name that our user had written in the textfield. We find the name from the last data
    that we got. If no gender was selected, then we fetch the last data gender instead.*/
    if (gender !== null) {
        localStorage.setItem(last_data.name, gender);
        showAlert(`${gender} saved for ${last_data.name}`);
    } else if (last_data.gender !== null) {
        localStorage.setItem(last_data.name, last_data.gender);
        showAlert(`${last_data.gender} saved for ${last_data.name}`);
    } else {
        return;
    }
    /* Make the save container visible */
    showSaveContainer(localStorage.getItem(last_data.name));
};

/* Clear button click event handler */
document.getElementById('clear-button').onclick = (event) => {
    event.preventDefault();

    document.getElementById('save-container').style.display = 'none';
    /* We fetch our last data and delete it from the local storage */
    last_data = new Object
    last_data.name = localStorage.getItem('last_data_name')
    last_data.gender = localStorage.getItem('last_data_gender')
    localStorage.removeItem(last_data.name);
    showStatus(`Data cleared for ${last_data.name}`);
};