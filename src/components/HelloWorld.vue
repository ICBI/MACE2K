<template>
<div id="main">
  <v-container>
   <v-card>
     <v-card-title>Enter Search Terms:</v-card-title>
     <v-container>
     <v-row>
       <v-col cols="4">
         <v-select
          :items="genes"
          label="Gene" 
          v-model="selected_gene"
        ></v-select>
       </v-col> 
      <v-col cols="4">
         <v-select
          :items="variants"
          label="Variant"
          v-model="selected_variant"
        ></v-select>
       </v-col> 
     <v-col cols="4">
         <v-select
          :items="diseases"
          label="Disease" 
          v-model="selected_disease"
        ></v-select>
      </v-col> 
     </v-row>
     <v-row>
       <v-col cols="4">
         <v-btn small v-on:click="showGraph('g')">Explore</v-btn>
       </v-col>
       <v-col cols="4"><v-spacer></v-spacer>
         <v-btn small v-on:click="showGraph('v')">Explore</v-btn>
       </v-col>
       <v-col cols="4">
         <v-btn small v-on:click="showGraph('d')">Explore</v-btn>
       </v-col>
     </v-row>
     </v-container>
   </v-card>
  </v-container>
  <v-container class="fill-height">
    <v-row>
      <v-col cols="12">
        <v-card height="600px">
          <div id="popoto-graph" class="ppt-div-graph frame">
            <!-- Graph will be generated here-->
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  </div>
</template>

<script>
import * as popoto from 'popoto';

  export default {
    name: 'HelloWorld',
    mounted() {
      this.$neo4j.connect('bolt', 'hypatia.esacinc.com', '7687', 'neo4j', 'NIHAI-neo4j', false)
      this.session = this.$neo4j.getSession()
      this.connected = true
      this.getAllData();
    },
    data: () => ({
      connected: false,
      pmid_ids: [],
      genes: [],
      variants: [],
      diseases: [],
      selected_gene: '',
      selected_variant: '',
      selected_disease: '',
      showCircles: false,
    }),
    methods: {
    connect () {
      return this.$neo4j.connect('bolt', 'hypatia.esacinc.com', '7687', 'neo4j', 'NIHAI-neo4j', false)
    },
    driver () {
      // Get a driver instance
      return this.$neo4j.getDriver()
    },

    redrawGraph(selectedNodeType) {
        popoto.dataModel.nodes.length = 0
        popoto.dataModel.links.length = 0;
        popoto.dataModel.nodes = [];
        popoto.dataModel.links = [];
        if (selectedNodeType == 'g' && (this.selected_gene).length > 1 ) { // Gene
          console.log('ReStarting with gene:', this.selected_gene);
          popoto.graph.mainLabel = {
            label: "Gene",
            value: {
                name: this.selected_gene
              }
            };
            popoto.tools.reset();
            return;
        }
        if (selectedNodeType == 'v' && (this.selected_variant).length > 1 ) { // Gene
        console.log('ReStarting with variant:', this.selected_variant);
        popoto.graph.mainLabel = {
            label: "Variant",
            value: {
                name: this.selected_variant
              }
            };
          popoto.tools.reset();
          return;
        }

        if (selectedNodeType == 'd' && (this.selected_disease).length > 1 ) { // Gene
          console.log('ReStarting with disease:', this.selected_disease);
          popoto.graph.mainLabel = {
            label: "Disease",
            value: {
                name: this.selected_disease
              }
            };
          popoto.tools.reset();
          return;
        }
        this.showCircles = true;
    },

    showGraph(selectedNodeType) {
      console.log(this.selected_gene);
      console.log(this.selected_variant);
      console.log(this.selected_disease);
      console.log(selectedNodeType);
      if ( this.showCircles ) {
        this.redrawGraph(selectedNodeType);
        return;
      }
      if (selectedNodeType == 'g' && (this.selected_gene).length > 1 ) { // Gene
      console.log('Starting with gene:', this.selected_gene);
        popoto.start({
            label: "Gene",
            value: {
                name: this.selected_gene
              }
            });
      }
      if (selectedNodeType == 'v' && (this.selected_variant).length > 1 ) { // Gene
      console.log('Starting with variant:', this.selected_variant);
        popoto.start({
            label: "Variant",
            value: {
                name: this.selected_variant
              }
            });
      }
      if (selectedNodeType == 'd' && (this.selected_disease).length > 1 ) { // Gene
      console.log('Starting with disease:', this.selected_disease);
        popoto.start({
            label: "Disease",
            value: {
                name: this.selected_disease
              }
            });
      }
      this.showCircles = true;
      
    },

    getAllData() {
      let query = 'match (p:PMID) return p';
      const session1 = this.$neo4j.getSession()
      session1.run(query).then(res => {
          if (res.records.length > 0) {
            for (let i = 0; i < res.records.length; i++ ){
              this.pmid_ids.push(res.records[i].get('p').properties.pmid_id);
            }
          }
        }).then(() => {session1.close()});
      const session2 = this.$neo4j.getSession()
      query = 'match (d:Disease) return d';
      session2.run(query).then(res => {
          if (res.records.length > 0) {
            for (let i = 0; i < res.records.length; i++ ){
              this.diseases.push(res.records[i].get('d').properties.name);
            }
          }
        }).then(() => {session2.close()});
      const session3 = this.$neo4j.getSession()
      query = 'match (v:Variant) return v';
      session3.run(query).then(res => {
          if (res.records.length > 0) {
            for (let i = 0; i < res.records.length; i++ ){
              this.variants.push(res.records[i].get('v').properties.name);
            }
          }
        }).then(() => {session3.close()});

      const session4 = this.$neo4j.getSession()
      query = 'match (g:Gene) return g';
      session4.run(query).then(res => {
          if (res.records.length > 0) {
            for (let i = 0; i < res.records.length; i++ ){
              this.genes.push(res.records[i].get('g').properties.name);
            }
          }
      }).then(() => {session4.close()});

      
    }
    }

  }
</script>
