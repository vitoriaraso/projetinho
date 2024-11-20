// mostra menu no hover da logo
function apareceMenu() {
    document.getElementById("menuzinho").style.display === "flex";
}

// mostra/esconde menu
function escondeMenu() {
    var menu = document.getElementById("menuLinks");

    if (menu.style.display === "none" || menu.style.display === "") {
        menu.style.display = "block";
    } else {
        menu.style.display = "none";
    }
}



// area do usuario/carrinho so aparece quando ele tá logado
// verifica se o usuário está logado e atualiza alguns itens do menu
document.addEventListener("DOMContentLoaded", function () {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    JSON.parse(sessionStorage.getItem("carrinho"));

    if (usuarioLogado) {
        document.getElementById('linkCarrinho').innerText = `${usuarioLogado.nome}`;
        document.getElementById('linkCarrinhoSair').innerText = "Sair";
        document.getElementById("carrinhoItens").style.display = "flex"
        document.getElementById("menuEntrar").style.display = "none";
        document.getElementById("menuCadastrar").style.display = "none";
        document.getElementById("menuSair").style.display = "flex";
        document.getElementById("entrarIcone").style.display = "none";
    } else {
        document.getElementById("carrinhoItens").style.display = "none"
        document.getElementById("menuSair").style.display = "none";
    }
})



// registro de usuario novo
function validarCad(email, senha) {
    e = document.getElementById(email).value;
    s = document.getElementById(senha).value;
    let confirmarSenha = document.getElementById("confirmarSenha").value;
    const n = document.getElementById('nome').value;

    // verifica se as senhas são iguais
    if (s !== confirmarSenha) {
        alert("As senhas não coincidem. Tente novamente.");
        document.getElementById("senha").value = "";
        document.getElementById("confirmarSenha").value = "";
        return false;
    }

    // verifica se o usuário já está registrado
    const obj = JSON.parse(localStorage.getItem('usuarios')) || { contas: [] };
    var jaExiste = false;

    for (let i = 0; i < obj.contas.length; i++) {
        if (obj.contas[i].email === e) {
            jaExiste = true;
            window.alert("O usuário já existe. Faça login.");
            return false;
        }
    }

    obj.contas.push({ nome: n, email: e, senha: s });
    localStorage.setItem('usuarios', JSON.stringify(obj));

    alert('Usuário registrado com sucesso!');
    return true;
}



// login
function login(email, senha) {
    const e = document.getElementById(email).value;
    const s = document.getElementById(senha).value;

    // recupera o objeto dos usuarios registrados
    const obj = JSON.parse(localStorage.getItem('usuarios'));

    var pos = -1;

    for (let i = 0; i < obj.contas.length; i++) {
        if (e === obj.contas[i].email) {
            pos = i;
            break;
        }
    }

    if (pos === -1) {
        window.alert("O usuário não existe.");
        document.getElementById(email).value = "";
        document.getElementById(senha).value = "";
        return false;
    } else {
        if (s === obj.contas[pos].senha) {
            sessionStorage.setItem('usuarioLogado', JSON.stringify(obj.contas[pos]));
            window.location.href = "index.html";
            return false;
        } else {
            window.alert("Senha incorreta.");
            document.getElementById(senha).value = "";
            return false;
        }
    }
}



// sair do usuario
// encerra o usuarioLogado e o carrinho
function logout() {
    JSON.parse(sessionStorage.getItem('usuarioLogado'));
    JSON.parse(sessionStorage.getItem('carrinho'));
    sessionStorage.removeItem('usuarioLogado');
    sessionStorage.removeItem('carrinho');

    location.reload();
}



