import axios from 'axios'
import dompurify from 'dompurify'

const hide = (element) => element.style.display = 'none'

const show = (element) => element.style.display = 'block'

const resultsToHtml = (stores, query) => !stores.length
	? `<div class="search__result">No results for <strong>${query}</strong></div>`
	: stores.map(store => 
	`
     <a href="/store/${store.slug}" class="search__result">
        <strong>${store.name}</strong>
     </a>
    `)
	.join('')

const moveAmongResults = (e, a, b) => console.log(a)

const typeAhead = (search) => {
	if (search) {
		const input = search.querySelector('input[name="search"]')
		const results = search.querySelector('.search__results')

		input.on('input', () => input.value 
			? show(results) && axios
				.get(`/api/search?q=${input.value}`)
				.then(stores => 
					results.innerHTML = dompurify
						.sanitize(resultsToHtml(stores.data, input.value))
				).catch(console.error)
			: hide(results)
		)

		input.on('keyup', (e) => {
			const enterKeycode = 13
			const downKeycode = 40
			const upKeycode = 38
			
			if ([enterKeycode, downKeycode, upKeycode].includes(e.keyCode)) {
				const activeClass = 'search__result--active'
			    const current = search.querySelector(`.${activeClass}`)
			    const items = search.querySelectorAll('.search__result')
			    let next = 0

			    if (e.keyCode === downKeycode && current) {
			      next = current.nextElementSibling || items[0]
			    } else if (e.keyCode === downKeycode) {
			      next = items[0]
			    } else if (e.keyCode === upKeycode && current) {
			      next = current.previousElementSibling || items[items.length - 1]
			    } else if (e.keyCode === upKeycode) {
			      next = items[items.length - 1]
			    } else if (e.keyCode === enterKeycode && current.href) {
			      window.location = current.href
			      return
			    }
			    if (current) {
			      current.classList.remove(activeClass);
			    }
			    next.classList.add(activeClass)
			}
		})

	}
}

export default typeAhead