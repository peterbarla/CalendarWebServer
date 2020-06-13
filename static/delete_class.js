/* eslint-disable */
function deleteClass(tipus) {
    let realType = null;
    if (HTMLCollection.prototype.isPrototypeOf(tipus)) {
        realType = tipus[0].innerHTML;
    } else {
        realType = tipus.innerHTML;
    }
    let splitted = realType.split(',');
    let realValues = [];
    for( let i = 0; i < splitted.length; i++ ) {
        realValues.push(splitted[i].split(":")[1]);
    }

    realValues[4] = realValues[4].substring(1, realValues[4].indexOf(" ", 1));
    const xhr = new XMLHttpRequest();
    for( let i = 0; i < realValues.length - 1; i++ ) {
        realValues[i] = realValues[i].substring(1, realValues[i].length - 1);
    }
    
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);

        const resultElem = document.getElementById("result");
        resultElem.innerHTML = 'Successfully deleted class!';
        setTimeout(function(){ 
            document.getElementById("result").innerHTML = "";
        }, 2000);
        
        const elem = document.getElementById(realValues[1]);
        elem.remove();
      }
    };
    
    xhr.open('DELETE', `/api/materials/${realValues[0]}/classes?code=${realValues[0]}&typee=${realValues[1]}&day=${realValues[2]}`);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.send(JSON.stringify({
        code: realValues[0],
        type: realValues[1],
        day: realValues[2],
        hour: realValues[3],
        room: realValues[4]
        }));
        
    }