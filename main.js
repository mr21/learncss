var
	jqHtml,
	jqDemoCode,
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
		jqSpan = null,
		type = node.nodeType,
		tag = node.nodeName,
		isOrphan = orphanTags[ tag ],
		spanHtml = ""
	;
	if ( ( type === 1 && !isOrphan ) || open ) {
		jqSpan = $( "<span>" );
		switch ( type ) {
			case Node.ELEMENT_NODE:
				jqSpan.addClass( "node " + ( !open ?
					"tB" :
					isOrphan ? "tA tB" : "tA"
				));
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
				jqSpan.addClass( "node text" );
				for ( i = 0; o = node.data[ i ]; ++i ) {
					switch ( o ) {
						default   : spanHtml += o; break;
						case "\n" : spanHtml += "<br/>"; break;
						case "\t" : spanHtml += "&nbsp;&nbsp;&nbsp;&nbsp;"; break;
					}
				}
			break;
			case Node.COMMENT_NODE:
				jqSpan.addClass( "node comment" );
				spanHtml = "&lt;!-- "+ node.data +" --&gt;";
			break;
		}
		jqSpan.html( spanHtml );
		jqHtml.append( jqSpan );
		return jqSpan;
	}
	return null;
}

function list( node ) {
	for ( ; node !== null; node = node.nextSibling ) {
		node._span = [];
		node._span[ 0 ] = writeNode( node, 1 );
		list( node.firstChild );
		node._span[ 1 ] = writeNode( node, 0 );
	}
}

function selectDOM( selector ) {
	var selected = !!selector * 1;
	if ( selector ) {
		selectDOM.elems = jqDemoCode.find( selector );
	}
	if ( selectDOM.elems && selectDOM.elems.length ) {
		jqHtml.attr( "select", selected );
		selectDOM.elems.each( function() {
			if ( this._span[ 0 ] ) { this._span[ 0 ].attr( "select", selected ); }
			if ( this._span[ 1 ] ) { this._span[ 1 ].attr( "select", selected ); }
		});
		if ( !selector ) {
			selectDOM.elems = null;
		}
	}
}

window.onload = function() {
	jqHtml = $( "#html" );
	jqDemoCode = $( "#demoCode" );
	list( jqDemoCode.children()[ 0 ] );
	var
		jqHelpDiv = $( "#help" ),
		elLinkSelected = null
	;

	$( "#panel a" ).each( function() {
		this._helpStr = this.title;
		this.title = "";
		$( this ).click( function() {
			selectDOM();
			if ( elLinkSelected ) {
				elLinkSelected.className = "";
			}
			if ( elLinkSelected === this ) {
				jqHelpDiv.text( "" );
				elLinkSelected = null;
			} else {
				this.className = "select";
				jqHelpDiv.text( this._helpStr );
				selectDOM( this.innerHTML.replace( /&gt;/g, ">" ) );
				elLinkSelected = this;
			}
			return false;
		});

	});
};
