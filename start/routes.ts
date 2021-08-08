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

import HealthCheck from '@ioc:Adonis/Core/HealthCheck'
import Route from '@ioc:Adonis/Core/Route'

type MethodDefinition = {
  httpMethod: string,
  controllerMethod: string,
  customMiddlewares: string[]
}

type ControllerDefinition = {
  [path: string]: MethodDefinition
}

type RouteDefinition = {
  [prefix: string]: ControllerDefinition
}

const routes: RouteDefinition = {
  Category: {
    create: {
      httpMethod: 'post',
      controllerMethod: 'create',
      customMiddlewares: [],
    },
    'load/:id?': {
      httpMethod: 'get',
      controllerMethod: 'load',
      customMiddlewares: [],
    },
    'updateById/:id': {
      httpMethod: 'put',
      controllerMethod: 'updateById',
      customMiddlewares: [],
    },
    'deleteById/:id': {
      httpMethod: 'delete',
      controllerMethod: 'deleteById',
      customMiddlewares: [],
    },
  },
  SubCategory: {
    create: {
      httpMethod: 'post',
      controllerMethod: 'create',
      customMiddlewares: [],
    },
    'load/:id?': {
      httpMethod: 'get',
      controllerMethod: 'load',
      customMiddlewares: [],
    },
    'updateById/:id': {
      httpMethod: 'put',
      controllerMethod: 'updateById',
      customMiddlewares: [],
    },
    'deleteById/:id': {
      httpMethod: 'delete',
      controllerMethod: 'deleteById',
      customMiddlewares: [],
    },
  },
  FinancialRelease: {
    create: {
      httpMethod: 'post',
      controllerMethod: 'create',
      customMiddlewares: [],
    },
    'load/:id?': {
      httpMethod: 'get',
      controllerMethod: 'load',
      customMiddlewares: [],
    },
    'updateById/:id': {
      httpMethod: 'put',
      controllerMethod: 'updateById',
      customMiddlewares: [],
    },
    'deleteById/:id': {
      httpMethod: 'delete',
      controllerMethod: 'deleteById',
      customMiddlewares: [],
    },
  },
  Balance: {
    countTotal: {
      httpMethod: 'get',
      controllerMethod: 'countTotal',
      customMiddlewares: [],
    },
  },
}

Object.entries(routes).forEach(([routePrefix, controllerDefinition]) => {
  Object.entries(controllerDefinition).forEach(([routePath, methodDefinition]) => {
    Route[methodDefinition.httpMethod](routePath, `${routePrefix}Controller.${methodDefinition.controllerMethod}`)
      .prefix(routePrefix.toLowerCase())
      .middleware([...methodDefinition.customMiddlewares])
  })
})

Route.get('/healthCheck', async ({ response }) =>
  HealthCheck.isLive()
    ? response.status(200).send({ message: 'HealthCheck: Ok' })
    : response.status(400).send({ message: 'HealthCheck: Fail' })
)
