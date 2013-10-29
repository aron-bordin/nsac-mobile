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

	Notas : "",
	Ocorrencias : "",

	abrirOcorrencias : function() {
		var Lista = $("#list");
		if(app.nsac.Ocorrencias.length < 2){
			Lista.html("<p>Você não tem nenhume ocorrência :)");
		} else {
			Lista.html(app.nsac.Ocorrencias);
		}
	},

	abrirBoletim : function() {
		$.ajax({
			url : "http://www.cti3.feb.unesp.br/nsac/index.php?pag=boletim",
			type : "get",
			success : function(data) {
				var Lista = $("#list");
				var Aux = data; // pra salvar as ocorrencias, ja q vem na msm pag
				// boletim
				Aux = Aux.split('<div id="tabs-3">');
				Aux = Aux[1];
				Aux = Aux.split('</div>');
				Aux = Aux[0];
				app.nsac.Ocorrencias = Aux;
				data = data.split('id="cboMateria">');
				data = data[1];
				data = data.split("</select>");
				data = data[0];
				//console.log(data);
				var HTML = "<li><div align='center'> <h3>Selecione a matéria:<h3><select id='cbxMateria'>" + data + "</select>";
				HTML += "<p></p><a class='button' onclick='app.nsac.carregarNota(1)'>   Carregar nota   </a></div></li><li id='nota'></li>";
				Lista.html(HTML);
				app.nsac.inserirMenu();

			}
		});

	},

	inserirMenu : function() {
		var Topo = $("#titulo");
		Topo.html("<h1>NSac Mobile</h1><a class='button' style='float: rigth' id='mostrarMenu' href='javascript:void(null)'>Menu</a>");
		$.UISheet();
		$('.sheet').find('section').append("<ul class='list'></li>");
		$('.sheet .list').append("<li><a class='button' onclick='app.nsac.abrirBoletim()'>Boletim</a></li><li><a class='button' onclick='app.nsac.abrirOcorrencias()'>Ocorrências</a></li><li><a class='button' href='javascript:void(null)'>Cancelar</a></li>");
		$('.sheet .list').append('<h2 style="text-align: center; margin: 20px;">NSac Mobile</h2>');
		$("#mostrarMenu").click(function() {
			$.UIShowSheet();
		});
		$('.sheet .list').click(function() {
			$.UIHideSheet();
		});

	},

	carregarNota : function(i) {
		var Mat = $("#cbxMateria");
		$.ajax({
			url : "http://www.cti3.feb.unesp.br/nsac/ajax/carrega_pre_notas.php?pagina_valida='true'&disciplina='" + Mat.val() + "'&bimestre=" + i,
			type : "get",
			success : function(data) {
				if (data.search('localizada') !== -1) {
					i = 4;
				} else {
					data = data.split('&nbsp;</td><td>');
					data = data[1];
					data = data.split('</td></tr><tr><td');
					data = data[0];
					if (i === 1) {
						app.nsac.Notas = "<div align='center'>";
					}
					app.nsac.Notas += "<p> " + i + "º Bimestre: " + data + "<p>";
				}
				if (i === 4) {
					app.nsac.Notas += ("</div>");
					console.log(app.nsac.Notas);
					$("#nota").html(app.nsac.Notas);
				} else {
					app.nsac.carregarNota(i + 1);
				}
			},
			error : function(data) {
				console.log(data);
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
