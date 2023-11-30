window.addEventListener('load',function(){
    const form = document.getElementById('todo-form');
    form.addEventListener('submit',function(e){
        e.preventDefault();
        const accessToken = getToken();
        const button=document.querySelector('button')
        const formData= new FormData(form);
        async function addTodo(data) {
            try{
                var json = JSON.stringify(Object.fromEntries(formData));
                const response =await fetch("http://localhost:8000/api/",{
                    method:'POST',
                    
                    headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${accessToken}`
                          },
                    body:json

                 }
                    );
                button.click()


            }catch(error){
                console.log(error)
            }
        }
        addTodo(formData)

    });

    function getToken(){
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');       
      
      if(!refreshToken){
        window.location.href='http://localhost:8000/account/login'
      } 

      if(isTokenExpired(accessToken)){
        fetch('http://localhost:8000/api/refresh/',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({refresh_token:refreshToken})
        })
        .then(response =>response.json())
        .then(data=>{
            localStorage.setItem('accessToken',data.access_token)
        }).catch(error=>{
            console.log(error);
            // window.location.href='http://localhost:8000/account/login'

        })


      }
      return accessToken
    }

    function isTokenExpired(token) {
      // Check if the token is expired
        console.log('token')
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      console.log(decodedToken)
      const expirationTime = decodedToken.exp * 1000;
      return Date.now() > expirationTime;
    }
})