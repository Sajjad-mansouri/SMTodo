
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
                const todo_date=new Date(data.date.date).toDateString()
                button.click()
                form.reset()
                let currentTag=document.querySelector('.currentDate')
                let currentDate=currentTag.getAttribute('currentDate')
                currentDate=new Date(currentDate)
                

                if (currentDate.toDateString()==todo_date){
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
                    console.log('else')
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

    function addEventElement(element){
            const dataType=element.getAttribute('data-type')
            if(element.type=='checkbox'){
                element.addEventListener('change',(event)=>{

                const id=event.target.attributes.id.value;
                async function change(accessToken){
                    try{    
                            console.log('change status')
                            const response=await fetch(`http://localhost:8000/api/todo/${id}`,{
                            method:'patch',
                            
                            headers: {
                                    "Content-Type": "application/json",
                                    'Authorization': `Bearer ${accessToken}`
                                  },
                            body:JSON.stringify({'status':event.target.checked})

                         });
                    const data=await response.json();
                    let finishedUl=document.querySelector('.finished-ul');
                    let todoUl=document.querySelector('.todo-ul');
                    let todoDiv=document.querySelector(`#div-${data.id}`);
                    let collapse=todoDiv.lastElementChild;
                    collapse.classList.add('collapse')

                    
                    if(data.status){
                            finishedUl.prepend(todoDiv)
                            
                            console.log(collapse)




                    }else{

                            todoUl.prepend(todoDiv) 
                 

                    }
                    }catch(error){
                        console.log(error)
                    }
                }
                getToken().then((accessToken)=>{
                    
                    if (accessToken !=undefined){
                change(accessToken)
            }
                });
                                                })    
            }
            if (dataType=='remove'){
                const data=element.getAttribute('data')
                
                         element.addEventListener('click',()=>{
                            getToken().then((accessToken)=>{ 
                            if (accessToken !=undefined){
                            remove(accessToken,data)
                                                        }       
                        });

                        })  


                }



            }
    
    
    function changeStatus(checkInputTag){
        checkInputTag.forEach((element)=>{
            addEventElement(element)
        })
    }
    const checkInputTag=document.querySelectorAll('input[type="checkbox"]')
    changeStatus(checkInputTag)




    // daynav functions

    const today=new Date()
    var previousTag=document.querySelector('.previousDate');
    var nextTag=document.querySelector('.nextDate');
    var currentTag=document.querySelector('.currentDate');

    var currentTime=new Date();//today
    var previousTime=new Date();//
    var nextTime=new Date();

    previousTime.setDate(previousTime.getDate()-1);
    nextTime.setDate(nextTime.getDate()+1);

    previousTag.textContent=previousTime.toLocaleDateString();
    nextTag.textContent=nextTime.toLocaleDateString();


    previousTag.addEventListener('click',(event) => dayNav(event,-1));
    nextTag.addEventListener('click',(event) => dayNav(event,+1));


    function dayNav(event, number, ){
        
        event.preventDefault();
        previousTime.setDate(previousTime.getDate()+number)
        currentTime.setDate(currentTime.getDate()+number)
        nextTime.setDate(nextTime.getDate()+number)

        previousTag.textContent=previousTime.toLocaleDateString()
        currentTag.setAttribute('currentDate', currentTime.toISOString());
        if(currentTime.getDate()== today.getDate()){
            currentTag.textContent='Today'
        }else{
        currentTag.textContent=currentTime.toLocaleDateString()

        }
        nextTag.textContent=nextTime.toLocaleDateString()


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
            const btnRemove=clonedList.querySelector('[data-type="remove"]')
            btnRemove.setAttribute('data',`${todo.id}`)
            input.setAttribute('id',`${todo.id}`)
            input.checked=todo.status
            let todoText=clonedList.querySelector('.todo-text');
            todoText.append(todo.text);
            todoUl.prepend(clonedList)
            addEventElement(input) 
            addEventElement(btnRemove) 
            collapse(todoUl)

           removeListener(btnRemoves)     
                            }

    // reomove todo function
   const btnRemoves=document.querySelectorAll('.btn-remove')
   removeListener(btnRemoves)
   function removeListener(btns){
        btns.forEach((element)=>{
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
                console.log('toggle')

                let collapse=element.nextElementSibling
                console.log(collapse)
                collapse.classList.toggle('collapse')
            })
        })

    }


// end
})
