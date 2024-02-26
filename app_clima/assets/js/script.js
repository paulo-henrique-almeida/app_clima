// RELOGIO

const horas = document.getElementById('horas');
const minutos = document.getElementById('minutos');
const segundos = document.getElementById('segundos');
const dia = document.getElementById('dia');
const mes = document.getElementById('mes');
const ano = document.getElementById('ano');
const semana = document.getElementById('semana');

const semanas = [
    'domingo', // 0
    'segunda-feira', // 1
    'terça-feira', // 2
    'quarta-feira', // 3
    'quinta-feira', // 4
    'sexta-feira', // 5
    'sábado' // 6
];

const meses = [
    'janeiro', // 0
    'fevereiro', // 1
    'março', // 2
    'abril', // 3
    'maio', // 4
    'junho', // 5
    'julho', // 6
    'agosto', // 7
    'setembro', // 8
    'outubro', // 9
    'novembro', // 10
    'dezembro' // 11
];

let dados;

const relogio = setInterval(function time() {
    // obtém o tempo atual
    let dataAtual = new Date();
    let dataAjustada;

    if (dados) {
        // data atual em UTC
        let dataAtualUTC = new Date(Date.UTC(dataAtual.getFullYear(), dataAtual.getMonth(), dataAtual.getDate(), dataAtual.getHours(), dataAtual.getMinutes(), dataAtual.getSeconds()));

        // ajusta a hora com o fusuhorário
        dataAjustada = new Date(dataAtualUTC.getTime() - (dados.timezone * 1000));
    } else {
        dataAjustada = dataAtual;
    }

    let hr = dataAjustada.getHours();
    let min = dataAjustada.getMinutes();
    let s = dataAjustada.getSeconds();
    let d = dataAjustada.getDate();
    let m = meses[dataAjustada.getMonth()];
    let a = dataAjustada.getFullYear();
    let sem = semanas[dataAjustada.getDay()][0].toLocaleUpperCase() + semanas[dataAjustada.getDay()].substring(1);

    // define os elementos com os valores atuais
    horas.textContent = hr.toString().padStart(2, '0');
    minutos.textContent = min.toString().padStart(2, '0');
    segundos.textContent = s.toString().padStart(2, '0');
    dia.textContent = d;
    mes.textContent = m;
    ano.textContent = a;
    semana.textContent = sem;
});

// CLIMA

document.querySelector('#pesquisar').addEventListener('submit', async (event) => {
    // previne que o evento submit recarregue a página
    event.preventDefault();

    // exibe uma mensagem ao usuário de que a busca está sendo realizada
    mostrarAlerta('<i class="fa-solid fa-magnifying-glass"></i> Buscando...')

    // esconde o relógio
    document.querySelector('.container-tempo').classList.remove('mostrar');

    // esconde o clima
    document.querySelector('#clima').classList.remove('mostrar');

    const nomeCidade = document.querySelector('#nome-cidade').value;

    if (!nomeCidade) {
        // remove o clima visivel
        document.querySelector('#clima').classList.remove('mostrar');

        // exibe um alerta ao usuário pedindo que digite o nome de uma cidade
        mostrarAlerta('<i class="fa-solid fa-pencil"></i> Digite o nome de uma cidade');

        return;
    }

    // recebe a chave da API
    const apiKey = '87d4efa622988428bf99a7be7a430b52';

    // recebe a url da API
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(nomeCidade)}&appid=${apiKey}&units=metric&lang=pt_br`;

    // recebe os resultados obtidos na API
    const resultados = await fetch(apiUrl);
    const json = await resultados.json();

    if (json.cod === 200) { // json.cod === 200 verifica se a conexão com a API funcionou
        dados = {
            cidade: json.name,
            pais: json.sys.country,
            temp: json.main.temp,
            tempMax: json.main.temp_max,
            tempMin: json.main.temp_min,
            desc: json.weather[0].description,
            icone: json.weather[0].icon,
            vento: json.wind.speed,
            humildade: json.main.humidity,
            sensTerm: json.main.feels_like,
            timezone: json.timezone
        };

        mostrarInfo(dados)
    } else {
        // remove o clima visivel
        document.querySelector('#clima').classList.remove('mostrar');

        // limpa a caixa de pesquisa
        document.querySelector('form').reset;

        // exibe um alerta ao usuário dizendo que não foi possível localizar
        mostrarAlerta('<i class="fa-solid fa-xmark" id="icone-temp-max"></i> Não foi possível localizar')
    }
});

function mostrarInfo(json) {
    // limpa o alerta
    mostrarAlerta('');

    // mostra o relógio
    document.querySelector('.container-tempo').classList.add('mostrar');

    // mostra o clima
    document.querySelector('#clima').classList.add('mostrar');

    // cidade e país
    document.querySelector('#titulo').innerHTML = `${json.cidade}, ${json.pais}`;

    // valor da temperatura
    document.querySelector('#valor-temp').innerHTML = `${json.temp.toFixed(1).toString().replace('.', ',')} <sup>°C</sup>`;

    // descrição
    document.querySelector('#desc-temp').innerHTML = `${json.desc}`;

    // icone
    document.querySelector('#img-temp').setAttribute('src', `https://openweathermap.org/img/wn/${json.icone}@2x.png`);

    // temperatura máxima
    document.querySelector('#temp-max').innerHTML = `${json.tempMax.toFixed(1).toString().replace('.', ',')} <sup>°C</sup>`;

    // temperatura mínima
    document.querySelector('#temp-min').innerHTML = `${json.tempMin.toFixed(1).toString().replace('.', ',')} <sup>°C</sup>`;

    // humildade
    document.querySelector('#humildade').innerHTML = `${json.humildade}%`;

    // vento
    document.querySelector('#vento').innerHTML = `${json.vento.toFixed(1)}km/h`;

    // sensação térmica
    document.querySelector('#sens-term').innerHTML = `${json.sensTerm.toFixed(1).toString().replace('.', ',')} <sup>°C</sup>`;
}

function mostrarAlerta(msg) {
    document.querySelector('#alerta').innerHTML = msg;
}

