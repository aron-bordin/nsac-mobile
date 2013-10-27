app.nsac = {
	login : function() {
		var txtMat = $("#Mat");
		var txtSenha = $("#pass");
		if (txtMat.val() === "") {
			alert("Digite o número de matrícula!");
			return;
		}
		if (txtSenha.val() === "") {
			alert("Digite a senha!");
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
					alert("Falha ao conectar ao servidor");
					return;
				}
				
				if(response.search("incorreto!") !== -1){
					alert("Nome de usuário ou senha incorreto");
					return;
				}
				if(response.search("bemvindo") === -1){
					alert("Falha ao conectar ao servidor");
					return;
				}
				
				alert("Login ok!");					
			},
			error : function(data) {
				alert(2);
				$("#txt").html(data);
			}
		});
	}
};
