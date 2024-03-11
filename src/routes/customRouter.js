import { Router as ExpressRouter } from "express";

export default class CustomRouter {
  constructor(){
    this.router = ExpressRouter();
    this.init();
  }
  getRouter(){
    return this.router;
  }

  applyCallbacks(callbacks){
return callbacks.map((callback) => async (...params) => {
try {
    await callback.apply(this.params);
} catch (error) {
    console.error(error)
    // params[1] hace referencia a res
    params[1].status(500).send(error)
}
})
  }

  init(){}

  get(path, ...callbacks){
    this.router.get(path, ...this.applyCallbacks(callbacks));
  }

  post(path, ...callbacks){
    this.router.post(path, ...this.applyCallbacks(callbacks));
  }

  put(path, ...callbacks){
    this.router.put(path, ...this.applyCallbacks(callbacks));
  }

  delete(path, ...callbacks) {
    this.router.delete(path, ...this.applyCallbacks(callbacks));
  }
  }

