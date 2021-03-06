define(['jquery', 'backbone', 'underscore', 'app', 'collections/InteractionList'],
    function($, Backbone, _, App, InteractionList, queryModal) {

        // Renders context actions for selection packages and files
        return Backbone.View.extend({
            el: '#notification-area',
            template: _.compile($("#template-notification").html()),

            events: {
                'click .btn-query': 'openQuery',
                'click .btn-notification': 'openNotifications'
            },

            tasks: null,
            // area is slided out
            visible: false,
            // the dialog
            modal: null,

            initialize: function() {
                this.tasks = new InteractionList();

                this.$el.calculateHeight().height(0);

                App.vent.on('interaction:added', _.bind(this.onAdd, this));
                App.vent.on('interaction:deleted', _.bind(this.onDelete, this));

                var render = _.bind(this.render, this);
                this.listenTo(this.tasks, 'add', render);
                this.listenTo(this.tasks, 'remove', render);

            },

            onAdd: function(task) {
                this.tasks.add(task);
            },

            onDelete: function(task) {
                this.tasks.remove(task);
            },

            render: function() {

                // only render when it will be visible
                if (this.tasks.length > 0)
                    this.$el.html(this.template(this.tasks.toJSON()));

                if (this.tasks.length > 0 && !this.visible) {
                    this.$el.slideOut();
                    this.visible = true;
                }
                else if (this.tasks.length === 0 && this.visible) {
                    this.$el.slideIn();
                    this.visible = false;
                }

                return this;
            },

            openQuery: function() {
                var self = this;

                _.requireOnce(['views/queryModal'], function(modalView) {
                    if (self.modal === null) {
                        self.modal = new modalView();
                        self.modal.parent = self;
                    }

                    self.modal.model = self.tasks.at(0);
                    self.modal.render();
                    self.modal.show();
                });

            },

            openNotifications: function() {

            }
        });
    });