(function($){

  var loadMsg = "Loading Sally items";


  function selPart(docName, map, img) {
    return function(_message) {
      var message = unserialize(_message);
      if (message.fileName != docName)
        return;
      $(map).find("area").each(function(idx, obj) {
        var partid = $(this).data("partid");
        if (partid == message.id) {
          var coords = $(obj).attr("coords").split(",");
          var offset = $(img).offset()
          var top = Math.max(0, offset.top + parseInt(coords[1])-500);
          var left = Math.max(0, offset.left + parseInt(coords[0])-500);
          $(obj).mapster('select');
          $('html, body').animate({
            scrollTop: top,
            scrollLeft: left
          });
        }
      });
    }
  }

  function createDoc(img, docName) {
    var map = $($(img).attr("usemap"));
    var asm = new sally.SketchASM

    $(map).find("area").each(function(idx, obj) {
      var part = new sally.SketchAtomic
      var partid = $(obj).attr("id");
      part.mmturi = new sally.MMTUri
      part.mmturi.uri = $(obj).attr("href");
      $(obj).data("partid", partid);
      $(obj).data("fileName", docName);
      $(obj).attr("data-key", idx);
      part.id = partid;
      asm.parts.push(part);
    });

    $(img).mapster({
      stroke: true,
      strokeColor: "99CCFF",
      fillColor: "99CCFF",
      fillOpacity: 0.5,
      strokeWidth: 1,
      singleSelect: true,
      mapKey: 'data-key'
    });

    var asmdata = new sally.AlexData
    asmdata.fileName = docName;
    asmdata.data = JSON.stringify(serialize(asm));
    $.cometd.batch(function () {
      $.cometd.subscribe('/sketch/sketchSelectPart', selPart(docName, map, img));
      $.cometd.publish("/service/sketch", serialize(asmdata));
    });
  }

  JOBAD.modules.register({
    info:{
      'identifier':   'sally.image.module',
      'title':    'Semantic Ally Module',
      'author':   'Constantin Jucovschi',
      'description':  'A generic module enabling connection with Semantic Alliance Framework.',
      'hasCleanNamespace': false,
      'dependencies' : ['sally.module']
    },
    init: function(JOBADInstance, url, doc){
      JOBADInstance.Event.on("sally_connect", this.sally_connect);
    },

    leftClick: function(target, JOBADInstance) {
      var partid = $(target).data("partid");
      if (typeof(partid) == "undefined")
        return;
      
      var fileName = $(target).data("fileName");

      var sketchSelect = new sally.SketchSelect;
      sketchSelect.id = partid;
      sketchSelect.fileName = fileName;
      sketchSelect.position = new sally.ScreenCoordinates;
      sketchSelect.position.x = event.pageX;
      sketchSelect.position.y = event.pageY;

      $.cometd.publish("/service/sketch", serialize(sketchSelect))
    },

    contextMenuEntries: function(target, JI) {
      var partid = $(target).data("partid");
      if (typeof(partid) == "undefined")
        return;
      
      var fileName = $(target).data("fileName");
      var frame = new sally.SallyFrame;
      frame.fileName = fileName;
      $.cometd.publish("/service/sketch", serialize(frame))
      var result = {};
      result[loadMsg] = false;
      return result;
    },

    sally_connect: function(params) {
      var JOBADInstance = params.instance;
      var doc = params.doc;
      var root = JOBADInstance.element;
      $(root).find("img").each(function(idx) {
        var usemap = $(this).attr("usemap");
        if (typeof(usemap) == "undefined")
          return;
        $(usemap).data("fileName", doc+"-img-"+idx);
        createDoc(this, doc+"-img-"+idx);
      });
    }
  });
})(JOBAD.refs.$);