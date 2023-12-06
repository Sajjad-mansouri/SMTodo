
import {getToken} from './get-token.js'
if (window.location.pathname.includes('profile')){

	const imageBtn=document.querySelector('button[type="button"]');
	const imgInput=document.querySelector('input[type="file"]');
	const img=document.querySelector(".profile_image")
	const user=document.querySelector('#user').textContent

	imageBtn.addEventListener('click',()=>{
		imgInput.click()
	});
	imgInput.addEventListener('change',(e)=>{
		
		getToken().then((accessToken)=>{
			const formData=new FormData()

			let file=imgInput.files[0]
			formData.append('profile_image',file)
			fetch(`http://localhost:8000/api/profile/${user}`,{
	            method:"PATCH",
	            headers: {
	                    'Authorization': `Bearer ${accessToken}`,
	                  },
	            body:formData
	        })
		    .then(response => response.json())
		    .then(data => {
		    	console.log(data)
		    	console.log(img)
		    	img.src=data.profile_image
				})
		    .catch(error => console.log(error))

		})

	})
}