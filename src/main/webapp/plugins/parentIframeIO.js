Draw.loadPlugin(function(ui) {
    // Fonction pour charger un graphe à partir d'une chaîne XML
    function loadGraphFromXml(graph, xmlString) {
      const doc = mxUtils.parseXml(xmlString);
      const codec = new mxCodec(doc);
      codec.decode(doc.documentElement, graph.getModel());
    }
  
    // Fonction pour obtenir le graphe au format XML
    function getGraphXml(graph) {
      const encoder = new mxCodec();
      const node = encoder.encode(graph.getModel());
      return mxUtils.getXml(node);
    }
  
    // Chargez le graphe à partir de la variable previousAnswer du parent
    const graph = ui.editor.graph;
    const parentWindow = window.parent;
  
    if (parentWindow && parentWindow.previousAnswer) {
      loadGraphFromXml(graph, parentWindow.previousAnswer);
    }
  
    // Ajoutez un écouteur pour envoyer le graphe modifié au parent de l'iframe après chaque modification
    graph.getModel().addListener(mxEvent.CHANGE, function() {
      const graphXml = getGraphXml(graph);
      parentWindow.postMessage({ type: 'graphChanged', graphXml: graphXml }, '*');
    });
  });