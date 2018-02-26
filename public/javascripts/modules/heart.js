import { $ } from './bling'
import axios from 'axios'

function ajaxHeart(e){
	e.preventDefault()
	console.log('HEART IT !!!!!!')
	console.log(this.action)
	axios
    	.post(this.action)
    	.then(res => { // because we're using arrow, this = previous this = form
    	  const isHearted = this.heart.classList.toggle('heart__button--hearted')
	      $('.heart-count').textContent = res.data.hearts.length
	      if (isHearted) {
	        this.heart.classList.add('heart__button--float')
	        setTimeout(() => this.heart.classList.remove('heart__button--float'), 2500)
	      }
    	})
    	.catch(console.error)

}

export default ajaxHeart