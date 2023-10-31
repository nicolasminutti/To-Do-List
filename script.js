// Función para agragar una tarea a la lista de tareas
function addTask(task, description, priority) {
	const id = uuidv4()
	const dateTime = new Date().toISOString()
	const checkValue = false
	const newTask = {
		id,
		task,
		description,
		priority,
		dateTime,
		checkValue
	}
	let tasks = JSON.parse(localStorage.getItem('tasks')) || []
	tasks.push(newTask)
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

// Función para generar UUID v4 para un ID único de Tarea
function uuidv4() {
	return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
		(
			c ^
			(crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
		).toString(16)
	)
}

// Función para mostrar las tareas ordenadas por prioridad en la lista
function renderTasks() {
	const priorityValues = {
		'Alta': 3,
		'Media': 2,
		'Baja': 1
	}
	const taskList = document.getElementById('taskList')
	taskList.innerHTML = ''
	let tasks = JSON.parse(localStorage.getItem('tasks')) || []
	tasks.sort((a, b) => {
		return priorityValues[b.priority] - priorityValues[a.priority]
	})
	tasks.forEach((task) => {
		const timeNow = new Date()
		const timeCard = new Date(task.dateTime)
		const time = timeElapsed(timeNow, timeCard)
		const colorBorder = task.priority === 'Baja' ? 'text-bg-info' : task.priority === 'Media' ? 'text-bg-warning' : 'text-bg-danger'
		const listItem = document.createElement('div')
		listItem.classList.add('col')
		listItem.innerHTML = `<div class="card h-100 route__filter">
								<div class="card-header ${colorBorder} text-end">
									<button type="button" class="btn btn-link" onclick="deleteTask('${task.id}')"><img src="/assets/bootstrap/icons/trash3.svg"></img></button>
								</div>
								<div class="card-body route__parent">
									<h5 class="card-title route__text">${task.task}</h5>
									<p class="card-text">
										<div class="form-check form-check-inline">
											<input class="form-check-input" type="checkbox" id="${task.id}" onclick="checkChange('${task.id}')">
											<p class="fs-6 text-wrap route__text" id="texto-${task.id}">${task.description}</p>
										</div>
									</p>
								</div>
								<div class="card-footer fs-6 text-body-secondary text-end text-wrap">
    								${time}
 								</div>
							</div>`
		taskList.appendChild(listItem)
	})
	updateRemainingTasks()
}

// Función para el actualizado de tareas pendientes
function updateRemainingTasks() {
	const remainingTasks = document.getElementById('remainingTasks')
	let tasks = JSON.parse(localStorage.getItem('tasks')) || []
	remainingTasks.textContent = tasks.length
}

// Función para borrar una tarea de la lista de tareas
function deleteTask(idToDelete) {
	let tasks = JSON.parse(localStorage.getItem('tasks')) || []
	let index = tasks.findIndex(x => x.id === idToDelete)
	tasks.splice(index, 1)
	localStorage.setItem('tasks', JSON.stringify(tasks))
	renderTasks()
}

// Event listener para el formulario
document.getElementById('taskForm').addEventListener('submit', function (e) {
	e.preventDefault()
	const task = document.getElementById('task').value
	const description = document.getElementById('description').value
	const priority = document.querySelector('input[name="priority"]:checked').value
	addTask(task, description, priority)
	renderTasks()
	this.reset()
})

// Función para el check de la tarea
function checkChange(textTask) {
	let tasks = JSON.parse(localStorage.getItem('tasks')) || []
	let index = tasks.findIndex(x => x.id === textTask)

	let textTaskToChange = 'texto-' + textTask
	let item = document.getElementById(textTaskToChange)
	item.classList.toggle('text-decoration-line-through')
}


// Event listener para contar la cantidad de caracteres en el TitleTask
document.getElementById('task').addEventListener('input', function (e) {
	const maxLength = 30
	const strLength = e.target.value.length
	const charRemain = maxLength - strLength
	const charNumTask = document.getElementById('charNumTask')
	if (charRemain <= 0) {
		charNumTask.innerHTML = '<span style="color: red;">Límite de ' + maxLength + ' caracteres</span>'
	} else {
		charNumTask.innerHTML = charRemain + ' caracteres restantes'
	}
})

document.getElementById('task').addEventListener("blur", function (e) {
	document.getElementById("charNumTask").innerHTML = ' '
})

// Event listener para contar la cantidad de caracteres en el DescriptionTask
document.getElementById('description').addEventListener('input', function (e) {
	const maxLength = 100
	const strLength = e.target.value.length
	const charRemain = maxLength - strLength
	const charNumDescription = document.getElementById('charNumDescription')
	if (charRemain <= 0) {
		charNumDescription.innerHTML = '<span style="color: red;">Límite de ' + maxLength + ' caracteres</span>'
	} else {
		charNumDescription.innerHTML = charRemain + ' caracteres restantes'
	}
})

document.getElementById('description').addEventListener('blur', function (e) {
	document.getElementById('charNumDescription').innerHTML = ' '
})

function timeElapsed(startDate, endDate) {
	const elapsedTime = startDate - endDate
	const minutesEplased = Math.floor(elapsedTime / 60000)
	const hoursElapsed = Math.floor(minutesEplased / 60)
	const minutesRemaining = minutesEplased % 60
	const daysElapsed = Math.floor(elapsedTime / 86400000)
	const monthsElapsed = Math.floor(daysElapsed / 30)
	let result = ''
	if (monthsElapsed > 0) {
		result += `${monthsElapsed} mes(es), `
		daysElapsed -= monthsElapsed * 30
	}
	if (daysElapsed > 0) {
		result += `${daysElapsed} día(s), `
		hoursElapsed -= daysElapsed * 24
	}
	result += `${hoursElapsed} hora(s), ${minutesRemaining} minuto(s)`
	return result
}

// Función para el LiveSearch de Tareas
document.addEventListener('DOMContentLoaded', () => {
	const input = document.getElementById('search')
	input.addEventListener('input', search)
})

const search = (e) => {
	const inputValue = e.target.value
	const routeContainer = document.getElementById('route')
	const routeDetail = [...routeContainer.getElementsByClassName('route__filter')]
	let foundElements = false
	for (let i = 0; i < routeDetail.length; i++) {
		let searchTerm = [...routeDetail[i].querySelectorAll('.route__parent .route__text')]
		searchTerm = [...searchTerm.map((item) => item.innerHTML)]
		if (searchTerm.map(text => text.includes(inputValue)).some(val => val == true)) {
			routeDetail[i].style.display = 'row row-cols-1 row-cols-md-3 g-4'
			foundElements = true
		} else {
			routeDetail[i].style.display = 'none'
		}
	}
	if (!foundElements) {
		const alertSearch = document.createElement('div')
		alertSearch.classList.add('alert', 'alert-warning', 'alert-dismissible', 'fade', 'show')
		alertSearch.setAttribute('role', 'alert')
		alertSearch.textContent = 'Intente otro criterio de búsqueda'
		const insertAlert = document.getElementById('route')
		insertAlert.appendChild(alertSearch)
		const buttonAlert = document.createElement('button')
		buttonAlert.type = 'button'
		buttonAlert.classList.add('btn-close')
		buttonAlert.setAttribute('data-bs-dismiss', 'alert')
		buttonAlert.setAttribute('aria-label', 'Close')
		alertSearch.appendChild(buttonAlert)
		setTimeout(() => {
			location.reload()
		}, 2000)
	}
}

// Representación inicial de las tareas
renderTasks()