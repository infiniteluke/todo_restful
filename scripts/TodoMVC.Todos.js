/*global TodoMVC */
'use strict';

TodoMVC.module('Todos', function (Todos, App, Backbone) {
	// Todo Model
	// ----------
	Todos.Todo = Backbone.Model.extend({
		defaults: {
			title: '',
			completed: false,
		},
		
		parse: function(response) {
			if (response.data) {
				return response.data[0];
			}
			return response;
		},

		toggle: function () {
			return this.set('completed', !this.isCompleted());
		},

		isCompleted: function () {
			return this.get('completed');
		},

		matchesFilter: function (filter) {
			if (filter === 'all') {
				return true;
			}

			if (filter === 'active') {
				return !this.isCompleted();
			}

			return this.isCompleted();
		}
	});

	// Todo Collection
	// ---------------
	Todos.TodoList = Backbone.Collection.extend({
		model: Todos.Todo,

		url: ENV+'api/todos',
		// Drupal sends models buried inside data
		parse: function(response) {
			return response.data;
		},

		comparator: 'created',

		getCompleted: function () {
			return this.filter(this._isCompleted);
		},

		getActive: function () {
			return this.reject(this._isCompleted);
		},

		_isCompleted: function (todo) {
			return todo.isCompleted();
		}
	});
});
