(function($){

    var loadMsg = "Loading Sally items";

    function selPart(docName, root) {
        return function(_message) {
          var message = unserialize(_message);
          console.log(message);
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
        var asm = new sally.HTMLASM();
        $(root).find("span").each(function(idx, obj) {
            var href = $(obj).attr("jobad:href");
            if (typeof(href) == "undefined")
                return;
            $(obj).addClass("jobad-ref");
            var part = new sally.HTMLAtomic
        	part.mmturi = new sally.MMTUri
        	part.mmturi.uri = href;

            $(obj).data("partid", idx);
            $(obj).data("fileName", docName);

            part.id = idx;
            asm.parts.push(part);
        });

        var asmdata = new sally.AlexData();
        asmdata.fileName = docName;
        asmdata.data = JSON.stringify(serialize(asm));
        $.cometd.batch(function () {
            $.cometd.subscribe("/html/htmlSelectPart", selPart(docName, root));
            $.cometd.publish("/service/sketch", serialize(asmdata));
        });
   }

   function createShowFrameRequest(target) {
        var fileName = $(target).data("fileName");

        var frame = new sally.SallyFrame;
        frame.fileName = fileName;
        return frame;
   }

   function createSelectRequest(target) {
        var fileName = $(target).data("fileName");
        var partid = $(target).data("partid");

        var sketchSelect = new sally.HTMLSelect;
        sketchSelect.id = partid;
        sketchSelect.fileName = fileName;
        sketchSelect.position = new sally.ScreenCoordinates;
        sketchSelect.position.x = event.pageX;
        sketchSelect.position.y = event.pageY;
        return sketchSelect;
   }

    JOBAD.modules.register({
    info:{
        'identifier':   'sally.text.module',
        'title':    'Semantic Ally Module',
        'author':   'Constantin Jucovschi',
        'description':  'A generic module enabling connection with Semantic Alliance Framework.',
        'hasCleanNamespace': false,
        'dependencies' : ['sally.module']
    },

    init: function(JOBADInstance, url, doc){
        JOBADInstance.Event.on("sally_connect", this.sally_connect.bind(this));
    },

    contextMenuEntries: function(target, JI) {
        var href = $(target).attr("jobad:href");

        if (typeof(href) == "undefined")
            return;

        $.cometd.batch(function () {
            $.cometd.publish("/service/sketch", serialize(createSelectRequest(target)))
            $.cometd.publish("/service/sketch", serialize(createShowFrameRequest(target)))
        });

        var result = {};
        result[loadMsg] = false;
        return result;
    },

    leftClick: function(target, JOBADInstance) {
        var href = $(target).attr("jobad:href");

        if (typeof(href) == "undefined")
            return;

        $.cometd.publish("/service/sketch", serialize(createSelectRequest(target)))
    },

    sally_connect: function(params) {
        var JOBADInstance = params.instance;
        var doc = params.doc;
        this.localStore.set("fileName", doc+"-txt");
        createDoc(JOBADInstance.element, doc+"-txt");
    }
   });
})(JOBAD.refs.$);