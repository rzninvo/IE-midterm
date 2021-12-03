function validateName(name) {
    regex = /^[A-Za-z ]{1,255}$/;
    return regex.test(name);
}

function getGender() {
    for (let element of document.getElementsByName('gender')) {
        if (element.checked)
            return element.value;
    }
    return null;
}

function showSaveContainer(saved) {
    document.getElementById('saved-answer').innerHTML = saved;
    document.getElementById('save-container').style.display = 'block';
}

function showAlert(text) {
    box = document.getElementById("alert-box");
    box.style.display = "block";
    box.innerHTML = text;
}

function removeAlert() {
    document.getElementById("alert-box").style.display = "none";
}

document.getElementById('submit-button').onclick = (event) => {
    event.preventDefault();
    event.target.blur();
    document.getElementById('gender-result').innerHTML = null;
    document.getElementById('probabilty-result').innerHTML = null;
    document.getElementById('save-container').style.display = 'none';
    for (let element of document.getElementsByName('gender')) {
        element.checked = false;
    }

    name_field = document.getElementById('name-field');
    if (!validateName(name_field.value)) {
        showAlert('Name must not be bigger than 255 characters and must only contain Alphabet letters.');
        return;
    }

    showAlert('Computing Gender...');
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
            localStorage.setItem('last_data_name', data.name);
            localStorage.setItem('last_data_gender', data.gender);

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

    saved_name = localStorage.getItem(name_field.value);
    if (saved_name !== null) {
        showSaveContainer(saved_name);
    }
};

document.getElementById('save-button').onclick = (event) => {
    event.preventDefault();
    event.target.blur();

    last_data = new Object
    last_data.name = localStorage.getItem('last_data_name')
    last_data.gender = localStorage.getItem('last_data_gender')
    console.log(last_data)
    gender = getGender();
    if (gender !== null) {
        localStorage.setItem(last_data.name, gender);
        showAlert(`${gender} saved for ${last_data.name}`);
    } else if (last_data.gender !== null) {
        localStorage.setItem(last_data.name, last_data.gender);
        showAlert(`${last_data.gender} saved for ${last_data.name}`);
    } else {
        return;
    }
    showSaveContainer(localStorage.getItem(last_data.name));
};

document.getElementById('clear-button').onclick = (event) => {
    event.preventDefault();

    document.getElementById('save-container').style.display = 'none';
    last_data = new Object
    last_data.name = localStorage.getItem('last_data_name')
    last_data.gender = localStorage.getItem('last_data_gender')
    localStorage.removeItem(last_data.name);
    showStatus(`Data cleared for ${last_data.name}`);
};