(function() {
	
	window.App = {
		Models: {},
		Collections: {},
		Views: {}
	};
	window.template = function(id) {
		return _.template( $('#' + id).html() );
	};
//from now on to the end we have self-invoking ... function

App.Models.Task = Backbone.Model.extend({
	validate: function(attrs) {
		if (! $.trim(attrs.title) ) {
			return 'A task requires a title';
		}
	}
});

App.Collections.Tasks = Backbone.Collection.extend({
	model: App.Models.Task
});

App.Views.Tasks = Backbone.View.extend({
	tagName: 'ul',

	render: function() {
		this.collection.each(this.addOne, this);
		return this;
	},

	addOne: function(task) {
		//creating a new child view
		var taskView = new App.Views.Task({ model: task });
		//append to the root element
		this.$el.append(taskView.render().el);
	}
});

App.Views.Task = Backbone.View.extend({
	tagName: 'li',

	template: template('taskTemplate'),

	initialize: function() {
		//we update the title of the task-makes announcement that the model has changed
		this.model.on('change', this.render, this);
	},

	events: {
		'click .edit': 'editTask'
	},

	editTask: function() {
		var newTaskTitle = prompt('Edit your task', this.model.get('title'));
		if (!newTaskTitle) return;
		this.model.set('title', newTaskTitle);
	},

	render: function() {
		var template = this.template( this.model.toJSON() );
		this.$el.html( template );
		return this; //returning this from render method
	}
});

var tasksCollection = new App.Collections.Tasks([
	{
	title: 'Send the report no.9',
	priority:  4
	},
	{
	title: 'Eat something, finally',
	priority:  3
	},
	{
	title: 'Get prepared to the exam',
	priority:  5
	}
]);

var tasksView = new App.Views.Tasks({ collection: tasksCollection });
$('.tasks').html(tasksView.render().el);


}) (); // self-invoking .. function end
