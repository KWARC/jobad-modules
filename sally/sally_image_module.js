(function($){
      function createDoc(img, docName) {
        $(img).mapster({
            stroke: true,
            strokeColor: "99CCFF",
            fillColor: "99CCFF",
            fillOpacity: 0.5,
            strokeWidth: 1,
            singleSelect: true
        });

        var map = $($(img).attr("usemap"));
        var asm = new sally.SketchASM

				$(map).find("area").each(function(idx, obj) {
					var part = new sally.SketchAtomic
					part.mmturi = new sally.MMTUri
				  part.mmturi.uri = $(obj).attr("href");
          $(obj).data("partid", idx);
          part.id = idx;
          asm.parts.push(part);

          $(obj).click(function() {
						var partid = $(this).data("partid");
            var sketchSelect = new sally.SketchSelect;
            sketchSelect.id = partid;
            sketchSelect.fileName = docName;
            sketchSelect.position = new sally.ScreenCoordinates;
            sketchSelect.position.x = event.pageX;
            sketchSelect.position.y = event.pageY;
            event.stopPropagation();

            $.cometd.publish("/service/sketch", serialize(sketchSelect))
            return false;
          });

					$(obj).contextmenu(function(event) {
            var frame = new sally.SallyFrame;
            frame.fileName = docName;
            $.cometd.publish("/service/sketch", serialize(frame))
            event.stopPropagation();
            return false;
	        });

        });

        var asmdata = new sally.AlexData
        asmdata.fileName = docName;
        asmdata.data = JSON.stringify(serialize(asm));
        $.cometd.publish("/service/sketch", serialize(asmdata));
			}

	    JOBAD.modules.register({
        info:{
            'identifier':   'sally.image.module',
            'title':    'Semantic Ally Module',
            'author':   'Constantin Jucovschi',
            'description':  'A generic module enabling connection with Semantic Alliance Framework.',
            'hasCleanNamespace': false,
        },
        init: function(JOBADInstance, url, doc){
        	this.setHandler("sally_connect", "sally_connect");
        },

        onEvent: function(evt, elmn, JOBADInstance) {
        	if (evt != "sally_connect")
        		return;
        	var root = JOBADInstance.element;
        	$(root).find("img").each(function(idx) {
        		var usemap = $(this).attr("usemap");
        		if (typeof(usemap) == "undefined")
        			return;
        		createDoc(this, "sketch1.doc-img-"+idx);
        	});
        },

        sally_connect: function(JOBADInstance) {
        	console.log("initing images ");
        }
       });
})(JOBAD.refs.$);