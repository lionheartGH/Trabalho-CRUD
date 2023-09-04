let editMode = false;
let clientList = [];
let filteredList = {};

let addBt = document.getElementById("add-bt")
let table = document.querySelector('table>tbody');
let modal = new bootstrap.Modal(document.getElementById("modal-cadastration"), {});
let modalTitle = document.querySelector('h4.modal-title');
let loggedUser = document.querySelector('.loggedUser')
let logoutBt = document.querySelector('.logout')
let doorBt = document.querySelector('.bi-door-open')
let saveBt = document.getElementById("save-bt")
let cancelBt = document.getElementById("cancel-bt")
let avatar = document.querySelector('.avatar')
let numberForm = document.querySelector('#number')
let filter = document.getElementById('filter')

avatar.src = JSON.parse(getAuthInfo('user')).foto

loggedUser.textContent = JSON.parse(getAuthInfo('user')).email

filter.addEventListener('input', () => {
    let value = filter.value.toLowerCase()
    if (value != "") {
        handleSearch(clientList, value)
        makeTable(filteredList)
    } else {
        makeTable(clientList)
    }
})

function handleSearch(list, searchInput) {
    const filteredData = list.filter(value => {
        const searchStr = searchInput.toLowerCase().replace(/[ ().-]/g, '');
        const idMatches = value.id.toString().includes(searchStr)
        const nameMatches = value.name.toLowerCase().includes(searchStr);
        const shoppingMatches = value.shopping.toString().includes(searchStr);
        const emailMatches = value.email.toLowerCase().includes(searchStr);
        const numberMatches = searchStr.length > 1 ? value.number.toString().includes(searchStr) : false

        return idMatches || nameMatches || shoppingMatches || emailMatches || numberMatches;
    })
    filteredList = filteredData;
}

logoutBt.addEventListener('mouseover', () => {
    doorBt.style.color = 'red';
})

logoutBt.addEventListener('mouseout', () => {
    doorBt.style.color = 'var(--bs-nav-link-color)';
})

numberForm.addEventListener('input', () => {
    const number = numberForm.value.replace(/\D/g, '');
    if (number.length === 0 || number.length > 11) {
        numberForm.value = '';
    } else {
        let formattedNumber = '';
        if (number.length > 2) {
            formattedNumber = '(' + number.slice(0, 2) + ') ';
        } else {
            formattedNumber = '(' + number.slice(0, number.length);
        }

        if (number.length > 2 && number.length > 7) {
            formattedNumber += number.slice(2, 7) + '-' + number.slice(7, 11);
        } else if (number.length > 2) {
            formattedNumber += number.slice(2, number.length);
        }
        numberForm.value = formattedNumber;
    }
})

let formModal = {
    id: document.getElementById('id'),
    name: document.getElementById('name'),
    shopping: document.getElementById('shopping'),
    email: document.getElementById('email'),
    number: document.getElementById('number'),
}

addBt.addEventListener('click', () => {
    editMode = false;
    modalTitle.textContent = "Cadastrar Cliente"
    cleanModal()
    modal.show();
    saveBt.textContent = 'Cadastrar'
})

saveBt.addEventListener('click', () => {
    let client = getModalClient();
    if (Object.keys(client).every(i => {
        if (!client[i]) {
            if (i !== 'id') {
                showError('missingCamp')
                return false;
            }
        }
        showError()
        return true
    })) {
        if (editMode) {
            updateClientBE(client);
        } else {
            addClientBE(client);
        }
    }
})

cancelBt.addEventListener('click', () => {
    showError()
    modal.hide();
})

function showError(type) {
    const divError = document.querySelector(".error")
    const ErrorMsg = document.querySelector("#error-msg")
    if (type === 'missingCamp') {
        ErrorMsg.textContent = "Por favor, preencha todos os campos."
        divError.style.display = 'flex'
        divError.style.height = '30px'
    } else {
        divError.style.display = 'none'
    }
}

function getModalClient() {
    return new ClientM({
        id: formModal.id.value,
        name: formModal.name.value,
        shopping: formModal.shopping.value,
        email: formModal.email.value,
        number: formModal.number.value.replace(/\D/g, ''),
        dataCadastro: new Date()
    })
}

