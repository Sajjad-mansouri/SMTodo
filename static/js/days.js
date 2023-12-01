window.addEventListener('load',function(){
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
console.log(currentTag)

function dayNav(event, number, ){
	console.log(event)
	event.preventDefault();
	previousTime.setDate(previousTime.getDate()+number)
	currentTime.setDate(currentTime.getDate()+number)
	nextTime.setDate(nextTime.getDate()+number)

	previousTag.textContent=previousTime.toLocaleDateString()

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
		let todoList=document.querySelector('.todo-list');
		todoUl.textContent=''
		

		for(todo of data){
			let clonedList=todoList.cloneNode(true);
			clonedList.style=''
			let todoText=clonedList.querySelector('.todo-text');
			todoText.append(todo.text);
			todoUl.append(clonedList)

		}
	})

}
})