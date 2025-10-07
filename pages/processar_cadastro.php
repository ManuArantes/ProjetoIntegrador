<?php
// Verifica se o formulário foi enviado pelo método POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Captura e filtra os dados enviados pelo formulário
    $nome = htmlspecialchars($_POST["nome"]);
    $nickname = htmlspecialchars($_POST["nickname"]);
    $cpf = htmlspecialchars($_POST["cpf"]);
    $cidade = htmlspecialchars($_POST["cidade"]);
    $estado = htmlspecialchars($_POST["estado"]);
    $nascimento = htmlspecialchars($_POST["nascimento"]);
    $perfil = htmlspecialchars($_POST["perfil"]);
    $registro = isset($_POST["registro"]) ? htmlspecialchars($_POST["registro"]) : "";
    $concordo = isset($_POST["concordo"]);

    // Verifica se o usuário marcou a opção de concordar com as diretrizes
    if (!$concordo) {
        echo "<h2 style='color:red; text-align:center;'>Você precisa concordar com as Diretrizes de Uso e Proteção de Dados.</h2>";
        echo "<p style='text-align:center;'><a href='cadastro.html'>Voltar ao cadastro</a></p>";
        exit;
    }

    // Exibe os dados enviados (apenas para teste)
    echo "
    <html lang='pt-BR'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Confirmação de Cadastro</title>
        <link rel='stylesheet' href='../styles/estilo.css'>
    </head>
    <body>
        <header>
            <h1>Caminho Leve MC</h1>
            <p>Miastenia Congênita</p>
        </header>

        <main class='bloco'>
            <h2>Cadastro realizado com sucesso!</h2>
            <p>Confira abaixo as informações enviadas:</p>
            <div style='margin-top:20px;'>
                <p><strong>Nome completo:</strong> $nome</p>
                <p><strong>Nickname:</strong> $nickname</p>
                <p><strong>CPF:</strong> $cpf</p>
                <p><strong>Cidade:</strong> $cidade</p>
                <p><strong>Estado:</strong> $estado</p>
                <p><strong>Data de nascimento:</strong> $nascimento</p>
                <p><strong>Perfil:</strong> $perfil</p>";

    if ($perfil == "profissional" && !empty($registro)) {
        echo "<p><strong>Número de registro no conselho:</strong> $registro</p>";
    }

    echo "
            </div>
            <p style='margin-top:30px;'>
                <a href='cadastro.html' class='botao'>Voltar ao Cadastro</a>
                <a href='../index.html' class='botao'>Ir para a Página Inicial</a>
            </p>
        </main>
    </body>
    </html>
    ";
} else {
    // Caso o usuário acesse a página diretamente sem enviar o formulário
    echo "<h2 style='text-align:center; color:red;'>Acesso inválido.</h2>";
    echo "<p style='text-align:center;'><a href='cadastro.html'>Voltar ao cadastro</a></p>";
}
?>
