/**
 * Project: Go Stack NodeJs Challenge Concept
 * Author: Marcos Santos
 * Date: April, 7, 2020.
 * Description: This project aims to show the concepts
 * and techniques presented and learned in the API Rest
 * NodeJs training.
 * File: app.js
 * https://github.com/Rocketseat/bootcamp-gostack-desafios/tree/master/desafio-conceitos-nodejs
 */

const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");
//const { uuid, isUuid } = require('uuidv4'); 
const app = express();

//****************************************/
app.use(express.json());
app.use(cors());
//****************************************/
const repositories = [];

//****************************************/
// Middlewares

function logRequests(request, response, next){
  const { method, url } = request;
  const logLabel = `[${method.toUpperCase()}] ${url}`;
  
  console.time(logLabel);

  next(); // call next middleware

  console.timeEnd(logLabel);
}

//****************************************/
function validateProjectId(request, response, next){
  
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repository => 
    repository.id === id
  );

  if (repoIndex === -1) {
    return response.status(400).json({error: '[GoStack - NodeJs] Repository did not found!'});
  }
/*
  if(!isUuid(id)) {
    return response.status(400).json({error: '[GoStack - NodeJs] Invalid project ID'});
  }
  */
 
  return next();
}

//****************************************/
app.get("/repositories", logRequests, (request, response) => {
  // GET /repositories: Rota que lista todos os repositórios;
  return response.status(200).json(repositories);
});

//****************************************/
app.post("/repositories", logRequests, (request, response) => {
  /* POST /repositories: A rota deve receber title, url 
   * e techs dentro do corpo da requisição, sendo a URL 
   * o link para o github desse repositório.
  */
  const { title, url, techs } = request.body;
  // comes from application body
  const repos = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }
  repositories.push(repos);
  return response.status(200).json(repos);
});

//****************************************/
app.put("/repositories/:id", validateProjectId, logRequests, (request, response) => {
  /**
   * PUT /repositories/:id: A rota deve alterar apenas 
   * o title, a url e as techs do repositório que possua 
   * o id igual ao id presente nos parâmetros da rota;
   */

   const { title, url, techs } = request.body;
   const { id } = request.params;

   const repoIndex = repositories.findIndex(repository =>
      repository.id === id
    );

    const likes = repositories[repoIndex].likes;

    const tempRepository = {
    id,
    title,
    url,
    techs,
    likes,
   };

   repositories[repoIndex] = tempRepository;

   return response.status(200).json(tempRepository);

});

//****************************************/
app.delete("/repositories/:id", validateProjectId, logRequests, (request, response) => {
  /**
   * DELETE /repositories/:id: A rota deve deletar o 
   * repositório com o id presente nos parâmetros da 
   * rota;
   */
  const { id } = request.params;
  const repoIndex = repositories.findIndex(repository => 
    repository.id === id
  );

  if (repoIndex >= 0) {
    repositories.splice(repoIndex, 1);
  }

  return response.status(204).send();

});

//****************************************/
app.post("/repositories/:id/like", validateProjectId, logRequests, (request, response) => {
  /**
   * POST /repositories/:id/like: A rota deve aumentar 
   * o número de likes do repositório específico 
   * escolhido através do id presente nos parâmetros 
   * da rota, a cada chamada dessa rota, o número de 
   * likes deve ser aumentado em 1;
   */
  
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repository => 
    repository.id === id
  );
  
  repositories[repoIndex].likes += 1;

  return response.status(200).json(repositories[repoIndex]);

});

//****************************************/
module.exports = app;
