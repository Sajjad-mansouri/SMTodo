    
export async function getToken(){
        try{

            var accessToken =  localStorage.getItem('access_token');
            const refreshToken =  localStorage.getItem('refresh_token');      

            if(!refreshToken ){
            window.location.href=origin+'/account/login'
            } 

            if(accessToken=='undefined' || isTokenExpired( accessToken) ){

                const response=await fetch(origin+'/api/token/refresh/',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({refresh:refreshToken})
                })

                if (response.ok){
                    const data=await response.json();
                    accessToken=await data.access;
                    localStorage.setItem('access_token',accessToken);
                    return accessToken
                } else{
                    window.location.href=origin+'/account/login'
                }  


            
        }else{
            return accessToken
        }
            

      }catch(error){
               

            } 
    }

function isTokenExpired(token) {


      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = decodedToken.exp * 1000; 
      return Date.now() > expirationTime;         
    };


export async function login(event){
    console.log('login')
    event.preventDefault();
    const form=event.target;
    const formData=new FormData(form);
    const response=await fetch(origin+'/api/token/',{
        method:'POST',
        headers:{
        "Content-Type":'application/json'   
        },
        
        body:JSON.stringify(Object.fromEntries(formData))
    });
    const data=await response.json();
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    form.submit()

}
