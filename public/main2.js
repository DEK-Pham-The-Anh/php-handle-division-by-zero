function convert() {
    var input = $('#input').val();
    var output = '';
    var inputLength = input.length;
    var res = [];
    var resText = [];
    var regexWordChar = /\w/gm;
    var regexFuncName = /[a-zA-Z0-9_:->]/gm;
  
    for (var i = 0; i < inputLength; i++) {
      var char = input[i];
      var charL = input[i - 1];
      var charR = input[i + 1];
      var charLL = input[i - 2];
      var charRR = input[i + 2];
      
      if (char == '/') {
        if (charL == ' ' && charR == ' ') { 
          var division = [];
          
          if (charLL == ')') { 
            var paranR = 1;
            var paranL = 0;
            var func = false;
            for (var j = i - 3; j > -1; j--) { 
              if (input[j] == ')') { 
                paranR++;
              } else if (input[j] == '(') {  
                paranL++; 
                
                for (var k = j - 1; k > -1; k--) { 
                  if (input[k] == ' ' || input[k] == '$') { 
                    if (func) {
                      break;
                    }
                    func = false;
                    break;
                  } else if (input[k].match(regexFuncName)) {
                    func = true;
                  }
                }
                
                if (regexWordChar.exec(input[j - 1]) == null) {  
                  if (paranR == paranL) {  
                    division.push(j);
                    break;
                  } else if ((paranR == paranL + 1 || paranR + 1 == paranL) && func == true) { 
                    division.push(j + 1);
                    break;
                  }
                }
              } else if (paranR == paranL && (input[j] == ' ' || input[j] == '(')) { 
                division.push(j + 1);
                break;
              }
            }
          } else { 
            for (var j = i - 3; j > -1; j--) { 
              if (input[j] == ' ' || input[j] == '(' || input[j] == ',') { 
                division.push(j + 1);
                break;
              }
            }
          }
          
          if (charRR == '(') {
            var paranR = 0;
            var paranL = 1;
            for (var j = i + 3; j < inputLength; j++) {
              if (input[j] == '(') {
                paranL++;
              } else if (input[j] == ')') {
                paranR++;
                if (paranL == paranR) {
                  division.push(j);
                  break;
                }
              } 
            }
          } else {
            var paranR = 0;
            var paranL = 0;
            for (var j = i + 3; j < inputLength; j++) {
              if (input[j] == '(') {
                paranL++;
              } else if (input[j] == ')') {
                paranR++;
                if (regexWordChar.exec(input[j + 1]) == null || input[j + 1] == ';' || input[j + 1] == "\n") {
                  if (paranL == paranR) {
                    division.push(j);
                  } else {
                    division.push(j - 1);
                  }
                  break;
                }
              } else if ((input[j] == ';' || input[j] == "\n") || ((input[j] == ' ' || input[j] == ',') && paranL == paranR))  {
                division.push(j - 1);
                break;
              }
            }
          }
          
          division.push(i);
          
          res.push(division);
        }
      }
    }
    
    for (var k = 0; k < res.length; k++) {
      var div = res[k];
      
      if (div.length === 3) {
        var division = input.substring(div[0], div[1] + 1);
        var divisor = input.substring(div[2] + 2, div[1] + 1);
        resText.push({
          'division': division,
          'divisor': divisor
        });
      }
    }
    // console.log(resText);
    var resUnique = [];
    var resUniqueTemp = [];
    $.each(resText, function(i, el){
        if ($.inArray(el.division, resUniqueTemp) === -1) {
          resUnique.push(el);
          resUniqueTemp.push(el.division);
        }
    });
    // console.log(resUnique);
    getOutput(sortArrayByObjPropLength(resUnique, 'division', 'desc'));
  }
  
function getOutput(data) {
    var text = $('#input').val();
    var ifdivisorzero = $('#ifdivisorzero').val();
    
    for (var i = 0; i < data.length; i++) {
        var divisionOld = data[i].division;
        var divisor = data[i].divisor;
        var divisionNew = '(' + divisor + ' != 0 ? ' + divisionOld + ' : ' + ifdivisorzero + ')';
        console.log(i, ' >>> ', divisionOld, ' >>> ', divisionNew);
        text = text.replaceAll(divisionOld, divisionNew);
    }
    
    $('#output').val(text);
  }
  
function sortArrayByObjPropLength(arr, objProp, order) {
  if (order == 'asc') {
	  return arr.sort(function (a, b) {
    	return a[objProp].length - b[objProp].length; 
    });
  } else if (order == 'desc') { 
  	return arr.sort(function (a, b) {
    	return b[objProp].length - a[objProp].length; 
    });
  } else {
  	return "Invalid argument 'order' - only 'asc' or 'desc' allowed";
  }
}

$('#convert').on('click', convert);