$(document).ready(function() {
	setTimeout(app.nsac.carregou, 500);
});
app.nsac = {
	login : function() {
		var txtMat = $("#Mat");
		var txtSenha = $("#pass");
		if (txtMat.val() === "") {
			navigator.notification.alert("Digite o número de matrícula!", function() {
			}, "Login");
			return;
		}
		if (txtSenha.val() === "") {
			navigator.notification.alert("Digite a senha!", function() {
			}, "Login");
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
				if (match) {
				}

				//testa se server ok
				if (status !== "success") {
					navigator.notification.alert("Falha ao conectar ao servidor", function() {
					}, "Login");
					return;
				}

				if (response.search("incorreto!") !== -1) {
					navigator.notification.alert("Nome de usuário ou senha incorreto", function() {
					}, "Login");
					return;
				}
				if (response.search("bemvindo") === -1) {
					navigator.notification.alert("Falha ao conectar ao servidor", function() {
					}, "Login");
					return;
				}
				if ($("#salvar").is(":checked")) {
					localStorage.setItem("mat", txtMat.val());
					localStorage.setItem("senha", txtSenha.val());
				} else {
					localStorage.clear();
				}
				app.nsac.abrirBoletim();

			},
			error : function(data) {
				//a);
			}
		});
	},

	abrirBoletim : function() {
		$.ajax({
			url : "http://www.cti3.feb.unesp.br/nsac/index.php?pag=boletim",
			type : "get",
			success : function(data) {
				var Lista = $(".list");
				Lista.html("");
				Lista.append(data);
			}
		});

	},
	carregou : function() {
		if (localStorage.getItem("mat") !== null) {
			$("#salvar").attr("checked", "checked");
			$("#Mat").val(localStorage.getItem("mat"));
			$("#pass").val(localStorage.getItem("senha"));
		}
	}
};
