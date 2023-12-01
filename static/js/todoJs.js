window.addEventListener('load',function(){
    const form = document.getElementById('todo-form');
    form.addEventListener('submit',function(e){
        e.preventDefault();
        const accessToken = getToken();
        const button=document.querySelector('button')
        const formData= new FormData(form);
        const obj=Object.fromEntries(formData)
        obj.date={'date':obj.date}
        async function addTodo(data) {
            try{
                var json = JSON.stringify(obj);
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
                form.reset()


            }catch(error){
                console.log(error)
            }
        }
        addTodo(formData)

    });

    function getToken(){
      let accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');      

      if(!refreshToken ){
        window.location.href='http://localhost:8000/account/login'
      } 

      if(accessToken==='undefined' ||isTokenExpired( accessToken)){
        console.log('expired')
        fetch('http://localhost:8000/api/token/refresh/',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({refresh:refreshToken})
        })
        .then(response =>{
            if (response.ok){
                return response.json()
            }
            
        })
        .then(data=>{
            localStorage.setItem('access_token',data.access);
            accessToken=data.access;
        }).catch(error=>{
            console.log(error);
            window.location.href='http://localhost:8000/account/login'

        })


      }
      return accessToken
    }

    function isTokenExpired(token) {
      // Check if the token is expired
    
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      console.log(decodedToken)
      const expirationTime = decodedToken.exp * 1000; 
      return Date.now() > expirationTime;       

      
    }
})