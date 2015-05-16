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
		// These won't be sent back to server when saving.
		blacklist: ['id', 'self'],
		parse: function(response) {
			if (response.data) {
				return response.data[0];
			}
			return response;
		},
		// Overwrite save function to omit attributes that can't be received by Drupal
		save: function(attrs, options) {
			options || (options = {});
			attrs || (attrs = _.clone(this.attributes));

			// Omit blacklist
			attrs = _.omit(this.attributes, this.blacklist);

			options.data = JSON.stringify(attrs);

			// Proxy the call to the original save function
			Backbone.Model.prototype.save.call(this, attrs, options);
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

		url: 'http://todo-restful/api/v1.0/todos/',
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
