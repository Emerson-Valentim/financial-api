# Financial API

O projeto consiste em uma API escrita em Typescript utilizando o framework AdonisJS. O objetivo da aplicação é gerenciar de forma simples CRUDs comuns e ilustrar escalabilidade utilizando abstrações.

## Tecnologias

<a href='https://www.typescriptlang.org/'>Typescript</a>
<a href='https://adonisjs.com/'>AdonisJS</a>
<a href='https://github.com/thetutlage/japa'>Japa</a>
<a href='https://www.docker.com/'>Docker</a>

A utilização de docker se dá pela facilidade para compartilhar o projeto entre a equipe e disponibilizar versões executáveis com maior facilidade. O Typescript + AdonisJS foram escolhidos por facilitarem o desenvolvimento de aplicações baseadas em CRUD + Banco de dados. Existem algumas funcionalidades poderosas do AdonisJS que não foram utilizadas, mas facilitam muito na escalabilidade do sistema.

## Requests

##### Category CRUD

`POST /category/create`

```json
{
    "name": string
}
```

`PUT /category/updateById/:id`

```json
{
    "name": string
}
```

`GET /category/load?name={name}`
```json
{
    "name": string
}
```

`DELETE /category/deleteById/:id`
##### SubCategory CRUD

`POST /subcategory/create`

```json
{
    "category_id": number,
    "name": string
}
```

`PUT /subcategory/updateById/:id`

```json
{
    "category_id": number,
    "name": string
}
```

`GET /subcategory/load?id={id}&name={name}`
```json
{
    "id": number,
    "name": string
}
```

`DELETE /subcategory/deleteById/:id`

##### FinancialRelease CRUD

`POST /financialrelease/create`

```json
{
    "value": number,
    "release_date": date | optional,
    "observation": string | optional,
    "sub_category_id": number
}
```

`PUT /financialrelease/updateById/:id`

```json
{
    "value": number | optional,
    "release_date": date | optional,
    "observation": string | optional,
    "sub_category_id": number | optional
}
```

`GET /financialrelease/load?sub_category_id={sub_category_id}&initial_date={initial_date}&final_date={final_date}`
```json
{
    "sub_category_id": number,
    "initial_date": date | optional,
    "final_date": date | optional
}
```

`DELETE /financialrelease/deleteById/:id`

##### Balance CRUD
`GET /balance/countTotal?category_id={category_id}&initial_date={initial_date}&final_date={final_date}`
```json
{
    "category_id": number | optional,
    "initial_date": date,
    "final_date": date
}
```
## Sobre o projeto

O framework do AdonisJS propõe uma organização eficiente e de simples entendimento. Sobre os pontos solicitados no teste, irei pontuar um a um. Os diretórios principais estão localizados na pasta app, as outras pastas, em sua maioria, são referentes a configurações. 

##### Introdução
- As rotas estão sendo declaradas no arquivo routes.ts dentro da pasta start.
- Os testes se encontram na pasta test.
- Dentro da pasta database/migrations temos os arquivos de migrations.
- Na pasta config temos configurações padrões do projeto, nesse caso alteramos o arquivo database.ts e app.ts

##### REST
A estrutra proposta para as rotas garante um entendimento rápido de como as rotas estão configuradas, e fácil implementação caso se faça necessáro expandir a quantidade de rotas. É possível entender a composição da estrutura pelos tipos declarados, além da função responsável por gerar as rotas.

##### Autorização

Na pasta *Middleware*, a classe Authorizer é responsável por executar a validação do header de segurança (*x-api-key*). Antes de processar a requisição, a chave é resgatada dos headers e comparada a variável de ambiente (*HEADER_API_KEY*). Foi implementada de forma a permitir implementações mais complexas para validação de chaves dinâmicas e customizadas.

##### Manutenibilidade

Com a abstração proposta nos controllers, fica muito fácil implementar um novo grupo de rotas com comportamentos padrão. Se a implementação genérica do método não atender a necessidade, é possível sobrescrever os métodos e manter a integridade da Controller. 
Ao passar o modelo e o validador como dependência no construtor da classe *CrudController* que está sendo extendida, garantimos que todas as Controllers estão falando apenas de um model e utilizando o seu validador específico.
A utilização de *Services* para aplicar regras de negócio mais complexas tem várias vantagens, remover lógicas complexas da controller, reutilização dos serviços em outras partes do projeto, visualização clara das dependências de cada implementação.
A utilização de *Hooks* facilita a manipulação das entidades retornadas do banco em apenas um lugar, garantido que todo o sistema está falando da mesma entidade após a consulta.

