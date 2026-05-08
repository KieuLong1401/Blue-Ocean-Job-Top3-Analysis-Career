console.log('포트폴리오가 로드되었습니다.')

class ParticleSystem {
	constructor() {
		this.canvas = document.createElement('canvas')
		this.ctx = this.canvas.getContext('2d')
		this.particles = []
		this.particleCount = 80
		this.time = 0

		this.canvas.style.position = 'fixed'
		this.canvas.style.top = '0'
		this.canvas.style.left = '0'
		this.canvas.style.zIndex = '1'
		this.canvas.style.pointerEvents = 'none'

		document.body.prepend(this.canvas)

		this.resize()
		window.addEventListener('resize', () => this.resize())

		this.init()
		this.animate()
	}

	resize() {
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
	}

	init() {
		this.particles = []
		for (let i = 0; i < this.particleCount; i++) {
			this.particles.push({
				x: Math.random() * this.canvas.width,
				y: Math.random() * this.canvas.height,
				vx: (Math.random() - 0.5) * 0.3,
				vy: (Math.random() - 0.5) * 0.3,
				radius: Math.random() * 1.5 + 0.5,
				twinkle: Math.random() * Math.PI * 2,
				speed: Math.random() * 0.02 + 0.01
			})
		}
	}

	animate() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		this.time++

		this.particles.forEach((p) => {
			p.x += p.vx
			p.y += p.vy
			p.twinkle += p.speed

			if (p.x < 0) p.x = this.canvas.width
			if (p.x > this.canvas.width) p.x = 0
			if (p.y < 0) p.y = this.canvas.height
			if (p.y > this.canvas.height) p.y = 0

			const brightness = (Math.sin(p.twinkle) + 1) / 2
			const alpha = 0.4 + brightness * 0.6

			const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 8)
			gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.3})`)
			gradient.addColorStop(0.5, `rgba(255, 255, 255, ${alpha * 0.1})`)
			gradient.addColorStop(1, `rgba(255, 255, 255, 0)`)

			this.ctx.fillStyle = gradient
			this.ctx.beginPath()
			this.ctx.arc(p.x, p.y, p.radius * 8, 0, Math.PI * 2)
			this.ctx.fill()

			this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
			this.ctx.beginPath()
			this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
			this.ctx.fill()

			this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`
			this.ctx.beginPath()
			this.ctx.arc(p.x, p.y, p.radius * 0.5, 0, Math.PI * 2)
			this.ctx.fill()
		})

		requestAnimationFrame(() => this.animate())
	}
}

window.addEventListener('DOMContentLoaded', () => {
	new ParticleSystem()
	initScrollAnimations()
	initTimelineProgress()
})

function initScrollAnimations() {
	const observerOptions = {
		threshold: 0.1,
		rootMargin: '0px 0px -50px 0px'
	}

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				const element = entry.target

				if (element.tagName === 'H2') {
					element.classList.add('fade-in-up')
				}

				if (element.classList.contains('job-grid')) {
					element.querySelectorAll('.job-card').forEach((card, index) => {
						card.classList.add('fade-in-up', `stagger-${index % 4 + 1}`)
					})
				}

				if (element.classList.contains('skill-container')) {
					element.querySelectorAll('.skill-item').forEach((item, index) => {
						const animClass = index % 2 === 0 ? 'fade-in-left' : 'fade-in-right'
						item.classList.add(animClass, `stagger-${(index % 4) + 1}`)
					})
				}

				if (element.classList.contains('timeline')) {
					element.querySelectorAll('.timeline-item').forEach((item, index) => {
						item.classList.add('fade-in-up', `stagger-${index % 4 + 1}`)
					})
				}

				observer.unobserve(element)
			}
		})
	}, observerOptions)

	document.querySelectorAll('h2, .job-grid, .skill-container, .timeline').forEach((el) => {
		observer.observe(el)
	})
}

function initTimelineProgress() {
	const roadmapSection = document.getElementById('roadmap')
	const timeline = document.querySelector('.timeline')
	const progressBar = document.querySelector('.progress-bar')

	if (!roadmapSection || !timeline || !progressBar) return

	window.addEventListener('scroll', () => {
		const timelineRect = timeline.getBoundingClientRect()
		const timelineStart = timelineRect.top - window.innerHeight
		const timelineHeight = timelineRect.height

		const scrolled = window.innerHeight - timelineStart
		const progress = Math.max(0, Math.min(scrolled / (timelineHeight + window.innerHeight), 1))

		progressBar.style.height = progress * 100 + '%'
	})
}
