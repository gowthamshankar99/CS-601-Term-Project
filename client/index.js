

// Do the rest call to get the logged in username


function getuserdetails()
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "http://34.229.87.55:3000/username", false ); // false for synchronous request
    xmlHttp.send( null );
    //alert(JSON.stringify(JSON.parse(xmlHttp.responseText).body));
    // create JSON Object 
    var jsonDisplayObject = {}
    jsonDisplayObject.displayName = JSON.parse(xmlHttp.responseText).body.displayName;
    jsonDisplayObject.nickName = JSON.parse(xmlHttp.responseText).body.nickname;
    jsonDisplayObject.userId = JSON.parse(xmlHttp.responseText).body.user_id;
    jsonDisplayObject.picture = JSON.parse(xmlHttp.responseText).body._json.picture.toString().trim();

    //document.getElementById('imageId').src = jsonDisplayObject.picture;
    document.getElementById('modalText').innerText = JSON.stringify(jsonDisplayObject, undefined, '\t');
    var modal = document.getElementById('myModal');
    modal.style.display = "block";
    return xmlHttp.responseText;
}


function closeModal()
{
    var modal = document.getElementById('myModal');
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
//window.onclick = function(event) {
//    if (event.target == modal) {
//        modal.style.display = "none";
//    }
//}

function dataToDatabase()
{
    alert("Data saved successfully");
}


function onLoadExecute()
{
    // do this only if the page is admin 
    if(window.location.href.endsWith("admin"))
    {
        getuserdetails22();
    }
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "http://34.229.87.55:3000/username", false ); // false for synchronous request
    xmlHttp.send( null );
  //  console.log(JSON.parse(xmlHttp.responseText).body.displayName);
    if(JSON.parse(xmlHttp.responseText).body != undefined)
    {
        if(JSON.parse(xmlHttp.responseText).body.displayName)
        {
            //alert('hi');
            document.getElementById('userid').innerHTML = JSON.parse(xmlHttp.responseText).body.displayName;
            document.getElementById('userid').style.color = "white";
            document.getElementById('imageId').src = JSON.parse(xmlHttp.responseText).body._json.picture.toString().trim();
            document.getElementById("login").style.display = 'none';
        }
    }


    else{
        document.getElementById("login").style.display = 'inline';
        document.getElementById("logout").style.display = 'none';

    }


    // check to see if admin logged in
    if(JSON.parse(xmlHttp.responseText).body != undefined)
    {   
       // alert(JSON.parse(xmlHttp.responseText).body.displayName);
        if(JSON.parse(xmlHttp.responseText).body.displayName == "gothamshankar9@gmail.com" || JSON.parse(xmlHttp.responseText).body.displayName == "fazilh@bu.edu")
        {
//            if(!window.location.href.endsWith("admin"))
//            {
                document.getElementById("navlinks2").style.display = 'block';
//            }
            
        }
        else
        {
            document.getElementById("navlinks2").style.display = 'none';
        }
    }

}

window.onload = onLoadExecute;

