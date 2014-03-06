GTreeTable
==========

GTreeTable is an extension of [Twitter Bootstrap 3](http://getbootstrap.com), which allows to use tree structure inside HTML table. 
It is possible to indicate tree node position and execute CRUD operation on it.

See [live demo](http://gtreetable.gilek.net).

You can also see [Yii-GTreeTable](http://www.yiiframework.com/extension/gtreetable/), PHP back-end for Yii Framework.

![](http://gtreetable.gilek.net/assets/gtreetable-demo.png)

Installation
--------------------------
1.First of all - attach required JavaScript and CSS files:

```html
<link rel="stylesheet" type="text/css" href="gtreetable.css" />
<script type="text/javascript" src="http://code.jquery.com/jquery-2.1.0.min.js"></script>
<script type="text/javascript" src="bootstrap-gtreetable.js"></script>
```

2.Create empty HTML table:

```html
<table class="table gtreetable" id="gtreetable"><thead><tr><th>Category</th></tr></thead></table>
```

3.Inside the `jQuery.ready` method or directly after table definition, configure plugin:

```javascript
jQuery('#gtreetable').gtreetable({
    'source': function(id) {
        return '/gtreetable/nodeChildren' + '?id=' + id;
    }
});
```

Source property must return web address, which is depending on node ID and will provide the list of its direct child.
Schema of the transmitted data (JSON) is presented by the following example:
 
``` 
[
	{"id":"22","name":"Category 1","level":"1"},
	{"id":"32","name":"Category 2","level":"1"},
	{"id":"34","name":"Category 4","level":"1"}
]
```

GTreetable allows also for performing an action, in the moment of saving node sate, as well as during operation removal.
Following parameters are responsible for that: `onSave` and `onDelete`. Both need to return `jQuery.ajax` type object. 

```javascript
jQuery('#gtreetable').gtreetable({
    'source': function(id) {
        return '/gtreetable/nodeChildren' + '?id=' + id;
    },
	'onSave':function(node) {
		return jQuery.ajax({
			type: 'POST',
			url: !node.hasClass('node-saved') ? '/gtreetable/nodeCreate' : '/gtreetable/nodeUpdate'+'?id='+node.data('id'),
			data: {
				'parent': node.data('parent'),
				'name': node.find('.node-action input').val()
			},
			dataType: 'json',
			error: function(XMLHttpRequest) {
				alert(XMLHttpRequest.status+': '+XMLHttpRequest.responseText);
			}
		});        
	},
	'onDelete':function(node) {
		return jQuery.ajax({
			type: 'POST',
			url: '/gtreetable/nodeDelete'+'?id='+node.data('id'),
			data: {
				'id' : node.data('id')
			},
			dataType: 'json',
			error: function(XMLHttpRequest) {
				alert(XMLHttpRequest.status+': '+XMLHttpRequest.responseText);
			}
		});  
	}
});
```

User interface elements are in default shown in English. There is a possibility to change language by attaching appropriate files and defining `language` parameter:

```html
<script type="text/javascript" src="languages/bootstrap-gtreetable.pl.js"></script>
```
```javascript
jQuery('#gtreetable').gtreetable({
	'language': 'pl',
    'source': function(id) {
        return '/gtreetable/nodeChildren' + '?id=' + id;
    }
});
```


Configuration
------------

### Properties

+ `nodeIndent` (integer) - Distance between node and its container. The value is multiplied, depending on node level.
+ `language` (string) - Language of displaying user interface elements.
+ `languages` (object) - Contain translations of user interface elements.
+ `defaultActions` (array) - List of default node actions. If it`s set on null, default actions won't be displaying.
+ `actions` (array) - Additional node actions, displayed after default actions. Position in array should be an object in following format:

	```
	{
	    name: 'name',
	    event: function(node, object) {}
	}
	```

+ `loadingClass` (string) - Additional class name, adding to the node at the child loading moment.
+ `inputWidth` (string) - Text input width.
+ `readonly` (boolean) - Determines whether executing action on node is possible or not.
+ `cache ` (boolean) - Determines whether downloaded children can be stored in cache or not.

### Events
+ `onSave` callback(node) - Function triggering at the node adding / edition moment. It must return `jQuery.ajax` object.
+ `onDelete` callback(node) - Function triggering at the node deleting moment. It must return `jQuery.ajax` object.
+ `onSelect` callback(node, object) - Function triggering at the node selecting moment.
