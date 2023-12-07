// update profile dropdown and page title
export function profileHeader() {
    let profileHref='/todo'
    let profileBtn=' Todo'
    let tagClassName='fa-regular fa-address-card'
    let headerText='Profile'
    header(profileHref,profileBtn,tagClassName,headerText)
}


export function todoHeader() {
    let profileHref='/account/profile'
    let profileBtn=' Profile'
    let tagClassName='fa fa-check bg-primary text-white rounded p-2'
    let headerText='My Todo-s'
    header(profileHref,profileBtn,tagClassName,headerText)
}

function header(profileHref,profileBtn,tagClassName,headerText) {
    const profileDrop = document.querySelector('.profile-drop')
    const firstChild = profileDrop.firstElementChild
    firstChild.href = profileHref
    firstChild.textContent = profileBtn

    const header = document.querySelector('.header')
    const tag = document.createElement('i')
    tag.className = tagClassName
    const u = document.createElement('u')
    u.textContent = headerText
    header.append(tag)
    header.append(u)
}


export function dropDownProfile() {

    const profile = document.querySelector('.avatar')
    const profileDrop = document.querySelector('.profile-drop')
    profile.addEventListener('click', () => {

        profileDrop.classList.toggle('active')
    })
    window.addEventListener('mouseup', (event) => {

        if (event.target != profileDrop && event.target != profile && event.target.parentNode != profileDrop) {
            profileDrop.classList.remove('active')
            console.log('run')
        }
    })

}