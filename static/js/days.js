

var yesterdayTag=document.querySelector('.yesterday')
var tomorrowTag=document.querySelector('.tomorrow')

var today=new Date()//today
var yesterday=new Date()//
var tomorrow=new Date()

yesterday.setDate(yesterday.getDate()-1)
tomorrow.setDate(tomorrow.getDate()+1)

yesterdayTag.textContent=yesterday.toLocaleDateString()
tomorrowTag.textContent=tomorrow.toLocaleDateString()


yesterdayTag.addEventListener('click',(event)=>dayNav(event,yesterday,yesterdayTag,-1));
tomorrowTag.addEventListener('click',(event)=>dayNav(event,tomorrow,tomorrowTag,+1));


function dayNav(event,day,dayTag,number){
	event.preventDefault();
	
	dayTag.textContent=day.toLocaleDateString()
	console.log(day)
	fetch(`http://localhost:8000/api/${day.toISOString()}`)
	.then(response=>{
		return response.json()
	})
	.then(data=>{
		console.log(data)
	})

	day.setDate(day.getDate()+1);
}