function getClients() {
    fetch(`${URL}/clientes`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getAuthInfo('token')
        },
    })
        .then(response => response.json())
        .then(response => {
            clientList = response;
            makeTable(response);
        })
        .catch()
}

function editClient(id) {
    editMode = true;
    modalTitle.textContent = "Editar Cadastro"
    let client = clientList.find(client => client.id == id);
    updateClientModal(client)
    saveBt.textContent = 'Salvar'
    modal.show();
}

function updateClientModal(client) {
    formModal.id.value = client.id
    formModal.name.value = client.name
    formModal.shopping.value = client.shopping
    formModal.email.value = client.email
    formModal.number.value = client.number
}

function cleanModal(client) {
    formModal.id.value = ""
    formModal.name.value = ""
    formModal.shopping.value = ""
    formModal.email.value = ""
    formModal.number.value = ""
}

function deleteClient(id) {
    let client = clientList.find(c => c.id == id);
    if (confirm(`Deseja realmente deletar o cadastro do cliente ${client.name}?`)) {
        deleteClientBE(client)
    }
}

function createLine(client) {
    let tr = document.createElement('tr')
    let tdID = document.createElement('td')
    let tdName = document.createElement('td')
    let tdShopping = document.createElement('td')
    let tdEmail = document.createElement('td')
    let tdNumber = document.createElement('td')
    let tdDataCadastro = document.createElement('td')
    let tdButtons = document.createElement('td')

    tdID.textContent = client.id;
    tdName.textContent = client.name;
    tdShopping.textContent = client.shopping;
    tdEmail.textContent = client.email;
    tdNumber.textContent = "(" + client.number.substr(0, 2) + ") " + client.number.substr(2, 5) + '-' + client.number.substr(7);
    tdDataCadastro.textContent = new Date(client.dataCadastro).toLocaleDateString();

    tdButtons.innerHTML = `<button onclick="editClient(${client.id})" class="btn btn-outline-primary btn-sm edit-trash">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                            </svg>
                         </button>
                         <button onclick="deleteClient(${client.id})" class="btn btn-outline-danger btn-sm edit-trash">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                            </svg>
                         </button>`;

    tr.appendChild(tdID);
    tr.appendChild(tdName);
    tr.appendChild(tdShopping);
    tr.appendChild(tdEmail);
    tr.appendChild(tdNumber);
    tr.appendChild(tdDataCadastro);
    tr.appendChild(tdButtons);

    table.appendChild(tr);
}

function makeTable(clients) {
    table.textContent = "";
    clients.forEach(client => {
        createLine(client)
    });
}

function addClientBE(client) {
    client.dataCadastro = new Date().toISOString();
    fetch(`${URL}/clientes`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getAuthInfo('token')
        },
        body: JSON.stringify(client)
    })
        .then(response => response.json())
        .then(response => {
            let client = new ClientM(response);
            clientList.push(client)
            makeTable(clientList)
            modal.hide();
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Cadastro salvo com sucesso!',
                showConfirmButton: false,
                timer: 1500,
                customClass: 'alert-top',
                imageHeight: 30,
            })
        })
        .catch(error => {
            console.log(error)
        })
}

function updateClientBE(client) {
    fetch(`${URL}/clientes/${client.id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getAuthInfo('token')
        },
        body: JSON.stringify(client)
    })
        .then(response => response.json())
        .then(() => {
            updateClientOnTable(client, false)
            modal.hide();
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Cadastro editado com sucesso!',
                showConfirmButton: false,
                timer: 1500,
                customClass: 'alert-top',
                imageHeight: 30,
            })
        })
        .catch(error => {
            console.log(error)
        })
}

function deleteClientBE(client) {
    fetch(`${URL}/clientes/${client.id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getAuthInfo('token')
        }
    })
        .then(response => response.json())
        .then(() => {
            updateClientOnTable(client, true)
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Cadastro deletado com sucesso!',
                showConfirmButton: false,
                timer: 1500,
                customClass: 'alert-top',
                imageHeight: 30,
            })
        })
        .catch(error => {
            console.log(error)
        })
}

function updateClientOnTable(client, removeClient) {
    let i = clientList.findIndex((c) => c.id == client.id)
    if (removeClient) {
        clientList.splice(i, 1)
    } else {
        clientList.splice(i, 1, client)
    }
    makeTable(clientList);
}

getClients();