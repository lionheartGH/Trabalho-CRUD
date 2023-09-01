let emailInput = document.getElementById('email')
let passwordInput = document.getElementById('password')
let loginBt = document.getElementById('login-bt')

loginBt.addEventListener('click', () => {
    let userEmail = emailInput.value
    let userPassword = passwordInput.value

    if(!userEmail || !userPassword){
        if(!userEmail){
            showError("noEmail")
            emailInput.style.backgroundColor = '#5e3131'
        }
        if(!userPassword){
            showError("noPassword")
            passwordInput.style.backgroundColor = '#5e3131'
        }
        if(!userEmail && !userPassword){
            showError("noText")
        }
        return;
    }
    Auth(userEmail,userPassword);
})

emailInput.addEventListener('input', () => {
    emailInput.style.backgroundColor = 'var(--button-color)'
    passwordInput.style.backgroundColor = 'var(--button-color)'
    showError()
})

passwordInput.addEventListener('input', () => {
    emailInput.style.backgroundColor = 'var(--button-color)'
    passwordInput.style.backgroundColor = 'var(--button-color)'
    showError()
})

function Auth(email, senha){
    // Por algum motivo, colocar Auth(email, password) e então body: JSON.stringify({email, password}) não funciona de jeito nenhum
    fetch(`${URL}/login`, {
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, senha})
    })
    .then(response => response = response.json())
    .then(response => {
        if(!!response.mensagem){
            showError('auth')
            return
        }else{
            saveUser(response.usuario, response.token)
            showLoading()
            setTimeout(() => {
                window.open('index.html', '_self')
            }, 1000)
        }
    })
}

function showError(type){
    const divError = document.querySelector(".error")
    const ErrorMsg = document.querySelector("#error-msg")
    if(type === 'auth'){
        ErrorMsg.textContent = "Usuário ou senha inválidos."
        divError.style.display = 'flex'
        divError.style.height = '30px'
    }else if(type === 'noEmail'){
        ErrorMsg.textContent = "Por favor, digite um e-mail válido."
        divError.style.display = 'flex'
        divError.style.height = '30px'
    }else if(type === 'noPassword'){
        ErrorMsg.textContent = "Por favor, digite uma senha válida."
        divError.style.display = 'flex'
        divError.style.height = '30px'
    }else if(type === 'noText'){
        ErrorMsg.textContent = "Por favor, digite um e-mail e senha válidos."
        divError.style.display = 'flex'
        divError.style.height = '40px'
    }else{
        divError.style.display = 'none'
    }
}

function showLoading(){
    const divLoading = document.querySelector(".loading")
    divLoading.style.display = 'block';
}