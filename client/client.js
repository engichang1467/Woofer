

console.log("sup G")

const form = document.querySelector('form') // grabbing an element
const loadingElement = document.querySelector('.loading')
const woofsElement = document.querySelector('.woofs')
const API_URL = 'http://localhost:5000/woofs'

loadingElement.style.display = '' 

listAllWoofs()

form.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(form)
    const name = formData.get('name')
    const content = formData.get('content')

    const woof = {
        name, 
        content
    }

    // console.log(woof)
    form.style.display = 'none'             // hide form
    loadingElement.style.display = ''       // unhide the loading screen

    // fetch() - request data from server
    // it'll execute when the user submit their woofs
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(woof),
        headers: {
            'content-type': 'application/json'
        }
    }).then( response => response.json() )
      .then(createWoof => {
        //   console.log(createWoof)
          form.reset()
          setTimeout(() => {
              form.style.display = ''  
          }, 30000)
          listAllWoofs()
        //   loadingElement.style.display = 'none'
      })
})

// Desc: list out all the woofs that the user submit
function listAllWoofs()
{
    woofsElement.innerHTML = ''
    fetch(API_URL)
        .then(response => response.json())
        .then( woofs => {
            // console.log(woofs)
            woofs.reverse()

            woofs.forEach(woof => {
                const div = document.createElement('div')

                const header = document.createElement('h3')
                header.textContent = woof.name

                const contents = document.createElement('p')
                contents.textContent = woof.content

                const date = document.createElement('small')
                date.textContent = new Date(woof.created)

                div.appendChild(header)
                div.appendChild(contents)
                div.appendChild(date)

                woofsElement.appendChild(div)
            })
            loadingElement.style.display = 'none'
        })
}