let emailInput = document.getElementById('email')
let passwordInput = document.getElementById('password')
let loginBt = document.getElementById('login-bt')
let toggleDarkBt = document.querySelector('.toggle-dark')
let moonBt = document.querySelector('.bi-moon')
let sunBt = document.querySelector('.bi-sun')
let background = document.getElementById('background')
let formControl = document.getElementsByTagName('input')
let container = document.querySelector('.container')
let labels = document.getElementsByTagName('label')
let divError = document.querySelector(".error")

moonBt.style.display = 'block'

toggleDarkBt.addEventListener('click', () => {
    toggleDark()
})

loginBt.addEventListener('click', () => {
    let userEmail = emailInput.value
    let userPassword = passwordInput.value

    if (!userEmail || !userPassword) {
        if (!userEmail) {
            showError("noEmail")
            if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
                emailInput.style.backgroundColor = '#5e3131'
            }else{
                emailInput.style.backgroundColor = '#ff9494'
            }
        }
        if (!userPassword) {
            showError("noPassword")
            if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
                passwordInput.style.backgroundColor = '#5e3131'
            }else{
                passwordInput.style.backgroundColor = '#ff9494'
            }
        }
        if (!userEmail && !userPassword) {
            showError("noText")
        }
        return;
    }
    Auth(userEmail, userPassword);
})

emailInput.addEventListener('input', () => {
    if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
        emailInput.style.backgroundColor = '#4f4f4f'
        passwordInput.style.backgroundColor = '#4f4f4f'
        showError()
    } else {
        emailInput.style.backgroundColor = '#d1d1d1'
        passwordInput.style.backgroundColor = '#d1d1d1'
        showError()
    }
})

passwordInput.addEventListener('input', () => {
    if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
        emailInput.style.backgroundColor = '#4f4f4f'
        passwordInput.style.backgroundColor = '#4f4f4f'
        showError()
    } else {
        emailInput.style.backgroundColor = '#d1d1d1'
        passwordInput.style.backgroundColor = '#d1d1d1'
        showError()
    }
})

function verifyDark(){
    if(getAuthInfo('dark') === 'true'){
        toggleDark()
    }
}

function toggleDark() {
    if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'light')
        moonBt.style.display = 'block'
        sunBt.style.display = 'none'
        background.style.backgroundImage = 'linear-gradient(to bottom right, #f6f6f6 50%, #d1d1d1 50%)'
        container.style.backgroundColor = '#fff'
        container.style.boxShadow = '0 0 3px 1px rgba(0, 0, 0, 0.8)'
        loginBt.style.boxShadow = '0 0 3px 1px rgba(0, 0, 0, 0.8)'
        divError.style.backgroundColor = '#ff9494'
        divError.style.color = 'rgba(0,0,0,0.8)'
        for (const i of formControl) {
            i.style.backgroundColor = "#d1d1d1"
            i.style.color = 'black'
        }
        for (const i of labels) {
            i.style.color = "black"
        }
        sessionStorage.setItem("dark", false)
    }
    else {
        document.documentElement.setAttribute('data-bs-theme', 'dark')
        sunBt.style.display = 'block'
        moonBt.style.display = 'none'
        background.style.backgroundImage = 'linear-gradient(to bottom right, #1c1c1c 50%, #353535 50%)'
        container.style.backgroundColor = '#262626'
        container.style.boxShadow = '0 0 3px 1px rgba(255, 255, 255, 0.8)'
        loginBt.style.boxShadow = '0 0 3px 1px rgba(255, 255, 255, 0.8)'
        divError.style.backgroundColor = '#5e3131'
        divError.style.color = 'rgba(255,255,255,255.8)'
        for (const i of formControl) {
            i.style.backgroundColor = "#4f4f4f"
            i.style.color = 'white'
        }
        for (const i of labels) {
            i.style.color = "white"
        }
        sessionStorage.setItem("dark", true)
    }
}

function Auth(email, senha) {
    // Por algum motivo, colocar Auth(email, password) e então body: JSON.stringify({email, password}) não funciona de jeito nenhum
    fetch(`${URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha })
    })
        .then(response => response = response.json())
        .then(response => {
            if (!!response.mensagem) {
                showError('auth')
                return
            } else {
                saveUser(response.usuario, response.token)
                showLoading()
                setTimeout(() => {
                    window.open('index.html', '_self')
                }, 1000)
            }
        })
}

function showError(type) {
    const ErrorMsg = document.querySelector("#error-msg")
    if (type === 'auth') {
        ErrorMsg.textContent = "Usuário ou senha inválidos."
        divError.style.display = 'flex'
        divError.style.height = '30px'
    } else if (type === 'noEmail') {
        ErrorMsg.textContent = "Por favor, digite um e-mail válido."
        divError.style.display = 'flex'
        divError.style.height = '30px'
    } else if (type === 'noPassword') {
        ErrorMsg.textContent = "Por favor, digite uma senha válida."
        divError.style.display = 'flex'
        divError.style.height = '30px'
    } else if (type === 'noText') {
        ErrorMsg.textContent = "Por favor, digite um e-mail e senha válidos."
        divError.style.display = 'flex'
        divError.style.height = '40px'
    } else {
        divError.style.display = 'none'
    }
}

function showLoading() {
    const divLoading = document.querySelector(".loading")
    divLoading.style.display = 'block';
}

verifyDark()