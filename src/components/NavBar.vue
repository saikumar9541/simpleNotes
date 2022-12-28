<template>
    <div>
      <v-app-bar width="30%">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" ></v-app-bar-nav-icon>
        <slot name="createIcon" v-if="headingVal"></slot>
        <h1 :style="[headingVal?{'margin-left':'25%'}:{'margin-left':'50%'}]">{{ headingVal ? 'All Notes':'Trash'}}</h1>
        <slot name="deleteIcon" v-if="headingVal"></slot>
      </v-app-bar>
      <v-navigation-drawer
        v-model="drawer"
        absolute
        bottom
        temporary
      >
        <v-list
            nav
            dense
        >
          <v-list-item-group
            v-model="group"
            active-class="deep-purple--text text--accent-4"
          >
          <v-list-item @click="changeitemval()">
            <v-list-item-title>All notes</v-list-item-title>
          </v-list-item>
          <v-list-item @click="changeTrashval()">
            <v-list-item-title>Trash</v-list-item-title>
          </v-list-item>
            </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
</div>
</template>

<script>


export default {
    name:'NavBar',
    data: () => ({
      drawer: false,
      group: null,
      getAllNotes:[],
      headingVal:true,
    }),
    components:{
    },
    methods:{
      changeTrashval(){
        console.log("in nav bar");
        this.drawer =!this.drawer;
        this.headingVal = false;
        this.$emit('trash-items',true);
      },
      changeitemval(){
        this.drawer =!this.drawer;
        this.headingVal = true;
        this.$emit('trash-items',false);
      }
    },
}
</script>