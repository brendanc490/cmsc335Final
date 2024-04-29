const registerForm = document.getElementById('registerForm');
const username = document.getElementById('username');
const password = document.getElementById('password');
const confPassword = document.getElementById('confPassword');



function validateInfo(event) {

    const re = /^[a-zA-Z0-9]+$/
    if(!re.test(username.value) || username.value.length < 4 || username.value.length > 16){
        alert('Invalid username, must be 4-16 characters long.');
        username.focus()
        return false;
    }
    
    if(!re.test(password.value) || password.value.length < 6 || password.value.length > 16){
        alert('Invalid password, must be 6-16 characters long.');
        password.focus()
        return false;
    }

    if(password.value.localeCompare(confPassword.value) != 0){
        alert('Passwords do not match')
        password.focus()
        return false;
    }
    
    return true;
}

/*async function validateInfo(event) {
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

    if(password.value.localeCompare(confPassword.value) != 0){
        alert('Passwords do not match')
        password.focus()
        return false;
    }

    let userId = await registerUser(username.value, password.value);
    if(userId == 401){
        alert('Registration failed. Username is already in use.') 
        return false;
    } else if(!userId){
        alert('Registration failed')
        return false;
    } else {
        let now = new Date();
        let time = now.getTime();
        let expireTime = time+7*24*60*60*1000;
        now.setTime(expireTime);
        document.cookie = `id=${userId}; expires=${now.toUTCString()}`
        
    }
        


    
    return true;
}*/



async function registerUser(username, password) {
    let res;
    try {
        res = await fetch('./register', {
            method: "POST",
            credentials: "include",
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


    return resp.insertedId;

}


