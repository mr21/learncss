var
	elHtmlDiv,
	demoCode,
	orphanTags = {
		"INPUT": true,
		"IMG": true,
		"BR": true,
		"HR": true
	},
	attrs = [
		"class",
		"title",
		"href",
		"id",
		"lang",
		"type",
		"name",
		"src",
		"alt"
	]
;

function writeNode( node, open ) {
	var
		i, o, v,
		elSpan = null,
		type = node.nodeType,
		tag = node.nodeName,
		isOrphan = orphanTags[ tag ],
		spanClss = "",
		spanHtml = ""
	;
	if ( ( type === 1 && !isOrphan ) || open ) {
		elSpan = document.createElement( "span" );
		switch ( type ) {
			case Node.ELEMENT_NODE:
				spanClss = "node " + ( !open
					? "tB"
					: ( isOrphan ? "tA tB" : "tA" )
				);
				spanHtml = "<span class='tag'>" + tag.toLowerCase() + "</span>";
				if ( open ) {
					for ( i = 0; o = attrs[ i ]; ++i ) {
						v = node.getAttribute( o );
						if ( v || v === "" ) {
							spanHtml += " <span class='attr'>"+ o +"</span>=<span class='value'>\""+ v +"\"</span>";
						}
					}
				}
			break;
			case Node.TEXT_NODE:
				spanClss = "node text";
				for ( i = 0; o = node.data[ i ]; ++i ) {
					switch ( o ) {
						default   : spanHtml += o; break;
						case "\n" : spanHtml += "<br/>"; break;
						case "\t" : spanHtml += "&nbsp;&nbsp;&nbsp;&nbsp;"; break;
					}
				}
			break;
			case Node.COMMENT_NODE:
				spanClss = "node comment";
				spanHtml = "&lt;!-- "+ node.data +" --&gt;";
			break;
		}
		elSpan.className = spanClss;
		elSpan.innerHTML = spanHtml;
		elHtmlDiv.appendChild( elSpan );
	}
	return elSpan;
}

function list(node) {
	for (; node !== null; node = node.nextSibling) {
		node._span = [];
		node._span[0] = writeNode(node, 1);
		list(node.firstChild);
		node._span[1] = writeNode(node, 0);
	}
}

function selectDOM(selector) {
	var selected = !!selector * 1;
	if (selector)
		selectDOM.elems = demoCode.querySelectorAll(selector);
	if (selectDOM.elems) {
		elHtmlDiv.setAttribute('selected', selected);
		for (var i = 0, e; e = selectDOM.elems[i]; ++i) {
			if (e._span[0]) e._span[0].setAttribute('selected', selected);
			if (e._span[1]) e._span[1].setAttribute('selected', selected);
		}
		if (!selector)
			selectDOM.elems = null;
	}
}

window.onload = function() {
	elHtmlDiv  = document.getElementById('html');
	demoCode = document.getElementById('demoCode');
	var helpDiv = document.getElementById('help');
	list(demoCode.firstChild);
	var links = document.getElementById('panel').getElementsByTagName('a');
	var linkSelected = null;
	for (var i = 0, a; a = links[i]; ++i) {
		a._helpStr = a.title;
		a.title = "";
		a.onclick = function() {
			selectDOM();
			if (linkSelected)
				linkSelected.className = "";
			if (linkSelected === this) {
				linkSelected = null;
				helpDiv.innerHTML = "";
			} else {
				this.className = 'selected';
				helpDiv.innerHTML = this._helpStr;
				selectDOM(this.innerHTML.replace(/&gt;/g, '>'));
				linkSelected = this;
			}
			return false;
		};
	}
};
