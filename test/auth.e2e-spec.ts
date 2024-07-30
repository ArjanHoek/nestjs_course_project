import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';
import { User } from 'src/users/user.entity';

const clearEntityTable = (app: INestApplication) =>
  app.get(DataSource).getRepository(User).delete({});

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await clearEntityTable(app);
  });

  afterEach(async () => {
    await app.close();
  });

  it('handles a signup request', () => {
    const testEmail = 'e2e@test.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: testEmail, password: 'passe2e' })
      .expect(201)
      .then(({ body: { id, email } }) => {
        expect(id).toBeDefined();
        expect(email).toEqual(testEmail);
      });
  });

  it('signup as a new user and then get the currently logged in user', async () => {
    const userMock = { email: 'e2e@test.com', password: 'test123' };

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userMock)
      .expect(201);

    const cookie = res.get('Set-Cookie');

    return request(app.getHttpServer())
      .get('/auth/profile')
      .set('Cookie', cookie)
      .expect(200)
      .then(({ body: { id, email } }) => {
        expect(email).toEqual(userMock.email);
        expect(id).toBeDefined();
      });
  });
});
