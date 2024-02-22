<template>
    <div>
    <NavBar @trash-items="trashItem">
        <template v-slot:createIcon>
            <v-icon
            large
            style="margin-left:20%"
            color="blue darken-2"
            @click="newNotes()"
            >
                mdi-note-text
            </v-icon>
        </template>
        <template v-slot:deleteIcon>
            <v-icon 
            style="margin-left:35%;float:right"
            clickable
            @click="moveToTrash()"
            >mdi-delete</v-icon>
        </template>
    </NavBar>
    <v-layout>
        <v-card width="30%">
            <v-list>
                <v-list-item v-for="notes in Notes" :key="notes._id" @click="getSpecificNote(notes._id)">
                    <v-card :style="[currentNote == notes._id?{'background-color': 'lightblue'}:'']" outlined>
                        <p>{{  notes.title }}</p>
                        <p >{{ notes.description.length>30?notes.description.substring(0,30)+'...':notes.description}}</p>
                    </v-card>
                    <v-divider></v-divider>
                </v-list-item>
            </v-list>
        </v-card>
        <v-card width="70%">
            <div v-if="Notes.length!=0">
                <v-textarea
                style="background-color: white;"
                v-model="noteData"
                @input="updateNote()"
                auto-grow
                rows="30"
                ></v-textarea>
            </div>
        </v-card>   
    </v-layout>
</div>
</template>

<script>

import NavBar from './NavBar.vue'
import axios from 'axios';
export default {
    name:'AllNotes',
    data(){
        return{
            Notes:[],
            trashNotes:[],
            currentNote:"",
            noteData:'',
    }
    },
    components:{
        NavBar,
    },
    mounted(){
        this.getAllNotes();
    },
    watch:{
        currentNote:function(){
            this.getSpecificNote(this.currentNote);
        },
    },
    methods:{
        getSpecificNote(noteid){
            this.currentNote = noteid;
            axios.get(`http://localhost:3000/getSpecificNote/${noteid}`).then(res=>{
                this.noteData = res.data.title+'\n'+res.data.description;
            })
        },
        newNotes(){
          axios.post('http://localhost:3000/newNote').then(res=>{
            this.Notes = res.data;
            this.currentNote = this.Notes[this.Notes.length-1]._id;
          })
        },
        moveToTrash(){
            axios.post(`http://localhost:3000/moveTotrashBin/${this.currentNote}`).then(res=>{
                this.Notes = res.data;
            })
        },
        trashItems(){
            axios.get('http://localhost:3000/trashItems').then(res=>{
                this.Notes = res.data;
                if(this.Notes.length!=0){
                    this.currentNote = res.data[0]._id;
                }
            })
        },
        getAllNotes(){
            axios.get('http://localhost:3000/getAllNotes').then(res=>{
            this.Notes = res.data;
            this.currentNote = res.data[0]._id;
          })
        },
        trashItem(value){
            if(value){
                this.trashItems();
            }
            else{
                this.getAllNotes();
            }
        },
        updateNote(){
            axios.post(`http://localhost:3000/updateNote/${this.currentNote}`,{
            val:this.noteData
            }).then(res=>{
                this.Notes = res.data;
            })
        }
    }
}
</script>