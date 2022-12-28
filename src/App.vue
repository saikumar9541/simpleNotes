<template>
  <v-app>
    <v-main>
      <AllNotes></AllNotes>
      
    </v-main>
  </v-app>
</template>

<script>
import AllNotes from './components/AllNotes.vue'


export default {
  name: 'App',

  components: {
    AllNotes,
  },

  data: () => ({
    //
  }),
}
</script>
