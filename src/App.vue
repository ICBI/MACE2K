<template>
  <v-app>
    <v-app-bar
      app
      color="blue"
      dark
    > MACE2K Viz Demo
    </v-app-bar>

    <v-content>
      <HelloWorld/>
      
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from './components/SearchPanel';
import * as popoto from 'popoto';

 
export default {
  name: 'App',
  mounted() {
    // Init popoto
      popoto.query.RESULTS_PAGE_SIZE = 5;
      popoto.graph.USE_FIT_TEXT = true;
      popoto.rest.CYPHER_URL = "http://hypatia.esacinc.com:7474/db/data/transaction/commit";
      popoto.rest.AUTHORIZATION = "Basic " + btoa("neo4j:NIHAI-neo4j");
      popoto.query.USE_RELATION_DIRECTION = true;
      
      // popoto.query.COLLECT_RELATIONS_WITH_VALUES = false;
      popoto.logger.LEVEL = popoto.logger.LogLevels.DEBUG;
      popoto.provider.node.Provider = {
        "PMID": {
                "returnAttributes": ["pmid"],
                "children": ["Disease", "Variant", "Gene"],
                "constraintAttribute": "pmid",
                "displayAttribute": "pmid",
                "autoExpandRelations": false // if set to true Trial nodes will be automatically expanded in graph
            },
        "Gene": {
                "returnAttributes": ["name", "gene_id"],
                "constraintAttribute": "name",
                "displayAttribute": "name",
                "autoExpandRelations": false // if set to true Trial nodes will be automatically expanded in graph
            },
        "Variant": {
          "returnAttributes": ["name", "variant_id"],
            "constraintAttribute": "name",
            "displayAttribute": "name",
            "autoExpandRelations": false 
          },
          "Disease": {
            "returnAttributes": ["name", "disease_id"],
            "constraintAttribute": "name",
            "displayAttribute": "name",
            "autoExpandRelations": false 
          },        
      };
  },
  components: {
    HelloWorld,
  },

  data: () => ({
    //
  }),
};
</script>
