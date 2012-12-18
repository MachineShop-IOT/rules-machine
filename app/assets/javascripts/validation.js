
function ValidateEmail(email) {
  var email_regex = /^[A-Z0-9._%+]+@[A-Z0-9.]+\.[A-Z]{2,4}$/i;
  return email_regex.test(email);
}

function validate(){
	var email = $('#then_action_send_to_1').val();
	if (ValidateEmail(email)) {
		return true;
	}


	else {
		alert('Please use correct email format');
  	return false;
	}
}


 // if (email_regex.test(email) == false) {
  //	 alert('Please use correct email format, dammit');
  	// return false;
//	}
// }


// function ValidateEmail(mail)   
// {  
//  if (/^\S+@\S+\.\S+$/.test(mail))  
//   {  
//     return (true)  
//   }  
//     alert("You have entered an invalid email address!")  
//     return (false)  
// } 