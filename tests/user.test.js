import supertest from 'supertest';
import chai from 'chai';
import mocha from 'mocha';
import mongoose from 'mongoose';
import { app } from '../src/app.js';  

const expect = chai.expect;
const request = supertest(app);

describe('Users Router', function() {
  describe('POST /user/registro', function() {
    it('debe registrar un nuevo usuario', function(done) {
      const newUser = {
        email: "test@example.com",
        password: "password123",
        name: "John",
        lastName: "Doe",
        age: 30
      };

      request
        .post('/user/registro')
        .send(newUser)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message', 'Usuario registrado');
          expect(res.body.user).to.include({
            email: newUser.email,
            name: newUser.name,
            lastName: newUser.lastName,
            age: newUser.age
          });
          done();
        });
    });
  });

  describe('POST /user/login', function() {
    it('debe autenticar a un usuario y retornar un token', function(done) {
      const userCredentials = {
        email: "test@example.com",
        password: "password123"
      };

      request
        .post('/user/login')
        .send(userCredentials)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('access_token');
          done();
        });
    });
  });

  describe('PUT /user/:id', function() {
    it('debe actualizar un usuario existente', function(done) {
      const userId = "65ce73b46aace7c6bd38acfe";  // Un ID de usuario válido
      const updates = {
        email: "updated@example.com",
        password: "newpassword123",
        name: "John Updated",
        lastName: "Doe Updated"
      };

      request
        .put(`/user/${userId}`)
        .send(updates)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message', 'Usuario actualizado');
          done();
        });
    });
  });

  describe('DELETE /user/:id', function() {
    it('debe eliminar un usuario existente', function(done) {
      const userId = "65ce73b46aace7c6bd38acfe";  // Un ID de usuario válido

      request
        .delete(`/user/${userId}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message', 'Usuario eliminado');
          done();
        });
    });
  });
});
