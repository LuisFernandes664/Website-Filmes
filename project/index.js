/*window.addEventListener('load', (event) =>{
  if(pesquisaPalavra){
    getMovies(searchURL+'&query='+pesquisaPalavra); //api pede 
  }else{
    getMovies(api_url);
  }
})*/

function inicio() {
  addEventListener('load', getMovies(url));
}
const api_key = 'api_key=02dd4e4bf4792803c07f78fb41cab31b';
const linkBaseAPI = 'https://api.themoviedb.org/3';
const api_url = linkBaseAPI+"/discover/movie?sort_by=popularity.desc&"+api_key;
const img_url = 'https://image.tmdb.org/t/p/w500';
//console.log(api_url);

const main = document.getElementById('main');

getMovies(api_url);

const searchURL = linkBaseAPI+ '/search/movie?'+api_key;
const notResult = 'https://image.tmdb.org/t/p/w500null';

const form = document.getElementById('form');
const search = document.getElementById('search');
const prox = document.getElementById('prox');
const anterior = document.getElementById('anterior');
const numPage = document.getElementById('numPage');

var numPageAtual = 1;
var proxPag = 2;
var anteriorPag = 3;
var lastUrl = '';
var totalPage = 100;


function getMovies(url){
  lastUrl = url; //para conseguir pegar na url do momento
  fetch(url)
    .then(res => res.json()) //retorna o meu objeto em JSON
    .then(data => {
      console.log(data.results)
      //console.log(data.total_pages); //total de paginas da API
      //console.log(data); //objeto
      if(data.results.length !== 0){ //VERIFICA SE TEM RESULTADOS A PESQUISA
        MostraFilmes(data.results);
        numPageAtual = data.page;
        proxPag = numPageAtual + 1;
        anteriorPag = numPageAtual - 1;
        totalPage = data.total_pages;

      }else{ //SENAO APARECE ESTA MENSAGEM
        main.innerHTML=`<h1>SEM RESULTADOS</H1>`
        var paginacao = document.querySelectorAll('.paginacao');
        
        paginacao.innerHTML = ` `;

        if (paginacao.parentNode) {
          paginacao.parentNode.removeChild(paginacao);
        }
      }
        
    });
}
/*function getMovies(url){
  //1. Fazer pedido HTTP PARA OBTER INFO USER
  var pedido = new XMLHttpRequest();
  pedido.onreadystatechange = function(){
      if (this.readyState == 4 && this.status == 200) {
        MostraFilmes(this.responseText)
      }
  }
  pedido.open("GET", url, true);
  pedido.send();
}*/

function MostraFilmes(data){
  main.innerHTML = '';

  data.forEach(movie => {
    const {title, poster_path, vote_average, overview, release_date, id} = movie;

    var newOverview;

    if(overview.length>200){
      newOverview = overview.substring(0,200) + '...';
    }
    else{
      newOverview = overview; 
    }

    data = new Date(release_date);//
    newRelease = data.toLocaleDateString('pt-PT', {timeZone: 'UTC'});//Converter formato da data

    var newVote = vote_average*10;

    const filme1 = document.createElement('div');
    filme1.classList.add('movie');
    
    filme1.innerHTML = `
    <!--CARDS HTML-->
    <div class="card">
        <div class="espaco_img img" style="height: 100%;" data-toggle="modal" data-target="#${id}">
          <img class="imagem" id='imagem' data-toggle="modal" data-target="#exampleModalCenter-${id}" src="${img_url+poster_path}" alt="${title}">
        </div>
        <div class="espaco_img title" style="margin-top:0; height: 200px;">
          <h5 class="card-title">${title}</h5>
          <p class="card-text descricao" >${newOverview}</p>
        </div>
        <div class="card-footer">
          <small class="text-muted">Data: ${newRelease} 
          <span class="rating">
          &#11088;
          ${newVote}%</span></small>
        </div>
    </div>
    <!--Colocar o mesmo nome id="exampleModalCenter-${id}" no que recebe e no modal-->
    <div class="modal fade" id="exampleModalCenter-${id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalCenterTitle">${title}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <img id="imgDentroModal" src="${img_url+poster_path}" alt="${title}">
                <span><p class="descricaoDentroModal" >${overview}</p></span>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
        `
        main.appendChild(filme1);
  })
}

form.addEventListener('submit', (e) => {
  e.preventDefault(); //para nao abrir outra pagina
  
  const pesquisaPalavra = search.value;
  console.log(pesquisaPalavra)
  if(pesquisaPalavra){
    getMovies(searchURL+'&query='+pesquisaPalavra); //api pede 
  }else{
    getMovies(api_url);
  }
})

anterior.addEventListener('click', () =>{
  if(anteriorPag > 0){ //verificar se pode clicar na pagina anterior
    pageCall(anteriorPag);
  }
})

prox.addEventListener('click', () =>{
  if(proxPag <= totalPage){ //verificar se pode clicar na proxima pagina
    pageCall(proxPag);
  }
})

function pageCall(page) {
  let url1 = lastUrl.split('?');//para partir o link
  //console.log(url1);
  let query = url1[1].split('&');
  //console.log(query)
  let key = query[query.length -1].split('='); //ir no final da url e colocar "="

  if(key[0] != 'page'){
    let url = lastUrl + '&page='+page
    getMovies(url);
  }else{
    key[1] = page.toString();
    let a = key.join('=');
    query[query.length -1] = a;
    let b = query.join('&');
    let url = url1[0] +'?'+b;
    getMovies(url)
  }
}