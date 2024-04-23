const loginForm = document.getElementById('loginForm');
const username = document.getElementById('username');
const password = document.getElementById('password');

window.onload = function() {
    if(document.cookie){
        // get id and log in the user then forward them to main page
        let id = document.cookie.split(';')[0].split('id=')[1]
        
    }
}

/* 
async function validateLogin(event) {
    event.preventDefault(); 

    const re = /^[a-zA-Z0-9]+$/
    if(!re.test(username.value) || username.value.length < 4 || username.value.length > 16){
        alert('Invalid username');
        username.focus()
        return false;
    }
    
    if(!re.test(password.value) || password.value.length < 6 || password.value.length > 16){
        alert('Invalid password');
        password.focus()
        return false;
    }

    let userId = await login(username.value, password.value);
    if(!userId){
        alert('Username and password combination not found') 
        return false;
    } else {
        let now = new Date();
        let time = now.getTime();
        let expireTime = time+7*24*60*60*1000;
        now.setTime(expireTime);
        document.cookie = `id=${userId}; expires=${now.toUTCString()}`
    }

    
    return true;
}
*/
function validateLogin() {
    const re = /^[a-zA-Z0-9]+$/
    if(!re.test(username.value) || username.value.length < 4 || username.value.length > 16){
        alert('Invalid username');
        username.focus()
        return false;
    }
    
    if(!re.test(password.value) || password.value.length < 6 || password.value.length > 16){
        alert('Invalid password');
        password.focus()
        return false;
    }
    
    return true;
}

async function login(username, password) {
    let res;
    try {
        res = await fetch('./', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username:username,password:password}),
        });

    } catch (e) {
        return false;
    }
    
    if(!res.ok && res.status == 401){
        return 401;
    } else if(!res.ok){
        return false;
    }

    let resp = await res.json();

    return resp._id;

}
