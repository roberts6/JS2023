// bibliotecas necesarias
import supertest from 'supertest';
import chai from 'chai';
import mocha from 'mocha';
import mongoose from 'mongoose';
import { app } from '../src/app.js';  

const expect = chai.expect;
const request = supertest(app); 

describe('Product Router', function() {
  beforeEach(function() {
    mongoose.connection.collections.products.drop();
this.timeout(5000);
  });

  describe('GET /products', function() {
    it('debe devolver todos los productos', function(done) {
      request
        .get('/products')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  describe('POST /products', function() {
    it('debe crear un nuevo producto', function(done) {
      const newProduct = {
        title: "Nuevo Producto",
        description: "Descripción del producto",
        price: 19.99,
        thumbnail: "url_a_la_imagen",
        code: "ABCD1234",
        stock: 100
      };

      request
        .post('/products')
        .send(newProduct)
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Producto creado');
          done();
        });
    });
  });

  describe('DELETE /products/:id', function() {
    it('debe eliminar un producto', function(done) {
      const productId = '65a8773b0c04dc30c1c7746d';  // ID real de mi base de datos

      request
        .delete(`/products/${productId}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Producto eliminado');
          done();
        });
    });
  });
});