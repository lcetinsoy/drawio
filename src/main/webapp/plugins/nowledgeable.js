
/**
 * Explore plugin.
 */
Draw.loadPlugin(function(editorUi)
{
//        var editor = editorUi.editor
//        var graph  = editor.graph
        
        var onDraw = function(canvas, svgRoot){
           
            var dataUrl = canvas.toDataURL('image.png')
  
            window.parent.postMessage({ //use to send message for cross domains
                name: 'diagramUpdated',
                diagramDataUrl: dataUrl
            }, "*"); 
        }
        
        
        function sendDiagramToNowledgeable(){
             editorUi.editor.exportToCanvas(onDraw)
        }
        
        editorUi.actions.get('save').funct = sendDiagramToNowledgeable
      
      
        setInterval(sendDiagramToNowledgeable, 1000)
      
});
