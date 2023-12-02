
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
                console.log(currentDate.toDateString())
                console.log(todo_date)

                if (currentDate.toDateString()==todo_date){


                    let todoUl=document.querySelector('.todo-ul')
                    let todoList=document.querySelector('.todo-list');
                    let clonedList=todoList.cloneNode(true);
                    const checkbox = clonedList.querySelector('input[type="checkbox"]');
                    checkbox.setAttribute('id',`${data.id}`)
                    clonedList.style=''
                    clonedList.setAttribute('id',`${data.id}`)
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

    function changeStatus(checkInputTag){
        checkInputTag.forEach((element)=>{
            element.addEventListener('change',(event)=>{

                const id=event.target.attributes.id.value;
                async function changeStatus(accessToken){
                    console.log(id)
                    const response=await fetch(`http://localhost:8000/api/todo/${id}`,{
                            method:'patch',
                            
                            headers: {
                                    "Content-Type": "application/json",
                                    'Authorization': `Bearer ${accessToken}`
                                  },
                            body:JSON.stringify({'status':event.target.checked})

                         });
                    const data=await response.json()
                    let finishedUl=document.querySelector('.finished-ul')
                    let todoUl=document.querySelector('.todo-ul')
                    let todoList=document.getElementById(`${data.id}`);            
                    if(data.status){

                            finishedUl.prepend(todoList)
                    }else{
                            todoUl.prepend(todoList)    
                    }


                }
                getToken().then((accessToken)=>{
                    changeStatus(accessToken)});


            })
        })
    }
    const checkInputTag=document.querySelectorAll('input[type="checkbox"]')
    console.log(checkInputTag)
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
                let todoList=document.querySelector('.todo-list');
                todoUl.textContent=''
                finishedUl.textContent=''
                for(todo of data){
                    console.log(todo.status)
                    if (todo.status===true){
                        createList(todoList,todo,finishedUl)
                    }else{
                        createList(todoList,todo,todoUl)
                    }
                }
            })
            .then(()=>{
                const checkInputTag=document.querySelectorAll('input[type="checkbox"]')
                console.log(checkInputTag)
                changeStatus(checkInputTag)            
            })


    }
    function createList(todoList,todo,todoUl){
            let clonedList=todoList.cloneNode(true);
            clonedList.style=''
            clonedList.setAttribute('id',`${todo.id}`)
            const input=clonedList.querySelector('input[type="checkbox"]')
            input.setAttribute('id',`${todo.id}`)
            input.checked=todo.status
            let todoText=clonedList.querySelector('.todo-text');
            todoText.append(todo.text);
            todoUl.append(clonedList)   
                            }

})
