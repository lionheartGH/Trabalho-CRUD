let editMode = false;
let productList = [];
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
let filter = document.getElementById('filter')
let toggleDarkBt = document.querySelector('.toggle-dark')
let moonBt = document.querySelector('.bi-moon')
let sunBt = document.querySelector('.bi-sun')
let topbar = document.querySelector('.topbar')
let tableS = document.querySelector('table.table')
let formControl = document.getElementsByClassName('form-control')
let pageLabel = document.querySelector('.produtos')

avatar.src = JSON.parse(getAuthInfo('user')).foto

loggedUser.textContent = JSON.parse(getAuthInfo('user')).email

moonBt.style.display = 'block'

toggleDarkBt.addEventListener('click', () => {
    toggleDark()
})

filter.addEventListener('input', () => {
    let value = filter.value.toLowerCase()
    if (value != "") {
        handleSearch(productList, value)
        makeTable(filteredList)
    } else {
        makeTable(productList)
    }
})

function verifyDark(){
    if(getAuthInfo('dark') === 'true'){
        toggleDark()
    }
}

function toggleDark(){
    if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'light')
        moonBt.style.display = 'block'
        sunBt.style.display = 'none'
        topbar.style.boxShadow = "0 0 3px 1px rgba(var(--lightmode-shadow), 0.8)"
        tableS.style.boxShadow = "0 0 3px 1px rgba(var(--lightmode-shadow), 0.8)"
        cancelBt.style.color = 'black'
        pageLabel.style.backgroundColor = '#e7e7e7'
        avatar.style.borderColor = '#6d6d6d'
        for (const i of formControl) {
            i.style.backgroundColor = "#efefef"
        }
        sessionStorage.setItem("dark", false)
    }
    else {
        document.documentElement.setAttribute('data-bs-theme', 'dark')
        sunBt.style.display = 'block'
        moonBt.style.display = 'none'
        topbar.style.boxShadow = "0 0 3px 1px rgba(var(--darkmode-shadow), 0.8)"
        tableS.style.boxShadow = "0 0 3px 1px rgba(var(--darkmode-shadow), 0.8)"
        cancelBt.style.color = 'white'
        pageLabel.style.backgroundColor = '#373d42'
        avatar.style.borderColor = 'white'
        for (const i of formControl) {
            i.style.backgroundColor = "#3d3d3d"
        }
        sessionStorage.setItem("dark", true)
    }
}

function handleSearch(list, searchInput) {
    const filteredData = list.filter(value => {
        const searchStr = searchInput.toLowerCase().replace(/[ ().-]/g, '');
        const idMatches = value.id.toString().includes(searchStr)
        const nameMatches = value.nome.toLowerCase().includes(searchStr);
        const valueMatches = value.valor.toString().includes(searchStr);
        const stockMatches = value.quantidadeEstoque.toLowerCase().includes(searchStr);
        const obsMatches = value.obs.toLowerCase().includes(searchStr);

        return idMatches || nameMatches || valueMatches || stockMatches || obsMatches;
    })
    filteredList = filteredData;
}

logoutBt.addEventListener('mouseover', () => {
    doorBt.style.color = 'red';
})

logoutBt.addEventListener('mouseout', () => {
    doorBt.style.color = 'var(--bs-nav-link-color)';
})

let formModal = {
    id: document.getElementById('id'),
    nome: document.getElementById('name'),
    valor: document.getElementById('value'),
    quantidadeEstoque: document.getElementById('stock'),
    observacao: document.getElementById('obs'),
}

addBt.addEventListener('click', () => {
    editMode = false;
    modalTitle.textContent = "Adicionar Produto"
    cleanModal()
    modal.show();
    saveBt.textContent = 'Adicionar'
})

