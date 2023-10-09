import request from 'supertest';
import app from '../../app';
import { SIGNUP_ROUTE } from '../signup';
import { expect, beforeAll } from '@jest/globals';

describe('Sign up method route availability', () => {
    let password = '';
    let email = '';
    let name = '';
    let houseId = '';

    beforeAll(() => {
        email = 'validd@email.com';
        password = 'validPassword1';
        name = 'validName';
        houseId = 'validHouseId';
    });

    it('Should return 422 for unsupported HTTP methods', async () => {
        await request(app).put(SIGNUP_ROUTE).expect(405);
        await request(app).patch(SIGNUP_ROUTE).expect(405);
        await request(app).get(SIGNUP_ROUTE).expect(405);
        await request(app).delete(SIGNUP_ROUTE).expect(405);
    });

    it('Should return 200 for POST and OPTIONS requests', async () => {
        //await request(app).post(SIGNUP_ROUTE).send({ email, password, name, houseId }).expect(200);
        await request(app).options(SIGNUP_ROUTE).send({}).expect(200);
    });

    it('Should return POST as only allowed method for OPTIONS request', async () => {
        const response = await request(app).options(SIGNUP_ROUTE).send({}).expect(200);
        expect(response.get('Access-Control-Allow-Methods')).toContain('POST');
        expect(response.get('Access-Control-Allow-Methods')).toContain('OPTIONS');
    });
});

describe('Email validation', () => {
    let password = '';
    let name = '';
    let houseId = '';

    beforeAll(() => {
        password = 'validPassword1';
        name = 'validName';
        houseId = '012345678901234567890123';
    });

    it('Should return 200 for valid email', async () => {
        const response = await request(app).post(SIGNUP_ROUTE).send({ email: 'valid@email.com', password: 'validPassword1', name: 'DanielOliva', houseId: '012345678901234567890123' }).expect(200);
        console.log(response.body);
    });

    it('Should return 400 for invalid email', async () => {
        await request(app).post(SIGNUP_ROUTE).send({ email: 'invalidEmail', password, name, houseId }).expect(400);
    });

    it('Should return 400 for empty email', async () => {
        await request(app).post(SIGNUP_ROUTE).send({ email: '', password, name, houseId }).expect(400);
    });

    it('Should return 400 for missing email', async () => {
        await request(app).post(SIGNUP_ROUTE).send({ password, name, houseId }).expect(400);
    });

    it('Should return 400 for email without @', async () => {
        await request(app).post(SIGNUP_ROUTE).send({ email: 'invalidEmail.comn', password, name, houseId }).expect(400);
    });

    it('Should return 400 for email without .', async () => {
        await request(app).post(SIGNUP_ROUTE).send({ email: 'invalidEmail@com', password, name, houseId }).expect(400);
    });

    it('Should return 400 for email without domain', async () => {
        await request(app).post(SIGNUP_ROUTE).send({ email: 'invalidEmail@', password, name, houseId }).expect(400);
    });

    it('Should return 400 for email without username', async () => {
        await request(app).post(SIGNUP_ROUTE).send({ email: '@com', password, name, houseId }).expect(400);
    });
});

describe('Password validation', () => {
    let email = '';
    let name = '';
    let houseId = '';

    beforeAll(() => {
        email = 'valid1@email.com';
        name = 'validName';
        houseId = '012345678901234567890123';
    });

    it('Should return 400 for empty password', async () => {
        await request(app).post(SIGNUP_ROUTE).send({ email, password: '', name, houseId }).expect(400);
    });

    it('Should return 400 for missing password', async () => {
        await request(app).post(SIGNUP_ROUTE).send({ email, name, houseId }).expect(400);
    });

    it('Should return 400 for password with only lowercase letters', async () => {
        await request(app).post(SIGNUP_ROUTE).send({ email, password: 'invalidpassword', name, houseId }).expect(400);
    });

    it('Should return 400 for password with only uppercase letters', async () => {
        await request(app).post(SIGNUP_ROUTE).send({ email, password: 'INVALIDPASSWORD', name, houseId }).expect(400);
    });

    it('Should return 400 for password with only numbers', async () => {
        await request(app).post(SIGNUP_ROUTE).send({ email, password: '1234567890', name, houseId }).expect(400);
    });

    it('Should return 400 for password with only special characters', async () => {
        await request(app).post(SIGNUP_ROUTE).send({ email, password: '!@#$%^&*()', name, houseId }).expect(400);
    });

    it('Should return 400 for password with only lowercase letters and uppercase letters', async () => {
        await request(app).post(SIGNUP_ROUTE).send({ email, password: 'invalidPassword', name, houseId }).expect(400);
    });

    it('Should return 200 for password with lowercase letters, uppercase letters, and numbers', async () => {
        await request(app).post(SIGNUP_ROUTE).send({ email, password: 'validPassword1', name, houseId }).expect(200);
    });
});

describe('Name validation', () => {
    let password = '';
    let email = '';
    let houseId = '';

    beforeAll(() => {
        email = 'valid2@email.com';
        password = 'validPassword1';
        houseId = '012345678901234567890123';
    });

    it('Should return 400 for empty name', async () => {
        await request(app).post(SIGNUP_ROUTE).send({ email, password, name: '', houseId }).expect(400);
    });

    it('Should return 400 for missing name', async () => {
        await request(app).post(SIGNUP_ROUTE).send({ email, password, houseId }).expect(400);
    });

    it('Should return 200 for valid name', async () => {
        await request(app).post(SIGNUP_ROUTE).send({ email, password, name: 'DanielOliva', houseId }).expect(200);
    });
});
