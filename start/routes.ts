/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

type RouteDefinition = {
  [prefix: string] : {
    controllerMiddlewares: string[],
    [path: string]: {
      httpMethod: string,
      controllerMethod: string,
      customMiddlewares: string[]
    } | string[],
  } | string[],
  routesMiddlewares: string[]
}

const routes: RouteDefinition = {
  category: {
    create: {
      httpMethod: 'post',
      controllerMethod: 'create',
      customMiddlewares: [],
    },
    loadById: {
      httpMethod: 'get',
      controllerMethod: 'loadById',
      customMiddlewares: [],
    },
    updateById: {
      httpMethod: 'put',
      controllerMethod: 'updateById',
      customMiddlewares: [],
    },
    deleteById: {
      httpMethod: 'delete',
      controllerMethod: 'deleteById',
      customMiddlewares: [],
    },
    controllerMiddlewares: [],
  },
  routesMiddlewares: [],
}

Route.get('/', async () => {
  return { hello: 'world' }
})
