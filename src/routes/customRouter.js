import { Router as ExpressRouter } from "express";
import handlePolicies from '../middleware/handlePolicies.js';

export default class CustomRouter {
  constructor() {
    this.router = ExpressRouter();
    this.init();
  }

  getRouter() {
    return this.router;
  }

  async applyCallbacks(callbacks) {
    return callbacks.map((callback) => async (req, res) => {
      try {
        await callback(req, res);
      } catch (error) {
        console.error(error);
        res.status(500).send(error);
      }
    });
  }

  init() {}

  get(path, ...callbacks) {
    this.router.get(path, ...callbacks);
  }

  post(path, ...callbacks) {
    this.router.post(path, ...callbacks);
  }

  put(path, ...callbacks) {
    this.router.put(path, ...callbacks);
  }

  delete(path, ...callbacks) {
    this.router.delete(path, ...callbacks);
  }

  handlePolicies = handlePolicies;
}