##### Testes unitários

O coverage atual do projeto está acima de 90% e está testando alguns pontos básicos das controllers, garantindo os comportamentos solicitados na descrição das entidades. É possível verificar a execução dos testes com o comando, porém é necessário criar um database seguindo a composição proposta no arquivo database da pasta config. O database deve se chamar **DB_NAME**_testing, lembrando que DB_NAME é uma [variável de ambiente](#executando).
~~~sh
$ yarn coverage
~~~

##### Modernização

A aplicação está dockerizada para facilitar disponibilização e as configurações estão em variáveis de ambiente, para possiblitar customizações. Além de estar integrado com uma action de deploy na ECR e uma de testes, para que todas as implementações mergeadas na development não afetaram comportamentos anteriormente testados.

##### Logs

Para que seja possível entender o comportamento da aplição, a solução implementada foi uma classe que se comporta como Middleware (*HttpLogger*) e possui um método público que está sendo consumido no classe *HttpException*, garantindo que todas as requisições realizadas sejam logadas. Com a integração do terraform, os logs estão sendo disponibilizados por grupo de log e de forma a possibilitar filtros utilizando o serviço de insights. Os logs estão formatados como JSON e são armazenados na Cloudwatch, é possível habilitar/desabilitar utilizando a [variável de ambiente](#executando) **LOGGING**.

##### Observabilidade

A aplicação possui uma rota de healthcheck. Os logs são uma ferramenta poderosa para monitoramento da aplicação e podem ser enviados para alguma ferramenta de visualização, como o grafana.

## Executando

Para rodar o projeto local é necessário ter o Docker e Docker-compose instalados. O primeiro passo é configurar as variáveis de ambiente.

~~~yml
APP_KEY=iq90dswa90fi091i20fdisa9ujf9p1jfdp

PORT=3333
HOST=0.0.0.0
NODE_ENV=development

DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=financial
DB_PORT=5432
DB_CONNECTION=pg
DB_HOST=localhost

TZ=America/Sao_Paulo
LOGGING=true

HEADER_API_KEY=aXRhw7o=
~~~

A imagem do postgres depende de um volume, então será necessário criar o volume.

~~~sh
$ docker volume create --name=pgdata
~~~

Após criar o volume, apenas execute o comando abaixo. Perceba que as variáveis de ambiente estão sendo utilizadas no arquivo docker-compose, caso tenha alguma dúvida de como se autenticar, apenas verifique como as variáveis são utilizadas. O comando iniciará o container desacoplado do terminal.

~~~sh
$ docker-compose up -d
~~~

Caso precise parar o container. 

~~~sh
$ docker-compose stop
~~~

Também é preciso instalar os pacotes, execute o comando.

~~~sh
$ npm install 
    ou 
$ yarn
~~~

Execute os comandos para inicializar o projeto, é preciso executar as migrations. Caso ocorra algum problema com relação a não existência do database, verifique o banco de dados que foi gerado, e se necessário, execute o comando para criar o mesmo. É possível verificar o nome que está sendo utilizado no arquivo database que se encontra no diretório config.

~~~ sh
$ yarn migrate
$ yarn dev
~~~

## Extras

- O repositório é composto por duas actions, uma para atualização de task e outra para rodar os testes nos PRs.
- O Middleware ParamsParser foi uma solução encontrada para tratar todas as requests de forma única nos validators, porém precisa de uma melhoria na estrutura salva no body.
- Com a implementação das migrations, é necessário executar um container para rodar o comando em paralelo a execução do sistema.
- O framework facilita a implementação de Jobs (*Redis*), Hooks para manipular os dados antes/depois das conexões efetuadas no banco, entre outras funcionalidades importantes para aplicações CRUD.
- Uma dica é utilizar as ferramentas de deploy de infra disponiblizadas no repositório do terraform. Ele irá gerar uma versão na nuvem com a versão do projeto mais atualizada.