const express = require("express");
const { validate } = require("uuid");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checksExistsRepo( request, response, next){
  const { id } = request.params;

  const repo = repositories.find((repo) => repo.id === id);

  if(repo === undefined || !validate(id)){
    return response.status(404).json({ error : 'Invalid id' })
  }
  request.repo = repo;

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository)

  return response.json(repository);
});

app.put("/repositories/:id", checksExistsRepo, (request, response) => {
  const updatedRepository = request.body;
  const { repo } = request

  const repositoryIndex = repositories.indexOf(repo);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repo.title = updatedRepository.title;
  repo.url = updatedRepository.url;
  repo.techs = updatedRepository.techs

  return response.json(repo);
});

app.delete("/repositories/:id", checksExistsRepo, (request, response) => {
  const { id } = request.params;
  const { repo } = request

  const repositoryIndex = repositories.indexOf(repo);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checksExistsRepo,  (request, response) => {
  const { repo } = request

  repo.likes++;

  return response.json({"likes" : repo.likes});
});

module.exports = app;
