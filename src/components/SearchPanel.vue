<template>
<div id="main">
  <v-container>
   <v-card>
     <v-card-title>Enter Search Terms:</v-card-title>
     <v-container>
     <v-row>
        <v-col cols="4">
         <v-autocomplete
          :items="diseases"
          label="Disease" 
          v-model="selected_disease"
          v-on:change="changeDisease"
        ></v-autocomplete>
      </v-col> 
       <v-col cols="4">
         <v-autocomplete
          :items="genes"
          label="Gene" 
          v-on:change="changeGene"
          v-model="selected_gene"
        ></v-autocomplete>
       </v-col> 
      <v-col cols="4">
         <v-autocomplete
          :items="variants"
          label="Variant"
          v-model="selected_variant"
        ></v-autocomplete>
       </v-col> 
    
     </v-row>
     <v-row>
       <v-col cols="4">
         <v-btn small v-on:click="showGraph('d')">Explore</v-btn>
       </v-col>
       <v-col cols="4"><v-spacer></v-spacer>
         <v-btn small v-on:click="showGraph('g')">Explore</v-btn>
       </v-col>
       <v-col cols="3">
         <v-btn small v-on:click="showGraph('v')">Explore</v-btn>
       </v-col>
         <v-col align="right" cols="1">
         <v-btn small v-on:click="getAllData">Reset</v-btn>
       </v-col>
     </v-row>
     <v-row>
       
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
    name: 'SearchPanel',
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
    changeDisease(){
      console.log('New Disease:', this.selected_disease);
      let query = 'match (g:Gene) -[:IMPLICATED_IN]->(d:Disease {name:"'+ this.selected_disease + '"}) return g';
      const session1 = this.$neo4j.getSession()
      session1.run(query).then(res => {
          // console.log(res.records);
          if (res.records.length > 0) {
            this.genes = [];
            for (let i = 0; i < res.records.length; i++ ){
              this.genes.push(res.records[i].get('g').properties.name);
            }
            this.genes.sort();
          }
      });
    },
  //match (v:Variant)-[:FOR_GENE]->(g:Gene {name:"BRAF"})<-[:ASSOCIATED_WITH]-(d:Disease{name:"RASopathy"}) return v
    changeGene(){
      console.log('New Gene:', this.selected_gene);
      let query = 'match (v:Variant) -[:FOR_GENE]->(g:Gene {name:"'+ this.selected_gene + '"}) ';
      if (this.selected_disease.length > 1) {
        query += '<-[:ASSOCIATED_WITH]-(d:Disease{name:"' + this.selected_disease + '"})';
      } 
      query += " return v"
      const session1 = this.$neo4j.getSession()
      session1.run(query).then(res => {
          console.log(res.records);
          if (res.records.length > 0) {
            this.variants = [];
            for (let i = 0; i < res.records.length; i++ ){
              this.variants.push(res.records[i].get('v').properties.name);
            }
            this.variants.sort();
          }
      });
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
      if ( this.showCircles ) {
        this.redrawGraph(selectedNodeType);
        return;
      }
      if (selectedNodeType == 'g' && (this.selected_gene).length > 1 ) { // Gene
        popoto.start({
            label: "Gene",
            value: {
                name: this.selected_gene
              }
            });
      }
      if (selectedNodeType == 'v' && (this.selected_variant).length > 1 ) { // Gene
        popoto.start({
            label: "Variant",
            value: {
                name: this.selected_variant
              }
            });
      }
      if (selectedNodeType == 'd' && (this.selected_disease).length > 1 ) { // Gene
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
            this.pmid_ids.sort();
          }
          // Sort the array
          
        }).then(() => {session1.close()});
      const session2 = this.$neo4j.getSession()
      query = 'match (d:Disease) return d';
      session2.run(query).then(res => {
          if (res.records.length > 0) {
            for (let i = 0; i < res.records.length; i++ ){
              this.diseases.push(res.records[i].get('d').properties.name);
            }
          this.diseases.sort();
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
            this.genes.sort();
          }
      }).then(() => {session4.close()});

      
    }
    }

  }
</script>
<style>
.underline { text-decoration: underline; }
.frame {
            height: 550px;
            background-color: #F8F9FB;
            position: relative;
            top: 0;
            opacity: 1;
            max-height: 10000px;
            border-bottom: 1px solid #e6e9ef;
            overflow: hidden;
        }

</style>