// itens no carrinho + subtotal
document.addEventListener("DOMContentLoaded", function () {
    const objSession = JSON.parse(sessionStorage.getItem("carrinho"));
    let html = '';
    let valorTotal = 0;

    if (!objSession || !objSession.itens) {
        document.getElementById("carrinhoVazio").innerHTML = `<p style="text-align:center; font-size: 13px;"><br>Não há nenhum produto no carrinho</p><br>`;
        document.getElementById("totalTexto").style.display = 'none';
        document.getElementById("totalValor").style.display = 'none';
        return;
    } else {
        html = "<h1>Carrinho</h1>";
        for (let i = 0; i < objSession.itens.length; i++) {
            if (objSession.itens[i].quantidade > 0) {
                html += "<div class='itemCarrinho'>";
                html += "<div class='eliminarItem'>";
                html += `<span onclick="eliminarItem(${i})"><i class='fa-fw fa-solid fa-minus'></i></span>`;
                html += "</div>";
                html += "<span class='imgItem' style='width: 70px; height: 90px'>";
                html += `<img src='${objSession.itens[i].imagem}' style='width: 100%; height: 100%; object-fit: contain;'>`;
                html += "</span>";
                html += "<div class='nomeItem'>";
                html += `<p class='tituloItem'>${objSession.itens[i].nome}</p>`;
                html += `<p class='subtituloItem'>${objSession.itens[i].categoria}, ${objSession.itens[i].marca}</p>`;
                html += "</div>";
                html += "<div class='qtdItem'>";
                html += `<span class='aumentar' onclick=(aumentarItem(${i}))><i class='fa-fw fa-solid fa-plus'></i></span>`;
                html += `<span class='qtd'>${objSession.itens[i].quantidade}</span>`;
                html += `<span class='diminuir' onclick=(diminuirItem(${i}))><i class='fa-fw fa-solid fa-minus'></i></span>`;
                html += "</div>";
                html += "<div class='precoItem'>";
                html += `<span>R$ ${objSession.itens[i].preco.toFixed(2).replace(',', '.')}</span>`;
                html += "</div>";
                html += "</div>";

                valorTotal += objSession.itens[i].preco * objSession.itens[i].quantidade;
            }
        }

        // atualiza o html com os produtos do carrinho e o subtotal
        document.getElementById("carrinho").innerHTML = html;
        document.getElementById("totalValor").innerHTML = "R$ " + valorTotal.toFixed(2).replace('.', ',');
    }

})



// eliminar item do carrinho
function eliminarItem(pos) {
    const objSession = JSON.parse(sessionStorage.getItem("carrinho"));
    if (confirm("O produto será excluído do carrinho. Confirma sua escolha?")) {
        objSession.itens.splice(pos, 1);
        sessionStorage.setItem("carrinho", JSON.stringify(objSession));
        location.reload();
    } else {
        alert("O produto não foi retirado do carrinho.");
    }
}



// aumentar item no carrinho
function aumentarItem(pos) {
    const objSession = JSON.parse(sessionStorage.getItem("carrinho"));
    objSession.itens[pos].quantidade += 1;

    sessionStorage.setItem("carrinho", JSON.stringify(objSession));
    location.reload();
}



// diminuir item no carrinho
function diminuirItem(pos) {
    const objSession = JSON.parse(sessionStorage.getItem("carrinho"));
    // se já tiver apenas um item, elimita o vetor, senao o vetor ainda existe
    // e fica contando como 0
    if (objSession.itens[pos].quantidade === 1) {
        objSession.itens.splice(pos, 1);
    } else {
        objSession.itens[pos].quantidade -= 1;
    }

    sessionStorage.setItem("carrinho", JSON.stringify(objSession));
    location.reload();
}



function adcCarrinho(produto) {
    if (!sessionStorage.getItem("usuarioLogado")) {
        alert("Não é possível adicionar itens no carrinho sem um usuário. Faça login.");
        return;
    }

    // pega as infos do item catalogadas em data-*
    const categoria = document.getElementById(produto).dataset.categoria;
    const marca = document.getElementById(produto).dataset.marca;
    const nome = document.getElementById(produto).dataset.nome;
    const preco = parseFloat(document.getElementById(produto).dataset.preco);
    const imagem = document.getElementById(produto).dataset.imagem;

    // recupera o carrinho do sessionStorage ou cria um, se não haver
    obj = JSON.parse(sessionStorage.getItem("carrinho")) || { itens: [] };

    let produtoExiste = false;
    let totalItens = 0;

    // compara o nome do produto com os nomes dos produtos que existem no carrinho e aumenta sua qtd
    for (let i = 0; i < obj.itens.length; i++) {
        if (obj.itens[i].nome === nome) {
            obj.itens[i].quantidade += 1;
            produtoExiste = true;
            break;
        }
    }

    // se não existe, cria um vetor para o produto adicionado
    if (!produtoExiste) {
        obj.itens.push({
            categoria: categoria,
            marca: marca,
            nome: nome,
            preco: preco,
            imagem: imagem,
            quantidade: 1
        });
    }

    // pega o valor total da quantidade de todos os itens p/ mudar o trem da header (bolinha vermelha)
    for (let i = 0; i < obj.itens.length; i++) {
        totalItens += obj.itens[i].quantidade;
    }
    document.getElementById("carrinhoQtd").innerHTML = totalItens;

    // converte o objeto em string p/ mandar de volta ao sessionStorage
    sessionStorage.setItem("carrinho", JSON.stringify(obj));

}



// mostrar filtros
function mostrarFiltros() {
    var filtros = document.getElementById("filtrosGrupoMobile");

    if (filtros.style.display === 'none' || filtros.style.display === '') {
        filtros.style.display = 'flex';
    } else {
        filtros.style.display = 'none';
    }
}