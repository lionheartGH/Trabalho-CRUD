const URL = `http://localhost:3400`

function saveUser(user, token){
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
    if(document.documentElement.getAttribute('data-bs-theme') == 'dark'){
        sessionStorage.setItem('dark', true)
    }else{
        sessionStorage.setItem('dark', false)
    }
}

function getAuthInfo(type){
    if(type === 'user'){
        return localStorage.getItem('user')
    }else if(type === 'token'){
        return localStorage.getItem('token')
    }else if(type === 'dark'){
        return sessionStorage.getItem('dark')
    }
}

function deleteAuthInfo(type){
    if (type === "user"){
        localStorage.removeItem("user")
    }else if(type === 'token'){
        localStorage.removeItem("token")
    }else if(type === 'dark'){
        sessionStorage.removeItem("dark")
    }else{
        localStorage.removeItem("user")
        localStorage.removeItem("token")
    }
}

function logout(){
    deleteAuthInfo()
    toLogin()
}

function toLogin(){
    window.open("login.html", '_self');
}

function userLogged(){
    let token = getAuthInfo('token');
    return !!token;
}

function validateAuth(){
    if(window.location.pathname == '/login.html'){
        if(userLogged()){
            window.open('index.html', '_self')
        }
    }else if(!userLogged() && window.location.pathname == '/index.html'){
        toLogin()
    }
}

validateAuth()