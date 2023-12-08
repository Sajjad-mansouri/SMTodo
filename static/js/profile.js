import { getToken } from './get-token.js';
import {profileHeader,todoHeader,dropDownProfile} from './header.js'

//dropdown
dropDownProfile()


if (window.location.pathname.includes('profile')) {
    const origin= location.origin
    const imageBtn = document.querySelector('button[type="button"]');
    const imgInput = document.querySelector('input[type="file"]');
    const img = document.querySelector(".profile_image")
    const avater=document.querySelector('.avatar')
    const user = document.querySelector('#user').textContent

    // image profile change
    function imageUpload() {
        imageBtn.addEventListener('click', () => {
            imgInput.click()
        });
        imgInput.addEventListener('change', (e) => {

            getToken().then((accessToken) => {
                const formData = new FormData()

                let file = imgInput.files[0]
                formData.append('profile_image', file)
                fetch(origin+`/api/profile/${user}`, {
                        method: "PATCH",
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                        },
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                        console.log(img)
                        img.src = data.userinfo.profile_image
                        avater.src=data.userinfo.profile_image
                    })
                    .catch(error => console.log(error))

            })

        })
    }
    imageUpload()
    // profile form data change
    function submitForm() {
        const profileForm = document.querySelector('#profile-form')
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(profileForm)
            getToken().then(accessToken => postProfileForm(accessToken, formData))

        })
        async function postProfileForm(accessToken, formData) {
            try {
                const response = await fetch(origin+`/api/profile/${user}`, {
                    method: "PATCH",
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: formData
                })

                const data = await response.json()
                const navTab = document.querySelector('.nav-tabs')
                if (response.ok) {
                    const message = document.createElement('div')
                    message.className = 'message alert alert-success text-center'
                    message.textContent = 'changed successfully'
                    const userName = document.querySelector('.username')
                    userName.textContent = '@' + data.username
                    navTab.after(message)
                    setTimeout(() => {
                        message.remove()
                    }, 5000)


                } else {
                    const err = document.querySelector('.errors')
                    console.log(err)
                    if (err) {
                        err.remove()
                    }
                    const errors = document.createElement('div')
                    errors.className = 'errors alert alert-warning text-center'
                    const ul = document.createElement('ul')
                    errors.append(ul)
                    for (const key in data) {
                        const li = document.createElement('li')
                        li.textContent = data[key]
                        ul.append(li)
                        console.log(key, data[key])
                    }
                    navTab.after(errors)
                }
            } catch (error) {
                console.log(error)
            }

        }
    }
    submitForm()

    // update profile dropdown and page title
	profileHeader()

}else{
    todoHeader()
}