function verifyErrors()
{

    clearErrorsOnly()
    let flag = true;
  //  alert(document.getElementById('firstName').value);
    let firstnameVal = document.getElementById('firstName').value;
    let secondnameVal = document.getElementById('lastName').value;
    let messageVal = document.getElementById('message').value;
    let emailVal = document.getElementById('email').value;
    if(!/^[a-zA-Z]*$/.test(firstnameVal))
    {
        document.getElementById('firstNameError').textContent = "FirstName/LastName is incorrect. it can contain only alpha characters(No spaces too)";
        document.getElementById('firstNameError').style.color = "red";
        flag = false;
    }
    else if(firstnameVal.length < 2)
    {
        document.getElementById('firstNameError').textContent = "FirstName/LastName cannot have less than 2 characters";
        document.getElementById('firstNameError').style.color = "red";
        flag = false;
    }
    else{
        document.getElementById('firstNameError').textContent = "FirstName/LastName name validated successfully!";
        document.getElementById('firstNameError').style.color = "green";

    }
    if(!/^[a-zA-Z]*$/.test(secondnameVal))
    {
        document.getElementById('lastNameError').textContent = "FirstName/LastName is incorrect. it can contain only alpha characters(No Spaces too)";
        document.getElementById('lastNameError').style.color = "red";
        flag = false;
    }

    else if(secondnameVal.length < 2)
    {
        document.getElementById('lastNameError').textContent = "FirstName/LastName cannot have less than 2 characters";
        document.getElementById('lastNameError').style.color = "red";
        flag = false;
    }
    
    else{
        document.getElementById('lastNameError').textContent = "FirstName/LastName name validated successfully!";
        document.getElementById('lastNameError').style.color = "green";
    }

    if(!messageVal.trim() != "")
    {
        document.getElementById('messageError').textContent = "Message should not be empty";
        document.getElementById('messageError').style.color = "red";
        flag = false;
    }else{
        document.getElementById('messageError').textContent = "Message text area validated successfully!";
        document.getElementById('messageError').style.color = "green";
    }
    
    if(!validateEmail(emailVal))
    {
        document.getElementById('emailError').textContent = "Email is invalid!";
        document.getElementById('emailError').style.color = "red";
        flag = false;
    }
    else{
        document.getElementById('emailError').textContent = "Email is correct!";
        document.getElementById('emailError').style.color = "green";
    }






    if(flag == false)
    {
        return false;
    }
    else{
        return true;
    }



}


function clearErrorsOnly()
{
    document.getElementById('lastNameError').textContent  = "";
    document.getElementById('firstNameError').textContent  = "";
    document.getElementById('messageError').textContent = "";
    document.getElementById('emailError').textContent = "";

}

function deleteRecord(datetime)
{
    datetime = datetime.split(" ").join("_");
    var answer = confirm("Are you sure about deleting the Record?");
//    alert(datetime);
    if(answer)
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", "http://34.229.87.55:3000/deleteRecords/" + datetime, false ); // false for synchronous request
        xmlHttp.send( null );
        location.reload();
        location.reload();
    }
    else{
        location.reload();
    }

}


function clearFields()
{
    document.getElementById('firstName').value = "";
    document.getElementById('lastName').value = "";
    document.getElementById('message').value = "";
    document.getElementById('email').value = "";

    document.getElementById('lastNameError').textContent  = "";
    document.getElementById('firstNameError').textContent  = "";
    document.getElementById('messageError').textContent  = "";
    document.getElementById('emailError').textContent  = "";

}

function validateForm()
{
    let validateFlag = verifyErrors();
    if(validateFlag == true)
    {
        document.getElementById('messageError').textContent = "Facilitator name validated successfully!";
        document.getElementById('messageError').style.color = "green";



        document.getElementById('firstNameError').textContent = "FirstName/LastName validated successfully!";
        document.getElementById('firstNameError').style.color = "green";

        document.getElementById('lastNameError').textContent = "FirstName/LastName validated successfully!";
        document.getElementById('lastNameError').style.color = "green";

        document.getElementById('emailError').textContent = "Email validated Successfully";
        document.getElementById('emailError').style.color = "green";

    }
}

