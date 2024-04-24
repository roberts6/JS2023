import supertest from 'supertest';
import chai from 'chai';
import mocha from 'mocha';
import mongoose from 'mongoose';
import { app } from '../src/app.js';  

const expect = chai.expect;
const request = supertest(app);

describe('Carts Router', function() {
  describe('PUT /carts/:cid', function() {
    it('debe actualizar el carrito completo', function(done) {
      const cartId = "123";  
      const updatedProducts = [{ productId: "001", quantity: 3 }];

      request
        .put(`/carts/${cartId}`)
        .send({ products: updatedProducts })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message', 'Carrito actualizado exitosamente');
          done();
        });
    });
  });

  describe('DELETE /carts/:cid/products/:pid', function() {
    it('debe eliminar un producto específico del carrito', function(done) {
      const cartId = "123"; 
      const productId = "001";

      request
        .delete(`/carts/${cartId}/products/${productId}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message', 'Producto eliminado del carrito exitosamente');
          done();
        });
    });
  });

  describe('PUT /carts/:cid/products/:pid', function() {
    it('debe actualizar la cantidad de un producto en el carrito', function(done) {
      const cartId = "123";
      const productId = "001";
      const newQuantity = 5;

      request
        .put(`/carts/${cartId}/products/${productId}`)
        .send({ quantity: newQuantity })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message', 'Cantidad del producto actualizada exitosamente');
          done();
        });
    });
  });

  describe('DELETE /carts/:cid', function() {
    it('debe eliminar todos los productos del carrito', function(done) {
      const cartId = "123";

      request
        .delete(`/carts/${cartId}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message', 'Todos los productos han sido eliminados del carrito exitosamente');
          done();
        });
    });
  });
});
