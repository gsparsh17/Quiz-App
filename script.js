const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');
const _correctScore = document.getElementById('correct-score');
const _totalQuestion = document.getElementById('total-question');

let correctAnswer = "", correctScore = askedCount = 0, totalQuestion = 10;

// load question from API

document.addEventListener('DOMContentLoaded', function () {
    var popup = document.getElementById('popup');
    var closeButton = document.getElementById('popup-close');
    var wrapper=document.getElementById('wrapper');

    closeButton.addEventListener('click', function () {
        popup.style.display = 'none';
        wrapper.style.display = 'block';
    });

    // setTimeout(function () {
    //     popup.style.display = 'none';
    // }, 5000); // Automatically close the popup after 5 seconds
});
function filterfunction() {
    var input, filter, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
      txtValue = a[i].textContent || a[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        div.style.display = "";
        a[i].style.display = "block";
        
      } else {
        a[i].style.display = "none";
      }
    }
  }
  input = document.getElementById("myInput");
  fetch('https://opentdb.com/api_category.php')
    .then(response => {return response.json()})
    .then(data => {
        console.log(data);
        console.log(Object.entries(data)[0][1]);
        var entry=Object.entries(data)[0][1]
        console.log(entry)
        var j=0;
        var name=[]
        var index
        for(item in entry)
                {
                    console.log(entry[item].name)
                    index=entry[item].id
                    var my=document.getElementById("myDropdown");
                    my.innerHTML = my.innerHTML+ `<a class="opt" href="#about" onclick="iclick('${entry[item].name}','${index}');">${entry[item].name}</a>`
                }
            })
            
//  var opt=document.getElementsByClassName()
//  opt.addEventListener("click",click())
var id
function iclick(parameter,ind){
    input = document.getElementById("myInput");
    input.value=parameter;
    id=ind;
    console.log(id)
}
async function loadQuestion(){
    console.log(id)
    // const APIUrl = 'https://opentdb.com/api.php?amount=1';
    const result = await fetch(`https://opentdb.com/api.php?amount=1&category=${id}`)
    const data = await result.json();
    _result.innerHTML = "";
    showQuestion(data.results[0]);
}

// event listeners
function eventListeners(){
    _checkBtn.addEventListener('click', checkAnswer);
    _playAgainBtn.addEventListener('click', restartQuiz);
}

document.addEventListener('DOMContentLoaded', function(){
    loadQuestion();
    eventListeners();
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
});


// display question and options
function showQuestion(data){
    _checkBtn.disabled = false;
    correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = incorrectAnswer;
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);
    // console.log(correctAnswer);

    
    _question.innerHTML = `${data.question} <br> <span class = "category"> ${data.category} </span>`;
    _options.innerHTML = `
        ${optionsList.map((option, index) => `
            <li> ${index + 1}. <span>${option}</span> </li>
        `).join('')}
    `;
    selectOption();
}


// options selection
function selectOption(){
    _options.querySelectorAll('li').forEach(function(option){
        option.addEventListener('click', function(){
            if(_options.querySelector('.selected')){
                const activeOption = _options.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
}

// answer checking
function checkAnswer(){
    _checkBtn.disabled = true;
    if(_options.querySelector('.selected')){
        let selectedAnswer = _options.querySelector('.selected span').textContent;
        if(selectedAnswer == HTMLDecode(correctAnswer)){
            correctScore++;
            _result.innerHTML = `<p><i class = "fas fa-check"></i>Correct Answer!</p>`;
        } else {
            _result.innerHTML = `<p><i class = "fas fa-times"></i>Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`;
        }
        checkCount();
    } else {
        _result.innerHTML = `<p><i class = "fas fa-question"></i>Please select an option!</p>`;
        _checkBtn.disabled = false;
    }
}

// to convert html entities into normal text of correct answer if there is any
function HTMLDecode(textString) {
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}


function checkCount(){
    askedCount++;
    setCount();
    if(askedCount == totalQuestion){
        setTimeout(function(){
            console.log("");
        }, 5000);


        _result.innerHTML += `<p>Your score is ${correctScore}.</p>`;
        _playAgainBtn.style.display = "block";
        _checkBtn.style.display = "none";
    } else {
        setTimeout(function(){
            loadQuestion();
        }, 300);
    }
}

function setCount(){
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
}


function restartQuiz(){
    correctScore = askedCount = 0;
    _playAgainBtn.style.display = "none";
    _checkBtn.style.display = "block";
    _checkBtn.disabled = false;
    setCount();
    loadQuestion();
}