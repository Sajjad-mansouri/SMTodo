window.addEventListener('load',function(){
    const form = document.getElementById('todo-form');

    form.addEventListener('submit',function(e){
        e.preventDefault();
        
        const button=document.querySelector('button')
        const formData= new FormData(form);
        const obj=Object.fromEntries(formData)
        obj.date={'date':obj.date}
        async function addTodo(data,accessToken) {
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
        getToken().then((accessToken)=>{
            addTodo(formData,accessToken)});
    });

    async function getToken(){
        try{

            var accessToken =  localStorage.getItem('access_token');
            const refreshToken =  localStorage.getItem('refresh_token');      

            if(!refreshToken ){
            window.location.href='http://localhost:8000/account/login'
            } 

            if(accessToken==='undefined' ||isTokenExpired( accessToken)){
            const response=await fetch('http://localhost:8000/api/token/refresh/',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({refresh:refreshToken})
            })

                    
            const data=await response.json();
            const access=await data.access;
            localStorage.setItem('access_token',access);
            return access
        }

      }catch(error){
                console.log(error)
            }
      
      
    }


    function isTokenExpired(token) {
      // Check if the token is expired
    
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      let exp=decodedToken.exp * 1000 - Date.now()
      const expirationTime = decodedToken.exp * 1000; 
      console.log(exp/(1000*60))
      return Date.now() > expirationTime;       

      
    };

})