function getuserdetails22() {
    var xmlHttp = new XMLHttpRequest();

    // JSON data hosted in s3 
    xmlHttp.open("GET", "http://34.229.87.55:3000/getMessages", true);
    
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
            if (xmlHttp.status == 200) {
                //alert(xmlHttp.responseText);
                // create header 
                tabBody = document.getElementsByTagName("tbody").item(0);
                rowHead = document.createElement("tr");
                cellHead0 = document.createElement("th");
                cellHead1 = document.createElement("th");
                cellHead2 = document.createElement("th");
                cellHead3 = document.createElement("th");
                cellHead4 = document.createElement("th");
                cellHead5 = document.createElement("th");

                // create headings
                textnodeHead0 = document.createTextNode("");
                textnodeHead1 = document.createTextNode("FirstName");
                textnodeHead2 = document.createTextNode("LastName");
                textnodeHead3 = document.createTextNode("Message");
                textnodeHead4 = document.createTextNode("Email");
                textnodeHead5 = document.createTextNode("DateTime");

                cellHead0.appendChild(textnodeHead0);
                cellHead1.appendChild(textnodeHead1);
                cellHead2.appendChild(textnodeHead2);
                cellHead3.appendChild(textnodeHead3);
                cellHead4.appendChild(textnodeHead4);
                cellHead5.appendChild(textnodeHead5);

                rowHead.appendChild(cellHead0);
                rowHead.appendChild(cellHead1);
                rowHead.appendChild(cellHead2);
                rowHead.appendChild(cellHead3);
                rowHead.appendChild(cellHead4);
                rowHead.appendChild(cellHead5);

                // add it to the row 
                tabBody.appendChild(rowHead);

                for (let i = 0; i < JSON.parse(xmlHttp.responseText).body.Items.length; i++) {
                    if (!document.getElementsByTagName) return;

                    // Create rows to populate the content
                    
                    row = document.createElement("tr");
                    cell0 = document.createElement("td");
                    cell1 = document.createElement("td");
                    cell2 = document.createElement("td");
                    cell3 = document.createElement("td");
                    cell4 = document.createElement("td");
                    cell5 = document.createElement("td");

                    // add the data from the returned JSON object
                    textnode0 = document.createElement("IMG");
                    textnode0.setAttribute("src", "delete.png");
                    textnode0.setAttribute("id", "delete");
                    textnode0.setAttribute("width", "40");
                    textnode0.setAttribute("height", "20");
                    textnode0.setAttribute("alt", "delete");
                    var df = JSON.parse(xmlHttp.responseText).body.Items[i].datetime.S
                   // var df = 1;
                    textnode0.setAttribute('onclick',"deleteRecord(\'"  + df.toString()  + "\' );");
                    textnode1 = document.createTextNode(JSON.parse(xmlHttp.responseText).body.Items[i].FirstName.S);
                    textnode2 = document.createTextNode(JSON.parse(xmlHttp.responseText).body.Items[i].LastName.S);
                    textnode3 = document.createTextNode(JSON.parse(xmlHttp.responseText).body.Items[i].Message.S);
                    textnode4 = document.createTextNode(JSON.parse(xmlHttp.responseText).body.Items[i].Email.S);
                    textnode5 = document.createTextNode(JSON.parse(xmlHttp.responseText).body.Items[i].datetime.S);
                    

                    cell0.appendChild(textnode0);
                    cell1.appendChild(textnode1);
                    cell2.appendChild(textnode2);
                    cell3.appendChild(textnode3);
                    cell4.appendChild(textnode4);
                    cell5.appendChild(textnode5);

                    row.appendChild(cell0);
                    row.appendChild(cell1);
                    row.appendChild(cell2);
                    row.appendChild(cell3);
                    row.appendChild(cell4);
                    row.appendChild(cell5);
                    // append the row.
                    tabBody.appendChild(row);
                    flag1 = true;
                }
                return JSON.parse(xmlHttp.responseText);
            }
        }
    };
    xmlHttp.send();
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }


  $(document).ready(function() {


    $("#successMessage").hide();

        $("img").mouseenter(function() {
            $(this).css("opacity", "0.5");
        });
        $("img").mouseleave(function() {
            $(this).css("opacity", "1.0");
        });


        $("#jquerySubmitButton").click(function() {
            if(verifyErrors() == true)
            {

                $("#successMessage").css('color','green');
                $("#successMessage").show().delay(500).fadeIn(1500);
                alert("Data submitted successfully");
            }
        })

        $( "#accordion" ).accordion({
            heightStyle: "content",
            collapsible: true
        });
  });