window.addEventListener('load',function(){
    const form = document.getElementById('todo-form');
    const check_input=document.querySelectorAll('input[type="checkbox"]')

    form.addEventListener('submit',function(e){
        e.preventDefault();
        
        const button=document.querySelector('button')
        const formData= new FormData(form);
        const obj=Object.fromEntries(formData)
        obj.date={'date':obj.date}
        var json = JSON.stringify(obj);
        async function addTodo(accessToken) {
            try{
                const response =await fetch("http://localhost:8000/api/",{
                    method:'POST',
                    
                    headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${accessToken}`
                          },
                    body:json

                 }

                    );
                const data=await response.json()
                const todo_date=new Date(data.date.date).toDateString()
                button.click()
                form.reset()
                let currentTag=document.querySelector('.currentDate')
                let currentDate=currentTag.getAttribute('currentDate')
                currentDate=new Date(currentDate)
                console.log(currentDate.toDateString())
                console.log(todo_date)

                if (currentDate.toDateString()==todo_date){


                    let todoUl=document.querySelector('.todo-ul')
                    let todoList=document.querySelector('.todo-list');
                    let clonedList=todoList.cloneNode(true);
                    const checkbox = clonedList.querySelector('input[type="checkbox"]');
                    checkbox.setAttribute('id',`${data.id}`)
                    clonedList.style=''
                    let todoText=clonedList.querySelector('.todo-text');
                    todoText.prepend(data.text);
                    todoUl.prepend(clonedList)
                }


            }catch(error){
                console.log(error)
                console.log('unable to send todo')
            }
        }
        getToken().then((accessToken)=>{
            addTodo(accessToken)});
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
            accessToken=await data.access;
            localStorage.setItem('access_token',accessToken);

            
        }
            return accessToken

      }catch(error){
               console.log('unable to getToken')
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

check_input.forEach((element)=>{
    element.addEventListener('change',(event)=>{

        const id=event.target.attributes.id.value;

        async function changeStatus(accessToken){
           await fetch(`http://localhost:8000/api/todo/${id}`,{
                    method:'patch',
                    
                    headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${accessToken}`
                          },
                    body:JSON.stringify({'status':event.target.checked})

                 });


        }
        getToken().then((accessToken)=>{
            changeStatus(accessToken)});


    })
})

})