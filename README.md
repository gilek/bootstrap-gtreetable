GTreeTable
==========

GTreeTable is an extension of [Twitter Bootstrap 3](http://getbootstrap.com), which allows to use tree structure inside HTML table. 
It is possible to indicate tree node position and execute CRUD operation on it.

See [live demo](http://gtreetable.gilek.net).

![](http://gtreetable.gilek.net/assets/gtreetable-demo.png)

Installing and configuration
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
