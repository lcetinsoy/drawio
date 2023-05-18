Draw.loadPlugin(function (ui) {
  // Fonction pour charger un graphe à partir d'une chaîne XML
  function loadGraphFromXml(graph, xmlString) {
    const doc = mxUtils.parseXml(xmlString);
    const codec = new mxCodec(doc);
    codec.decode(doc.documentElement, graph.getModel());
  }

  const parentWindow = window.parent;

  ui.editor.addListener('init', function() {

    parentWindow.postMessage({ type: 'pluginLoaded' }, '*');

  })
  
  // Écoutez le message de la fenêtre parente pour charger le graphe
  window.addEventListener('message', function (event) {
    if (event.data.type === 'loadGraph') {
      loadGraphFromXml(graph, event.data.graphXml);
    }

    if (event.data.type === 'updateUi'){
      eval('(' + event.data.strUiUpdaterFunction + ')')(ui);
    }
  });

  // Fonction pour obtenir le graphe au format XML
  function getGraphXml(graph) {
    const encoder = new mxCodec();
    const node = encoder.encode(graph.getModel());
    return mxUtils.getXml(node);
  }

  // Chargez le graphe à partir de la variable previousAnswer du parent
  let editorUi = ui.editor
  const graph = editorUi.graph;



  function sendDiagramUpdate(graphXml) {
    editorUi.exportToCanvas( function (canvas, svgRoot) {

      var dataUrl = canvas.toDataURL('image.png')
  
      window.parent.postMessage({ //use to send message for cross domains
        type: 'graphChanged',
        imageDataUrl: dataUrl,
        graphXml: graphXml

      }, "*");
    })
  }


  // Ajoutez un écouteur pour envoyer le graphe modifié au parent de l'iframe après chaque modification
  graph.getModel().addListener(mxEvent.CHANGE, function () {
    const graphXml = getGraphXml(graph);
    
    sendDiagramUpdate(graphXml)
  });
});