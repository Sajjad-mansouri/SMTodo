
async function login(event){
	event.preventDefault();
	const form=event.target;
	const formData=new FormData(form);
	console.log(formData)
	const response=await fetch('http://localhost:8000/api/token/',{
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
