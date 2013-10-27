app.nsac = {
	login : function() {
		console.log("dfdf");
		var txtMat = $("#Mat");
		var txtSenha = $("#pass");
		if (txtMat.val() === "") {
			navigator.notification.alert("Digite o número de matrícula!", function(){}, "Login");
			return;
		}
		if (txtSenha.val() === "") {
			navigator.notification.alert("Digite a senha!", function(){}, "Login");
			return;
		}
		
		Data = "txtMat=" + txtMat.val() + " &txtSenha=" + txtSenha.val() + "&inputsubmit1=+++Logar+++&pagina=login";
		$.ajax({
			url : "http://www.cti3.feb.unesp.br/nsac/verifica_login.php",
			type : "POST",
			data : Data,
			success : function(response, status, request) {
				console.log(response);
				console.log(status);
				var header = request.getAllResponseHeaders();
				var match = header.match(/(Set-Cookie|set-cookie): (.+?);/);
				if (match){}
				
				//testa se server ok
				if(status !== "success"){
					navigator.notification.alert("Falha ao conectar ao servidor", function(){}, "Login");
					return;
				}
				
				if(response.search("incorreto!") !== -1){
					navigator.notification.alert("Nome de usuário ou senha incorreto", function(){}, "Login");
					return;
				}
				if(response.search("bemvindo") === -1){
					navigator.notification.alert("Falha ao conectar ao servidor", function(){}, "Login");
					return;
				}
				
				navigator.notification.alert("Login ok!");					
			},
			error : function(data) {
				//a);
			}
		});
	}
};