saveBt.addEventListener('click', () => {
    let product = getModalProduct();
    if (Object.keys(product).every(i => {
        if (!product[i]) {
            if (i !== 'id') {
                if (i !== 'foto') {
                    showError('missingCamp')
                    return false;
                }
            }
        }
        showError()
        return true
    })) {
        if (editMode) {
            updateProductBE(product);
        } else {
            addProductBE(product);
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

function getModalProduct() {
    return new ProductM({
        id: formModal.id.value,
        nome: formModal.nome.value,
        valor: formModal.valor.value,
        quantidadeEstoque: formModal.quantidadeEstoque.value,
        observacao: formModal.observacao.value,
        dataCadastro: new Date()
    })
}

function getProducts() {
    fetch(`${URL}/produtos`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getAuthInfo('token')
        },
    })
        .then(response => response.json())
        .then(response => {
            productList = response;
            makeTable(response);
        })
        .catch()
}

function editProduct(id) {
    editMode = true;
    modalTitle.textContent = "Editar Cadastro"
    let product = productList.find(product => product.id == id);
    updateProductModal(product)
    saveBt.textContent = 'Salvar'
    modal.show();
}

function updateProductModal(product) {
    formModal.id.value = product.id
    formModal.nome.value = product.nome
    formModal.valor.value = product.valor
    formModal.quantidadeEstoque.value = product.quantidadeEstoque
    formModal.observacao.value = product.observacao
}

function cleanModal(product) {
    formModal.id.value = ""
    formModal.nome.value = ""
    formModal.valor.value = ""
    formModal.quantidadeEstoque.value = ""
    formModal.observacao.value = ""
}

function deleteProduct(id) {
    let product = productList.find(p => p.id == id);
    if (confirm(`Deseja realmente deletar o cadastro do produto ${product.nome}?`)) {
        deleteProductBE(product)
    }
}

function createLine(product) {
    let tr = document.createElement('tr')
    let tdID = document.createElement('td')
    let tdName = document.createElement('td')
    let tdValue = document.createElement('td')
    let tdStock = document.createElement('td')
    let tdObs = document.createElement('td')
    let tdDataCadastro = document.createElement('td')
    let tdButtons = document.createElement('td')

    tdID.textContent = product.id;
    tdName.textContent = product.nome;
    tdValue.textContent = product.valor;
    tdStock.textContent = product.quantidadeEstoque;
    tdObs.textContent = product.observacao;
    tdDataCadastro.textContent = new Date(product.dataCadastro).toLocaleDateString();

    tdButtons.innerHTML = `<button onclick="editProduct(${product.id})" class="btn btn-outline-primary btn-sm edit-trash">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                            </svg>
                         </button>
                         <button onclick="deleteProduct(${product.id})" class="btn btn-outline-danger btn-sm edit-trash">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                            </svg>
                         </button>`;

    tr.appendChild(tdID);
    tr.appendChild(tdName);
    tr.appendChild(tdValue);
    tr.appendChild(tdStock);
    tr.appendChild(tdObs);
    tr.appendChild(tdDataCadastro);
    tr.appendChild(tdButtons);

    table.appendChild(tr);
}

function makeTable(products) {
    table.textContent = "";
    products.forEach(product => {
        createLine(product)
    });
}

function addProductBE(product) {
    product.foto = "null"
    product.dataCadastro = new Date().toISOString();
    fetch(`${URL}/produtos`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getAuthInfo('token')
        },
        body: JSON.stringify(product)
    })
        .then(response => response.json())
        .then(response => {
            let product = new ProductM(response);
            productList.push(product)
            makeTable(productList)
            modal.hide();
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Produto salvo com sucesso!',
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

function updateProductBE(product) {
    fetch(`${URL}/produtos/${product.id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getAuthInfo('token')
        },
        body: JSON.stringify(product)
    })
        .then(response => response.json())
        .then(() => {
            updateProductOnTable(product, false)
            modal.hide();
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Produto editado com sucesso!',
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

function deleteProductBE(product) {
    fetch(`${URL}/produtos/${product.id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getAuthInfo('token')
        }
    })
        .then(() => {
            updateProductOnTable(product, true)
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Produto deletado com sucesso!',
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

function updateProductOnTable(product, removeProduct) {
    let i = productList.findIndex((p) => p.id == product.id)
    if (removeProduct) {
        productList.splice(i, 1)
    } else {
        productList.splice(i, 1, product)
    }
    makeTable(productList);
}

verifyDark()
getProducts();