<template>
    <div class="flex flex-col">
    <Navbar/>
<div class="bg-stone-100 min-w-max min-h-screen flex flex-col items-center font-Poppins border-2
 border-stone-100">

 <div class="mt-24">

 <div class="card bg-blue-50 w-96 rounded-md flex flex-col justify-center items-center">
 <div class="p-4 min-w-full">
    <div class="bg-blue-100 font-medium flex flex-row p-4 justify-center items-center font-Poppins rounded-t-md capitalize">{{ clues[0] }}</div>
    <div class="bg-blue-200 font-medium flex flex-row p-4 justify-center items-center font-Poppins capitalize transition-all">{{ hidden_clues[0] }}</div>
    <div class="bg-blue-300 font-medium flex flex-row p-4 justify-center items-center font-Poppins capitalize">{{ hidden_clues[1] }}</div>
    <div class="bg-blue-400 font-medium flex flex-row p-4 justify-center items-center font-Poppins capitalize">{{ hidden_clues[2] }}</div>
    <div class="bg-blue-500 font-medium flex flex-row p-4 justify-center items-center font-Poppins capitalize" :class="gameongoing==true ? 'rounded-b-md' :''  ">{{ hidden_clues[3] }}</div>
    <div class="bg-blue-600 font-medium flex flex-row p-4 justify-center items-center font-Poppins rounded-b-md capitalize" v-if="gameongoing==false">{{status_msg}}</div>
    
    <div class="bg-white mt-2 font-medium flex flex-row p-4 gap-2 justify-center items-center font-Poppins rounded-b-md" v-show="gameongoing==true">
 
        <span class="line-through" v-for="word in attempted_words" v-show="(guess_count>0)">{{word}}</span>
        <span v-show="(guess_count===0)">All 5 clues belong to a common word. Guess the common word in as few clues as possible.</span>
    </div>
</div>


</div>



<div class="mt-2">

    <label class="input input-lg flex flex-row justify-center 
items-center rounded-b-md w-96 shadow-xl">
  <input type="text" :disabled="gameongoing==false" class="grow font-Poppins" placeholder="Guess the word" v-model="current_guess" />
  <button :disabled="gameongoing==false" class="badge badge-lg bg-base-300 font-Poppins" @click="guess(current_guess)">Guess</button>
</label>

</div>
</div>



</div>
</div>
{{guess_count}}
</template>

<script setup>
import Navbar from "@/components/Navbar.vue"
import {ref,onMounted} from "vue"
import {getword} from "@/util/getword.js"


let clues = ref([])
let hidden_clues = ref(['Clue 2','Clue 3','Clue 4','Clue 5'])
let current_guess = ref(null)
let attempted_words = ref([])
let guess_count = ref(0)
let word = ref(null)
let gameongoing = ref(true)
let msgs = ref([])
let status_msg = ref(null)

msgs = ["🎉 Woohoo You won!","😔 Better luck next time."]

onMounted(async()=>{
    

if(localStorage.getItem('gameongoing')){
    if (localStorage.getItem('gameongoing')=='false'){
        gameongoing.value = false
    }
    else{
        gameongoing.value = true
    }
    status_msg.value = localStorage.getItem('status_msg')
    guess_count.value = localStorage.getItem('guess_count')
    hidden_clues.value =JSON.parse(localStorage.getItem('hidden_clues'))
    attempted_words.value =JSON.parse(localStorage.getItem('attempted_words'))
}

    (getword().then((data)=>{
word.value = data[1]
        try{clues.value = data[0]['theme'].slice(0,5)}
        catch{
            getword("swim").then((data)=>{
                clues.value = data[0]['theme'].slice(0,5)
            })
        }

    }))
    
    
    

})

function guess(guess_word){
    if (!guess_word){
        return
    }
    else{
        guess_count.value = guess_count.value + 1
    }
    if ((guess_count.value==4) && ((guess_word.toLowerCase()!=word.value.toLowerCase()))){
status_msg.value = msgs[1]
gameongoing.value = false
hidden_clues.value = clues.value.splice(1,4)

localStorage.setItem("gameongoing", false)
localStorage.setItem("status_msg", msgs[1])
localStorage.setItem("hidden_clues", JSON.stringify(hidden_clues.value))
        return
    }
    else{    
        attempted_words.value.push(guess_word)}
        localStorage.setItem("hidden_clues", JSON.stringify(hidden_clues.value))
        localStorage.setItem("gameongoing", true)
        localStorage.setItem("guess_count", guess_count.value)
        localStorage.setItem("attempted_words", JSON.stringify(attempted_words.value))

    if(guess_word.toLowerCase()!=word.value.toLowerCase()){
        
        
        hidden_clues.value[guess_count.value-1] = clues.value[guess_count.value]
        current_guess.value = ''
        localStorage.setItem("hidden_clues", JSON.stringify(hidden_clues.value))
        localStorage.setItem("gameongoing", true)
        localStorage.setItem("guess_count", guess_count.value)
    }
    else {
        gameongoing.value = false
        hidden_clues.value = clues.value.splice(1,4)
        status_msg.value = msgs[0]
        localStorage.setItem("gameongoing", false)
        localStorage.setItem("status_msg", msgs[0])
     
        localStorage.setItem("hidden_clues", JSON.stringify(hidden_clues.value))
    }
   
}

</script>

