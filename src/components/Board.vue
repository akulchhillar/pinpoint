<template>
    <div class="flex flex-col">
    <Navbar/>
    
<div class="bg-stone-100 min-w-max min-h-screen flex flex-col items-center font-Poppins border-2
 border-stone-100">


 <div class="mt-24">
    <div v-show="show_skeleton" class="skeleton h-32 w-96"></div> 
 <div v-show="show_skeleton==false" class="card bg-blue-50 w-96 rounded-md flex flex-col justify-center items-center">
 <div class="p-4 min-w-full">
    <div class="bg-blue-100 font-medium flex flex-row p-4 justify-center items-center  rounded-t-md capitalize">{{ clues[0] }}</div>
    <div class="bg-blue-200 font-medium flex flex-row p-4 justify-center items-center  capitalize transition-all">{{ hidden_clues[0] }}</div>
    <div class="bg-blue-300 font-medium flex flex-row p-4 justify-center items-center  capitalize">{{ hidden_clues[1] }}</div>
    <div class="bg-blue-400 font-medium flex flex-row p-4 justify-center items-center  capitalize">{{ hidden_clues[2] }}</div>
    <div class="bg-blue-500 font-medium flex flex-row p-4 justify-center items-center  capitalize" :class="gameongoing==true ? 'rounded-b-md' :''  ">{{ hidden_clues[3] }}</div>
    <div class="bg-blue-600 font-medium flex flex-row p-4 justify-center items-center  rounded-b-md capitalize" v-show="gameongoing==false">{{word}}</div>
    
    <div class="bg-white mt-2 font-medium flex flex-row p-4 gap-2 justify-center items-center  rounded-b-md">
 
        <span class="line-through" v-for="word in attempted_words" v-show="(guess_count>0) && (gameongoing==true)">{{word}}</span>
        <span v-show="(guess_count===0)">All 5 clues belong to a common word. Guess the common word in as few clues as possible.</span>
        <span v-show="gameongoing==false">{{ status_msg }}</span>
    </div>
</div>


</div>



<div class="mt-2" v-show="show_skeleton==false" >

    <label class="input input-lg flex flex-row justify-center 
items-center rounded-b-md w-96 shadow-xl">
  <input type="text" :disabled="gameongoing==false" class="grow " placeholder="Guess the word" v-model="current_guess" />
  <button :disabled="gameongoing==false" class="badge badge-lg bg-base-300 " @click="guess(current_guess)">Guess</button>
</label>

</div>
</div>



</div>
</div>
{{ word }}
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
let show_skeleton = ref(true)

msgs = ["🎉 Woohoo You won!","😔 Better luck next time."]

onMounted(async()=>{
    

// if(localStorage.getItem('gameongoing')){
//     if (localStorage.getItem('gameongoing')=='false'){
//         gameongoing.value = false
//     }
//     else{
//         gameongoing.value = true
//     }
//     status_msg.value = localStorage.getItem('status_msg')

// }

    (getword().then((data)=>{


if (data[0]['theme'].length<5){
    
    getword(true).then((data)=>{
                clues.value = data[0]['theme'].slice(0,5)
                word.value = data[1]
                show_skeleton.value = false
            })

}
else{
    clues.value = data[0]['theme'].slice(0,5)
    word.value = data[1]
    show_skeleton.value = false
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


// localStorage.setItem("gameongoing", false)
// localStorage.setItem("status_msg", msgs[1])

        return
    }
    else{    
        attempted_words.value.push(guess_word)}
        // localStorage.setItem("gameongoing", true)


    if(guess_word.toLowerCase()!=word.value.toLowerCase()){
        
        
        hidden_clues.value[guess_count.value-1] = clues.value[guess_count.value]
        current_guess.value = ''

        // localStorage.setItem("gameongoing", true)

    }
    else {
        gameongoing.value = false
        hidden_clues.value = clues.value.splice(1,4)
        status_msg.value = msgs[0]
    
        // localStorage.setItem("gameongoing", false)
        // localStorage.setItem("status_msg", msgs[0])

    }
   
}

</script>

