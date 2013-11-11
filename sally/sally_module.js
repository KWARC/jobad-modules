(function($){
    var loadingMessage = "Loading Sally items";

    var moduleURL = JOBAD.util.getCurrentOrigin();

    var _connected = false;

    var letUserChoose = function (_message) {
        var message = unserialize(_message);
        console.log(message);
        function execService(service) {
            return function() {
                var choice = new sally.SallyFrameChoice;
                choice.choiceId = service.id;
                choice.callbackToken = message.callbackToken;
                choice.fileName = message.fileName;
                $.cometd.publish("/service/theo/choice", serialize(choice));
            }
        }

        var status = JOBAD.UI.ContextMenu.updateMenu(function(_menus) {
            var menus = [];
            for (var i=0; i<_menus.length; ++i) {
                if (_menus[i][0]==loadingMessage) {
                    continue;
                }
                menus.push(_menus[i]);
            }
            for (var i=0; i<message.frames.length; i++) {
                var frame = message.frames[i];
                var frameName = frame.frameName; 
                var cFrame = [];
                for (var j=0; j<frame.frameServices.length; ++j) {
                    var service = frame.frameServices[j];
                    var servFun = execService(service);

                    cFrame.push([service.name, servFun]);
                }
                menus.push([frameName, cFrame]);
            }

            return menus;
        });
    }


    var newWindow = function(fileName) {
        return function (_message) {
            var message = unserialize(_message);
            var frame = $("<iframe>").attr("src", message.url).attr("style", "width: 100%; height: 100%;");
            var divStyle = $("<div>").attr("style", "width: 100%; height: 100%;").append(frame);
            console.log($(divStyle));
            $(divStyle).dialog({
                title: message.title,
                position: {
                    "using" : function() {
                        $(this).css("top", message.position.y).css("left", message.position.x); 
                    }
                },
                width: message.sizeX,
                height: message.sizeY,
                close: function() {
                    $(divStyle).empty();
                }
            });
        };
    };

    // Function invoked when first contacting the server and
    // when the server has lost the state of this client
    function _handshakeWrapper(doc, JOBADInstance) {
        return function _metaHandshake(handshake) {
            if (handshake.successful === true) {
                $.cometd.batch(function () {
                    $.cometd.subscribe('/theo/letuserchoose', letUserChoose);
                    $.cometd.subscribe('/theo/newWindow', newWindow(doc));

                    var whoami = new sally.WhoAmI;
                    whoami.clientType = sally.WhoAmI.ClientType.Alex;
                    whoami.environmentType = sally.WhoAmI.EnvironmentType.Web;
                    whoami.documentType = sally.DocType.Sketch;
                    $.cometd.publish('/service/theo/register', serialize(whoami));
                    JOBADInstance.Event.trigger("sally_connect", {"doc": doc, "instance": JOBADInstance});
                 });
            }
        }
    }

    JOBAD.modules.register({
        info:{
            'identifier':   'sally.module',
            'title':    'Semantic Ally Module',
            'author':   'Constantin Jucovschi',
            'description':  'A generic module enabling connection with Semantic Alliance Framework.',
            'hasCleanNamespace': true,
            'externals' : {
                js: ["sally.js", "common.js"]
            }
        },        
        init: function(JOBADInstance, url, doc){
            this.globalStore.set("sally_load_message", loadingMessage);

            var cometURL = url+"cometd";
            $.cometd.configure({ url: cometURL, logLevel: 'info' });

            $.cometd.addListener('/meta/handshake', _handshakeWrapper(doc, JOBADInstance));

            $.cometd.handshake();

        }

    });
})(JOBAD.refs.$);