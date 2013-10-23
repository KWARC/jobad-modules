(function($){
  function selPart(docName, root) {
    return function(_message) {
      var message = unserialize(_message);
      if (message.fileName != docName)
        return;
      $(root).find("span").each(function(idx, obj) {
        var partid = $(this).data("partid");
        if (partid == message.id) {
          $(root).find(".text-sel").each(function(idx, obj) {
            $(obj).removeClass("text-sel");
          });
          $(obj).addClass("text-sel");
          $('html, body').animate({
            scrollTop: $(obj).offset().top
          });
        }
      });
    }
  }

      function createDoc(root, docName) {
        var asm = new sally.HTMLASM
		$(root).find("span").each(function(idx, obj) {
            var href = $(obj).attr("jobad:href");
            if (typeof(href) == "undefined")
                return;
            $(obj).addClass("jobad-ref");
            var part = new sally.HTMLAtomic
			part.mmturi = new sally.MMTUri
			part.mmturi.uri = href;
            $(obj).data("partid", idx);

            part.id = idx;
            asm.parts.push(part);

            $(obj).click(function() {
                var partid = $(this).data("partid");
                var sketchSelect = new sally.HTMLSelect;
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
        $.cometd.batch(function () {
            $.cometd.subscribe("/html/htmlSelectPart", selPart(docName, root));
            $.cometd.publish("/service/sketch", serialize(asmdata));
        });
	}

	    JOBAD.modules.register({
        info:{
            'identifier':   'sally.text.module',
            'title':    'Semantic Ally Module',
            'author':   'Constantin Jucovschi',
            'description':  'A generic module enabling connection with Semantic Alliance Framework.',
            'hasCleanNamespace': false,
        },
        init: function(JOBADInstance, url, doc){
            JOBADInstance.Event.on("sally_connect", this.sally_connect);
        },

        sally_connect: function(params) {
            var JOBADInstance = params.instance;
            var doc = params.doc;
            createDoc(JOBADInstance.element, doc+"-txt");
        }
       });
})(JOBAD.refs.$);