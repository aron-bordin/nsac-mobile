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

		Data = "txtMat=" + txtMat.val() + "&txtSenha=" + txtSenha.val() + "&inputsubmit1=+++Logar+++&pagina=login";
		$.ajax({
			url : "http://www.cti3.feb.unesp.br/nsac/verifica_login.php",
			type : "POST",
			data : Data,
			timeout : 5000,
			success : function() {
				console.log("Login");
				setTimeout(app.nsac.loginCompleto, 100);
			},
		});

	},

	BoletimCompleto : function() {
		$.ajax({
			url : "http://www.cti3.feb.unesp.br/nsac/comum/imprimir_boletim.php",
			type : "get",
			timeout : 5000,
			success : function(data) {
				aux = data.split("</head>")[0];
				data = data.split("<table ")[1];
				data = aux + "</head><table " + data;
				data = data.split("<table>")[0];
				console.log(data);

				$("#list").html(data);
			},
			error : function(er) {
				console.log(er);
			}
		});
	},

	loginCompleto : function() {
		var txtMat = $("#Mat");
		var txtSenha = $("#pass");
		$.ajax({
			url : "http://www.cti3.feb.unesp.br/nsac/index.php",
			type : "get",
			timeout : 5000,
			success : function(response, status, request) {
				//testa se server ok
				if (status !== "success") {
					navigator.notification.alert("Falha ao conectar ao servidor", function() {
					}, "Login");
					return;
				}

				if (response.search("Esqueceu sua senha") !== -1) {
					navigator.notification.alert("Nome de usuário ou senha incorreto", function() {
					}, "Login");
					return;
				}
				if (response.search("Seja Bem-Vindo") === -1) {
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
				$(".topcoat-navigation-bar").css("display", "none");
				$("#list").html("<li topcoat-list__item> <div align='center' <h2> Carregando ... </h2></div></li>");
				app.nsac.inserirMenu();
				app.nsac.abrirBoletim();

			},
			error : function(data) {
				navigator.notification.alert("Falha ao se conectar ao servidor!. Verifique sua conexão", function() {
				}, "Falha");
			}
		});
	},

	Notas : "",
	Ocorrencias : "",

	abrirOcorrencias : function() {
		$("#titulo").html("Ocorrências");
		var Lista = $("#list");
		if (app.nsac.Ocorrencias.length < 2) {
			Lista.html("<li class='topcoat-list__item'><p>Você não tem nenhume ocorrência :)</li>");
		} else {
			app.nsac.Ocorrencias = app.nsac.Ocorrencias.replace('<font color="#000000">', "");
			app.nsac.Ocorrencias = app.nsac.Ocorrencias.replace('</font>', "");
			console.log(app.nsac.Ocorrencias);

			Lista.html("<li class='topcoat-list__item'>" + app.nsac.Ocorrencias + "</li>");
		}
	},

	abrirBoletim : function() {
		$("#titulo").html("Boletim");
		$.ajax({
			url : "http://www.cti3.feb.unesp.br/nsac/index.php?pag=boletim",
			type : "get",
			timeout : 5000,
			error : function(data) {
				navigator.notification.alert("Falha ao se conectar ao servidor! Verifique sua conexão", function() {
				}, "Falha");
			},
			success : function(data) {
				var Lista = $("#list");
				var Aux = data;
				// pra salvar as ocorrencias, ja q vem na msm pag
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
				var HTML = "<li class='topcoat-list__item'><div align='center'> <h3>Selecione a matéria:<h3><select id='cbxMateria'>" + data + "</select>";
				HTML += "<p></p><a class='topcoat-button--cta full' onclick='app.nsac.carregarNota(1)'>   Carregar nota   </a></div></li><li class='topcoat-list__item' id='nota'></li>";
				Lista.html(HTML);

			}
		});

	},

	inserirMenu : function() {
		$(function() {
			$('#menu').slicknav({
				closeOnClick : true
			});
		});
	},

	sair : function() {
		window.location.href = "index.html";
	},

	carregarNota : function(i) {
		var Mat = $("#cbxMateria");
		$("#nota").html("<div align='center'><h2>Carregando...</h2></div>");
		$.ajax({
			url : "http://www.cti3.feb.unesp.br/nsac/ajax/carrega_pre_notas.php?pagina_valida='true'&disciplina='" + Mat.val() + "'&bimestre=" + i,
			type : "get",
			timeout : 5000,
			success : function(data) {
				if (data.search('localizada') !== -1) {
					i = 4;
				} else {
					if (data.search("&nbsp;</td><td>") === -1) {
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
				navigator.notification.alert("Falha ao se conectar ao servidor! Verifique sua conexão", function() {
				}, "Falha");
			}
		});

	},
	carregou : function() {

		if (localStorage.getItem("mat") !== null) {
			$("#salvar").attr("checked", "checked");
			$("#Mat").val(localStorage.getItem("mat"));
			$("#pass").val(localStorage.getItem("senha"));
		}
	},

	sobre : function() {
		$("#titulo").html("Sobre");
		var Lista = $("#list");
		var Html = "";
		Html += "<div align='center' ><li class='topcoat-list__item'><h1> NSac Mobile </h1></li>";
		Html += "<li class='topcoat-list__item'><h2> Desenvolvimento </h2>";
		Html += "<p> Aron Barreira Bordin </p>";
		Html += "<p><a href='mailto:aron.bordin@gmail.com'>aron.bordin@gmail.com</a></p>";
		Html += "<p> Versão 1.1 - Aluno </p>";
		Html += "<p> Última atualização: 25/11/2013 </p>";
		Html += "</li>";
		Html += "<li class='topcoat-list__item'> <h2> Licença </h2> ";
		Html += "<p> Projeto de código aberto sobre licença GPLv3.0</p>";
		Html += "<a href='http://www.gnu.org/licenses/gpl.html'> Ler a licença </a><li>";
		Html += "<li class='topcoat-list__item'> <h2> Contribuição </h2>";
		Html += "<p> Por ser um projeto de código aberto, todo o código esta disponível para Download e estudo.<p>";
		Html += "<p> Caso se interesse em colaborar com o desenvolvimento(programando, sugestões, testar versões betas, informar bugs, etc), entre em contato via e-mail, Facebook, Skype, telepatia, ...<br> E assim por diante.</p>";
		Html += "<p> Como dito logo acima, você pode fazer o Download do código e se divertir acessando: <a href='https://github.com/aron-bordin/nsac-mobile'>https://github.com/aron-bordin/nsac-mobile</a></p>";
		Html += "<p> Nos vemos pela rede. T++</p></li></div>";

		Lista.html(Html);
	},

	confirmarDados : function() {
		$.ajax({
			url : "http://www.cti3.feb.unesp.br/nsac/index.php?pag=confirma_dados",
			type : "get",
			timeout : 5000,
			success : function(data) {

				data = data.split('<table style="text-align:left;" cellspacing="10">');
				data = data[1];
				data = data.split("</table>");
				data = data[0];
				$("#list").html(data);
				console.log(data);
			},
			error : function() {
				navigator.notification.alert("Falha ao se conectar ao servidor! Verifique sua conexão", function() {
				}, "Falha");
			}
		});
	}
};
