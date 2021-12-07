const STORAGE_KEY = 'todos-vuejs-2.0'
const todoStorage = {
  fetch() {
    const todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    todos.forEach((todo, index) =>
      todo.id = index
    )
    todoStorage.uid = todos.length
    return todos
  },
  save(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

const app = new Vue({
  data: {
    todos: todoStorage.fetch(),
    editedTodo: null,
    newTodo: '',
    beforeEditCache: ''
  },
  computed: {
    filteredTodos() {
      return this.todos
    }
  },
  methods: {
    addTodo() {
      const value = this.newTodo && this.newTodo.trim()
      if (!value) {
        return
      }
      this.todos.push({
        id: todoStorage.uid++,
        title: value
      })
      this.newTodo = ''
      todoStorage.save(this.todos)
    },
    editTodo(todo) {
      this.editedTodo = todo
			this.beforeEditCache = todo.title
		},
    doneEdit(todo) {
			if (!this.editedTodo) {
				return
			}
			this.editedTodo = null
			const title = todo.title.trim()
			if (title) {
				todo.title = title;
			} else {
				this.removeTodo(todo)
			}
		},
		cancelEdit(todo) {
			this.editedTodo = null
			todo.title = this.beforeEditCache
		},
    removeTodo(todo) {
      this.todos.splice(this.todos.indexOf(todo), 1)
      todoStorage.save(this.todos)
    }
  },
  directives: {
		'todo-focus'(element, binding) {
			if (binding.value) {
				element.focus();
			}
		}
	}
})
app.$mount('.todoapp')
