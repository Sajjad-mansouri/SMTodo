
window.addEventListener('load',function(){
    const form = document.getElementById('todo-form');


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
                button.click()
                form.reset()
                if (checkTodoDate(data)){
                    let todoUl=document.querySelector('.todo-ul')
                    let todoList=document.querySelector('.todo-div');
                    createList(todoList,data,todoUl)
                }



            }catch(error){
                console.log(error)
                console.log('unable to send todo')
            }
        }
        getToken().then((accessToken)=>{
            if (accessToken !=undefined){
                addTodo(accessToken)
            }
            });
    });

    function checkTodoDate(data){
                let currentTag=document.querySelector('.currentDate')
                console.log(currentTag)
                let currentDate=currentTag.getAttribute('currentDate')
                console.log(currentDate)
                console.log(data.date.date)
                if (currentDate==data.date.date){
                    return true
                }       
    }

    async function getToken(){
        try{

            var accessToken =  localStorage.getItem('access_token');
            const refreshToken =  localStorage.getItem('refresh_token');      

            if(!refreshToken ){
            window.location.href='http://localhost:8000/account/login'
            } 

            if(accessToken=='undefined' || isTokenExpired( accessToken) ){

                const response=await fetch('http://localhost:8000/api/token/refresh/',{
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
                    window.location.href='http://localhost:8000/account/login'
                }  


            
        }else{
            return accessToken
        }
            

      }catch(error){
               console.log('unable to getToken')

            } 
    }

    function isTokenExpired(token) {


      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = decodedToken.exp * 1000; 
      return Date.now() > expirationTime;         
    };






    // daynav functions

    const today=new Date()
    var previousTag=document.querySelector('.previousDate');
    var nextTag=document.querySelector('.nextDate');
    var currentTag=document.querySelector('.currentDate');

    var currentTime=new Date();//today


    previousTag.addEventListener('click',(event) => dayNav(event,-1));
    nextTag.addEventListener('click',(event) => dayNav(event,+1));

    function dayNav(event, number, ){
        event.preventDefault()
        currentTime.setDate(currentTime.getDate()+number)
        currentTag.setAttribute('currentDate',currentTime.toISOString().substr(0,10))

        if(currentTime.getDate()== today.getDate()){
            currentTag.textContent='Today'
        }else{
        currentTag.textContent=currentTime.toLocaleDateString()

        }

        fetch(`http://localhost:8000/api/${currentTime.toISOString()}`)
            .then(response=>{
                return response.json()
            })
            .then(data=>{
                let todoUl=document.querySelector('.todo-ul')
                let finishedUl=document.querySelector('.finished-ul')
                let todoList=document.querySelector('.todo-div');
                todoUl.textContent=''
                finishedUl.textContent=''
                for(todo of data){
                    if (todo.status===true){
                        createList(todoList,todo,finishedUl)
                        
                    }else{
                        createList(todoList,todo,todoUl)
                    }

                }


            })


    }
    function createList(todoList,todo,todoUl){
            let clonedList=todoList.cloneNode(true);
            clonedList.style=''
            clonedList.setAttribute('id',`div-${todo.id}`)
            const input=clonedList.querySelector('input[type="checkbox"]')
            const btns=clonedList.querySelectorAll('.btn')
            btns.forEach((element)=>{
                element.setAttribute('data',`${todo.id}`)
            })
            input.setAttribute('id',`${todo.id}`)
            input.checked=todo.status
            let todoText=clonedList.querySelector('.todo-text');
            todoText.append(todo.text);
            todoUl.prepend(clonedList)
            addEventElement(input) 
            addGroupListener(btns) 
            collapse(todoUl)
   
                            }

    function addEventElement(element){
            const dataType=element.getAttribute('data-type')
            const id=element.getAttribute('data')
            if(element.type=='checkbox'){
                element.addEventListener('change',(event)=>{
                getToken().then((accessToken)=>{
                    
                    if (accessToken !=undefined){
                            todoStatus(event,accessToken,id)
                        }
                    });
                                                })    
            }
            if (dataType=='remove'){
                
                
                         element.addEventListener('click',()=>{
                            getToken().then((accessToken)=>{ 
                            if (accessToken !=undefined){
                            remove(accessToken,id)
                                                        }       
                        });

                        })  
                }
            if (dataType=='update'){
                element.addEventListener('click',()=>{
                getToken().then((accessToken)=>{
                    
                    if (accessToken !=undefined){

                            todoUpdateForm(event,accessToken,id)
                        }
                    });

                })
            }



            }
    
    function fetchTodo(method,accessToken,id,body){

        let path =''
        if(id){

            path=  `todo/${id}`
        }

        
        return fetch('http://localhost:8000/api/'+path,{
                            method:method,
                            
                            headers: {
                                    "Content-Type": "application/json",
                                    'Authorization': `Bearer ${accessToken}`
                                  },
                            body:body

                         });
    }

    async function fetchPostTodo(id,accessToken,form){
        let formData= new FormData(form);
        let obj=Object.fromEntries(formData)
        obj.date={'date':obj.date}
        let body = JSON.stringify(obj);
        
        let method='PATCH'
        let response=await fetchTodo(method,accessToken,id,body)
        return response


    }


    async function todoStatus(event,accessToken,id){
            try{ 
                let method= 'patch'  
                const id=event.target.attributes.id.value;
                const body=JSON.stringify({'status':event.target.checked})
                const response=await fetchTodo(method,accessToken,id,body);
                const data=await response.json();

                let finishedUl=document.querySelector('.finished-ul');
                let todoUl=document.querySelector('.todo-ul');
                let todoDiv=document.querySelector(`#div-${data.id}`);
                let collapse=todoDiv.lastElementChild;
                collapse.classList.add('collapse')

                
                if(data.status){
                        finishedUl.prepend(todoDiv)
                        





                }else{

                        todoUl.prepend(todoDiv) 
             

            }
            }catch(error){
                console.log(error)
            }
        }

    async function todoUpdateForm(event,accessToken,id){
            const modal=document.querySelector('button[data-bs-target="#TodoModalUpdate"]')
            const form=document.forms['todoform']
            const formContainer=document.querySelector('.form-container')
            const clonedForm=form.cloneNode(true)
            const response=await fetchTodo('GET',accessToken,id)
            const data=await response.json();
            
            clonedForm.elements['text'].value=data.text
            clonedForm.elements['date'].value=data.date.date
            clonedForm.elements['priority'].value=data.priority
            formContainer.textContent=''
            formContainer.append(clonedForm)
            modal.click()
            clonedForm.addEventListener('submit',(e)=>{
                e.preventDefault()
                
                updateTodo(id,accessToken,clonedForm)
            })
    }

async function updateTodo(id,accessToken,form){
    
    const response= await fetchPostTodo(id,accessToken,form)
    const close=document.querySelector('.close-update')
    const div=document.querySelector(`#div-${id}`)
    const data=await response.json()
    if (response.ok){
        if (checkTodoDate(data)){
            
            
            const textDiv=div.querySelector('.todo-text')
            textDiv.textContent=data.text
            
            form.reset()
        }else{
            div.remove()
        }
        close.click()
    }

}
    // select remove button 
    const checkInputTag=document.querySelectorAll('input[type="checkbox"]')
    addGroupListener(checkInputTag)

    // reomove todo function
   const btns=document.querySelectorAll('.btn')
   addGroupListener(btns)

   function addGroupListener(fn){
        fn.forEach((element)=>{
            addEventElement(element)
        })
   }
   
async function remove(accessToken,data){
        const response=await fetch(`http://localhost:8000/api/todo/${data}`,{
            method:"delete",
            headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${accessToken}`
                  },
        })
        if (response.ok){
            const div=document.getElementById(`div-${data}`)

            div.remove()
        }

}

    const todoUl=document.querySelector('.todo-ul')
    const finishedUl=document.querySelector('.finished-ul')
    collapse(todoUl)
    collapse(finishedUl)

    function collapse(ul){

        const lists=ul.querySelectorAll('.todo-list')
        lists.forEach((element)=>{
            element.addEventListener('click',(e)=>{
                

                let collapse=element.nextElementSibling
                collapse.classList.toggle('collapse')
            })
        })

    }


// end
})
