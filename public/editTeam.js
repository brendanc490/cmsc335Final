// p1
const p1 = document.getElementById("p1");

// p2
const p2 = document.getElementById("p2");

// p3
const p3 = document.getElementById("p3");

// p4
const p4 = document.getElementById("p4");

// p5
const p5 = document.getElementById("p5");

// p6
const p6 = document.getElementById("p6");

const p = document.getElementById("name");
const pSprite = document.getElementById("pSprite");
const m1 = document.getElementById("m1");
const m2 = document.getElementById("m2");
const m3 = document.getElementById("m3");
const m4 = document.getElementById("m4");

var pokedex;
const pokemon = [];
var moves = [];
var activePokemon;

window.onload = async function() {
    let res = await fetch('https://pokeapi.co/api/v2/pokedex/2');
    let pokedex = await res.json();
    let options = "";
    let gen1 = [];
    pokedex.pokemon_entries.forEach((mon) => {
        pokemon.push(mon.pokemon_species.name.charAt(0).toUpperCase()
        + mon.pokemon_species.name.slice(1))
    })

    autocomplete(p, pokemon);
    autodisplay(p, pokemon);
    p1.onclick = changeActivePokemon;
    p2.onclick = changeActivePokemon;
    p3.onclick = changeActivePokemon;
    p4.onclick = changeActivePokemon;
    p5.onclick = changeActivePokemon;
    p6.onclick = changeActivePokemon;


    autocomplete(m1,moves)
    autodisplay(m1, moves)

    autocomplete(m2,moves)
    autodisplay(m2, moves)

    autocomplete(m3,moves)
    autodisplay(m3, moves)

    autocomplete(m4,moves)
    autodisplay(m4, moves)

    m1.onchange = changeMove
    m2.onchange = changeMove
    m3.onchange = changeMove
    m4.onchange = changeMove



}


p.onchange = async function () {
    if(p.value == team[activePokemon.id].name){
      return;
    }
    if(pokemon.includes(p.value)){
        for(let i = 1; i <= 6; i++){
            if(activePokemon.id == "p"+i){
                continue;
            }
            if(team["p"+i].name == p.value){
                alert('No Duplicate Pokemon Allowed');
                p.value = ""
                return
            }
        }
        let res = await fetch('https://pokeapi.co/api/v2/pokemon/'+(p.value.toLowerCase()));
        let pokeData = await res.json();

        moves = [];
        activePokemon.src = pokeData.sprites.versions['generation-i']['red-blue'].front_default;
        pSprite.src = pokeData.sprites.versions['generation-i']['red-blue'].front_default;
        pokeData.moves.forEach((move) => {
            if(gen1Moves[move.move.name]){
                moves.push(move.move.name.charAt(0).toUpperCase()
                + move.move.name.slice(1))
            }
        })
        moves.sort((a,b) => a.localeCompare(b))
        pSprite.style.display = 'block';
        team[activePokemon.id].name = p.value;
        team[activePokemon.id].sprite = pokeData.sprites.versions['generation-i']['red-blue'].front_default;
        activePokemon.style.opacity = 1;

        resetMoveUI(m1);
        resetMoveUI(m2);
        resetMoveUI(m3);
        resetMoveUI(m4);

        m1.disabled = false;
        m2.disabled = false;
        m3.disabled = false;
        m4.disabled = false;

    } else {
        resetPokemonUI();
        activePokemon.style.opacity = 0;
    }
}

async function changeActivePokemon(evt) {
    active = evt.target;
    p.disabled = false;
    if(activePokemon == active){
        return;
    } else {
        if(activePokemon){
            activePokemon.parentElement.style.backgroundColor = 'white'
        }
    }
    moves = []
    if(team[active.id].name){
        let res = await fetch('https://pokeapi.co/api/v2/pokemon/'+(team[active.id].name.toLowerCase()));
        let pokeData = await res.json();
        pokeData.moves.forEach((move) => {
            if(gen1Moves[move.move.name]){
                moves.push(move.move.name.charAt(0).toUpperCase()
                + move.move.name.slice(1))
            }
        })
        
        moves.sort((a,b) => a.localeCompare(b))
        p.value = team[active.id].name;
        m1.disabled = false;
        m2.disabled = false;
        m3.disabled = false;
        m4.disabled = false;
        updateMoveUI(team[active.id].m1,m1);
        updateMoveUI(team[active.id].m2,m2);
        updateMoveUI(team[active.id].m3,m3);
        updateMoveUI(team[active.id].m4,m4);
        
        m1.value = team[active.id].m1.name;
        m2.value = team[active.id].m2.name;
        m3.value = team[active.id].m3.name;
        m4.value = team[active.id].m4.name;
        pSprite.src = pokeData.sprites.versions['generation-i']['red-blue'].front_default
        if(pSprite.src){
            active.style.opacity = "1"
        }

    } else {
        p.value = ""
        resetPokemonUI();
    }
    activePokemon = active;
    active.parentElement.style.backgroundColor = 'red'
}

