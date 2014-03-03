/* =========================================================
 * bootstrap-gtreetable.js 1.2a
 * http://gtreetable.gilek.net
 * =========================================================
 * Copyright 2014 Maciej "Gilek" Kłak
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.  
 * ========================================================= */

!function($) {
    var GTreeTable = function(element, options) {

        this.options = $.extend({},$.fn.gtreetable.defaults, options);
        
        var lang = this.options.languages[this.options.language] === undefined ?
                this.options.languages['en'] :
                this.options.languages[this.options.language];

        if (this.options.template === undefined) {
        
            var template = '<table class="table gtreetable">' +
            '<tr class="node node-collapsed">' +
                '<td>' +
                    '<span><span class="node-indent"></span><i class="node-icon glyphicon glyphicon-chevron-right"></i><i class="node-icon-selected glyphicon glyphicon-ok"></i><span class="node-name"></span></span>' +
                    '<span class="hide node-action">' +
                        '<input type="text" name="name" value="" style="width: '+ this.options.inputWidth +'" class="form-control" />' +
                        '<button type="button" class="btn btn-sm btn-primary node-save">' + lang.save + '</button> ' +
                        '<button type="button" class="btn btn-sm node-saveCancel">' + lang.cancel + '</button>' +
                    '</span>' +
                    '<div class="btn-group pull-right">' +
                    '<button type="button" class="btn btn-sm btn-default dropdown-toggle node-actions" data-toggle="dropdown">' +
                        lang.action + ' <span class="caret"></span>' +
                    '</button>' +
                    '<ul class="dropdown-menu" role="menu">' +
                        '<li role="presentation" class="dropdown-header">' + lang.action + '</li>';
                
            this.actions = new Array();
            if (this.options.defaultActions!==null) 
                this.actions = this.options.defaultActions;
        
            if (this.options.actions!==undefined) 
                this.actions.push.apply(this.actions, this.options.actions);
            
            $.each(this.actions, function(index,action) {
                var matches = action.name.match(/\{(.+)\}/);
                var name = matches!==null && matches[1]!==undefined && lang[matches[1]]!==undefined ? lang[matches[1]] : action.name;
                template += '<li role="presentation"><a href="#notarget" class="node-action-'+index+'" tabindex="-1">' + name + '</a></li>';
            }); 
                     
            template += '</ul>' +
                    '</div>' +
                '</td>' +
                '</tr>' +
            '</table>';
            this.options.template = template;
        }
        
        this.cache = new Array();

        this.$tree = element;
        if (!this.$tree.find('tbody').length === 0)
            this.$tree.append('<tbody></tbody>');

        if (!this.options.readonly) {
            this.$tree.addClass('gtreetable-fullAccess');
        }

        this.$nodeTemplate = $(this.options.templateSelector ? this.options.templateSelector : this.options.template).find('.node');
    };

    GTreeTable.prototype = {
        init: function(id) {
            this.fillNodes(id === undefined ? 0 : id, this);
        },

        getNode: function(id) {
            return this.$tree.find('.node' + id);
        },
        getNodeLastChild: function(parentId) {
            var last = undefined;
            $.each(this.getNode(parentId).nextAll('.node'), function(key, node) {
                var node = $(node);
                if (node.data('parent')===parentId) {
                    last = node;
                } else {
                    return last;
                }
            });
            return last;

        },
        getSelected: function() {
            return this.$tree.find('.node-selected');
        },
        getSelectedId: function() {
            var node = this.getSelected();
            return node.data('id');
        },
        getSelectedPath: function() {
            var node = this.getSelected();
            if (!node)
                return node;

            var path = [node.find('.node-name').html()]
                    , parent = node.data('parent');
            node.prevAll('.node').each(function() {
                var $this = $(this);                
                if ($this.data('id')===parent) {
                    parent = $this.data('parent');
                    path[path.length] = $this.find('.node-name').html();
                }
            });
            return path;

        },
        renderNode: function(data) {
            var self = this;
            var node = self.$nodeTemplate.clone(false);
            node.find('.node-name').html(data.name);
            if (data.id !== undefined) {
                node.data('id', data.id);
                node.addClass('node' + data.id);
                node.addClass('node-saved');
            }
            node.data('parent', data.parent);
            node.data('level', data.level);

            node.find('.node-indent').css('marginLeft', (parseInt(data.level) * self.options.nodeIndent) + 'px').html('&zwnj;');

            node.mouseover(function() {
                $(this).addClass('node-hovered');
            });

            node.mouseleave(function() {
                $(this).removeClass('node-hovered');
                $(this).find('.btn-group').removeClass('open');
            });

            node.find('.node-name').click(function() {
                self.$tree.find('.node-selected').removeClass('node-selected');
                var node = $(this).parents('.node');
                node.addClass('node-selected');

                if ($.isFunction(self.options.onSelect)) {
                    self.options.onSelect(node, self);
                }
            });

            node.find('.node-icon').click(function(e) {
                if (node.hasClass('node-collapsed'))
                    self.expandNode(data.id, {
                        isAltPressed: e.altKey
                    });
                else
                    self.collapseNode(data.id);
            });

            $.each(this.actions, function(index,action) {
                node.find('.node-action-'+index).click(function() {
                    action.event(node,self);
                });
            });

            node.find('.node-save').click(function() {
                self.saveNode(node);
            });

            node.find('.node-saveCancel').click(function() {
                self.saveCancelNode(node);
            });

            return node;
        },
        appendNode: function(node) {
            if (this.$tree.find('.node').length === 0)
                this.$tree.append(node);
            else {
                var last = this.getNodeLastChild(node.data('parent'));
                if (last === undefined)
                    last = this.getNode(node.data('parent'))

                last.after(node);
            }
        },
        addNode: function(node) {
            var self = this;
            node.find('.node-icon').css('visibility', 'visible');
            var newNode = self.renderNode({
                'level': parseInt(node.data('level')) + 1,
                'parent': node.data('id')
            });
            newNode.find('.node-action').removeClass('hide');
            self.expandNode(newNode.data('parent'), {
                'onAfterFill': function(self) {
                    self.appendNode(newNode);
                }
            });    
        },
        updateNode: function(node) {
            var nodeName = node.find('.node-name');
            node.find('input').val(nodeName.html());
            nodeName.addClass('hide');
            node.find('.node-action').removeClass('hide');
        },
        removeNode: function(node) {
            var self = this;
            if (node.hasClass('node-saved')) {
                if ($.isFunction(self.options.onDelete))
                    $.when(self.options.onDelete(node)).done(function(data) {
                        delete self.cache[node.data('parent')];
                        if (!(node.prev('.node').data('parent') === node.data('parent') || node.next('.node').data('parent') === node.data('parent')))
                            self.collapseNode(node.data('parent'));
                        else
                            self._removeNode(node.data('id'));
                    });
            } else {
                node.remove();
            }

        },
        _removeNode: function(id) {
            this.removeChildNodes(id);
            this.getNode(id).remove();

        },
        removeChildNodes: function(id) {
            var parent = this.getNode(id);
            var child = parent.nextAll('.node');
            for (var y in child) {
                var node = $(child[y]);
                if (node.data('level') > parent.data('level'))
                    node.remove();
                else
                    break;
            }
        },
        saveNode: function(node) {
            var self = this;
            if ($.isFunction(self.options.onSave)) 
                $.when(self.options.onSave(node)).done(function(data) {
                    delete self.cache[node.data('parent')];
                    var nodeAction = node.find('.node-action');
                    node.find('.node-name').html(nodeAction.find('input').val()).removeClass('hide');
                    nodeAction.addClass('hide');
                    if (!node.hasClass('node-saved')) {
                        node.data('id', data.id);
                        node.addClass('node' + data.id);
                        node.addClass('node-saved');
                    }
                });
        },
        saveCancelNode: function(node) {
            if (node.hasClass('node-saved')) {
                node.find('.node-action').addClass('hide');
                node.find('.node-name').removeClass('hide');
            } else {
                var parent = this.getNode(node.data('parent'));
                if (node.prev('.node').data('parent') === parent.data('id'))
                    node.remove();
                else
                    this.collapseNode(parent.data('id'));
            }
        },
        collapseNode: function(id) {
            this.removeChildNodes(id);
            this.getNode(id).removeClass('node-expanded').addClass('node-collapsed');
        },
        expandNode: function(id, options) {
            var node = this.getNode(id);
            if (!node.hasClass('node-expanded')) {
                this.getNode(id).removeClass('node-collapsed').addClass('node-expanded');
                this.fillNodes(id, options);
            } else
            if (options && typeof options.onAfterFill==='function')
                options.onAfterFill(this);
        },
        fillNodes: function(parentId, options) {
            var self = this;
            if (self.options.cache && self.cache[parentId] && !options.isAltPressed) {
                self._fillNodes(parentId, options);
            } else {
                $.when(self.getSourceNodes(parentId, self)).done(function(data) {
                    self._fillNodes(parentId, options);
                });
            }
        },
        _fillNodes: function(parentId, options) {
            for (x = 0; x < this.cache[parentId].length; x++) {
                var node = this.renderNode(this.cache[parentId][x]);
                var cache = this.cache[node.data('id')];
                if (cache && cache.length === 0 && !options.isAltPressed)
                    node.find('.node-icon').css('visibility', 'hidden');
                this.appendNode(node);
            }
            if (options && typeof options.onAfterFill==='function')
                options.onAfterFill(this);

            var parent = this.getNode(parentId);
            if (parent.next('.node').data('parent') !== parentId)
                parent.find('.node-icon').css('visibility', 'hidden');

        },
        getSourceNodes: function(parentId, self) {
            return $.ajax({
                type: 'GET',
                url: self.options.source(parentId),
                dataType: 'json',
                beforeSend: function() {
                    self.getNode(parentId).find('.node-name').addClass(self.options.loadingClass);
                },
                success: function(nodes) {
                    for (x = 0; x < nodes.length; x++)
                        nodes[x].parent = parentId;
                    self.cache[parentId] = nodes;
                },
                error: function(XMLHttpRequest) {
                    alert(XMLHttpRequest.status + ': ' + XMLHttpRequest.responseText);
                },
                complete: function() {
                    self.getNode(parentId).find('.node-name').removeClass(self.options.loadingClass);
                }
            });
        }
    };

    $.fn.gtreetable = function(option) {
        return this.each(function() {
            var $this = $(this)
                    , obj = $this.data('gtreetable');

            if (!obj) {
                if ($this[0].tagName === 'TABLE') {
                    var obj = new GTreeTable($(this), option);
                    $this.data('gtreetable', obj);
                    obj.init();
                }
            }
        });
    };

    $.fn.gtreetable.defaults = {
        nodeIndent: 16,
        language: 'en',
        languages: {
            en: {
                save: 'Save',
                cancel: 'Cancel',
                action: 'Action',
                actionAdd: 'Add',
                actionEdit: 'Edit',
                actionDelete: 'Delete'
            }
        },
        defaultActions: [
            {
                name: '{actionAdd}',
                event: function(node, object) {
                    object.addNode(node);
                }
            },
            {
                name: '{actionEdit}',
                event: function(node, object) {
                    object.updateNode(node);
                }
            },
            {
                name: '{actionDelete}',
                event: function(node, object) {
                    object.removeNode(node);
                }
            }                    
        ],        
        loadingClass: 'node-loading',
        inputWidth: '60%',
        readonly: false,
        cache: true
    };
}(jQuery);
