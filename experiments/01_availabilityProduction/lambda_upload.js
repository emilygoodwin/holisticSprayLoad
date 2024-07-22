function lambda_upload (user_data) {
	
	var lambda_url = "<yourLAMBDAaddress>" 
	
	var request = new XMLHttpRequest();

	request.open("POST", lambda_url);

    request.onload = function (e) {
        if (request.readyState === 4) {
            if (request.status === 200) { 
                console.log(request.responseText);
            } else {
                console.error(request.statusText)
            }
        }
    };

    request.onerror = function (e) {
        console.error(request.statusText);
    };

    request.send(user_data);
}