async function changeMove(evt) {
    let move = evt.target;
    if(move.value == team[activePokemon.id][move.id].name){
      return;
    }
    if(gen1Moves[move.value.toLowerCase()]){
        for(let i = 1; i <= 4; i++){
            if(move.id == "m"+i){
                continue
            }
            if(team[activePokemon.id]["m"+i].name == move.value){
                alert('No duplicate moves allowed')
                move.value = ""
                return;
            }
        }

        let res = await fetch('https://pokeapi.co/api/v2/move/'+move.value.toLowerCase());
        let moveData = await res.json();


        let newMove = {}
        newMove.name = move.value;
        newMove.power = moveData.power ? moveData.power : "--";
        newMove.accuracy = moveData.accuracy ? moveData.accuracy : "--";
        newMove.pp = moveData.pp ? moveData.pp : "--";
        newMove.description = moveData.effect_entries[0].short_effect;
        newMove.type = moveData.type.name.charAt(0).toUpperCase()+moveData.type.name.slice(1);

        if(moveData.past_values.length > 0 && moveData.past_values[0].version_group == "gold-silver"){
            if(moveData.past_values[0].power != null){
                newMove.power = moveData.past_values[0].power
            }
            if(moveData.past_values[0].accuracy != null){
                newMove.accuracy = moveData.past_values[0].accuracy
            }
            if(moveData.past_values[0].pp != null){
                newMove.pp = moveData.past_values[0].pp
            }
        }   
        
        team[activePokemon.id][move.id] = newMove;
        updateMoveUI(newMove, move)


    } else {
        resetMoveUI(move);
        
    }
}

function resetPokemonUI(){
    moves = [];
    pSprite.style.display = 'none';
    team[activePokemon.id].name = "";
    team[activePokemon.id].sprite = "";
    m1.disabled = true;
    m2.disabled = true;
    m3.disabled = true;
    m4.disabled = true;
    resetMoveUI(m1);
    resetMoveUI(m2);
    resetMoveUI(m3);
    resetMoveUI(m4);

}

function updateMoveUI(move, elem){
    elem.parentElement.parentElement.parentElement.querySelectorAll("div")[2].innerText = "Type: "+move.type;
    elem.parentElement.parentElement.parentElement.querySelectorAll("div")[3].innerText = "Power: "+move.power;
    elem.parentElement.parentElement.parentElement.querySelectorAll("div")[4].innerText = "Accuracy: "+move.accuracy;
    elem.parentElement.parentElement.parentElement.querySelectorAll("div")[5].innerText = "PP: "+move.pp;
    elem.parentElement.parentElement.parentElement.querySelectorAll("div")[6].innerText = "Description: "+move.description;
}

function resetMoveUI(move) {
    move.value = "";
    move.parentElement.parentElement.parentElement.querySelectorAll("div")[2].innerText = "Type: ";
    move.parentElement.parentElement.parentElement.querySelectorAll("div")[3].innerText = "Power: ";
    move.parentElement.parentElement.parentElement.querySelectorAll("div")[4].innerText = "Accuracy: ";
    move.parentElement.parentElement.parentElement.querySelectorAll("div")[5].innerText = "PP: ";
    move.parentElement.parentElement.parentElement.querySelectorAll("div")[6].innerText = "Description: ";
    let newMove = {}
    newMove.name = "";
    newMove.power = "";
    newMove.accuracy = "";
    newMove.pp = "";
    newMove.description = "";
    newMove.type = "";
    team[activePokemon.id][move.id] = newMove;
}

function autocomplete(inp) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        if(inp.id == "name"){
          arr = pokemon;
        } else {
          arr = moves;
        }
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            console.log('making it')
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("mousedown", function(e) {
                      
              inp.value = this.getElementsByTagName("input")[0].value;

            closeAllLists();
            inp.dispatchEvent(new Event('change'));
            team[activePokemon.id][inp.id] = this.getElementsByTagName("input")[0].value;
        });
           
            console.log(b.onclick)
            a.appendChild(b);
          }
        }
    });

    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = inp.parentNode.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }


  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}

  function autodisplay(inp) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("focus", function(e) {
      if(inp.id == "name"){
        arr = pokemon;
      } else {
        arr = moves;
      }
        if(inp.value == ""){
            closeAllLists();
            var a, b, i, val = inp.value;
            a = document.createElement("DIV");
            a.setAttribute("id", inp.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            inp.parentNode.appendChild(a);
            for (i = 0; i < arr.length; i++) {
                b = document.createElement("DIV");
                  b.innerHTML += arr[i]
                  /*insert a input field that will hold the current array item's value:*/
                  b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                    b.addEventListener("mousedown", function(e) {
                      
                      inp.value = this.getElementsByTagName("input")[0].value;

                    closeAllLists();
                    inp.dispatchEvent(new Event('change'));
                    team[activePokemon.id][inp.id] = this.getElementsByTagName("input")[0].value;
                });
                a.appendChild(b);
            }
        }
    })

    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = inp.parentNode.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }


  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}

async function sendTeam() {
  for(let i = 1; i <= 6; i++){
    if(team['p'+i].name == ""){
      alert('Must have 6 pokemon in the team.');
      return;
    }
    for(let j = 1; j <= 4; j++){
      if(team["p"+i]["m"+j].name == ""){
        alert('Each pokemon must have 4 moves.');
        return;
      }
    }
  }
  let res;
    try {
        res = await fetch('./team', {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(team),
        });

    } catch (e) {
        alert('Failed to save team');
        return;
    }
    
    if(!res.ok){
        alert('Failed to save team');
        return;
    } 

    alert('Successfully saved team.');
}

function navToHome(){
  if(confirm('You might lose any unsaved changes. Return anyway?')){
      window.location = window.origin+"/main";
  }

}
