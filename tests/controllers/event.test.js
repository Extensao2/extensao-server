import { 
  createEvent, createEventValidators,
  getAllEvents,
  getEventById, getEventByIdValidators,
  updateEvent, updateEventValidators,
  deleteEvent, deleteEventValidators
} from '../../src/controllers/events/index.js';

import Evento from '../../src/models/Evento.js';
jest.mock('../../src/models/Evento.js');

const mockRequest = (body = {}, params = {}, user = {}) => ({
  body,
  params,
  user
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('Evento Controller Unit Tests', () => {

  beforeEach(() => jest.clearAllMocks());

  // ------------------- createEvent -------------------
  describe('createEvent', () => {
    it('should create an event successfully', async () => {
      const req = mockRequest(
        { nome: 'Evento 1', data: '2025-09-15', descricao: 'Descrição' },
        {},
        { _id: 'user1' }
      );
      const res = mockResponse();

      Evento.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(),
        toJSON: () => ({ id: 'evt1', nome: 'Evento 1', descricao: 'Descrição' }),
        id: 'evt1'
      }));

      await createEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 'evt1', nome: 'Evento 1', descricao: 'Descrição' });
    });

    it('should handle save error', async () => {
      const req = mockRequest(
        { nome: 'Evento 1', data: '2025-09-15', descricao: 'Descrição' },
        {},
        { _id: 'user1' }
      );
      const res = mockResponse();

      Evento.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error('DB error'))
      }));

      await createEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  // ------------------- getAllEvents -------------------
  describe('getAllEvents', () => {
    it('should return all events', async () => {
      const req = mockRequest();
      const res = mockResponse();

      const mockEvents = [{ toJSON: () => ({ id: 'evt1', nome: 'Evento 1' }) }];
      Evento.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockEvents)
      });

      await getAllEvents(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 'evt1', nome: 'Evento 1' }]);
    });

    it('should handle errors', async () => {
      const req = mockRequest();
      const res = mockResponse();

      Evento.find.mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error('DB error'))
      });

      await getAllEvents(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  // ------------------- getEventById -------------------
  describe('getEventById', () => {
    it('should return an event by ID', async () => {
      const req = mockRequest({}, { id: 'evt1' });
      const res = mockResponse();

      Evento.findOne.mockResolvedValue({ 
        toJSON: () => ({ id: 'evt1', nome: 'Evento 1' })
      });

      await getEventById(req, res);

      expect(Evento.findOne).toHaveBeenCalledWith({ id: 'evt1' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 'evt1', nome: 'Evento 1' });
    });

    it('should return 404 if not found', async () => {
      const req = mockRequest({}, { id: 'evt1' });
      const res = mockResponse();

      Evento.findOne.mockResolvedValue(null);

      await getEventById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Evento not found' });
    });

    it('should handle errors', async () => {
      const req = mockRequest({}, { id: 'evt1' });
      const res = mockResponse();

      Evento.findOne.mockRejectedValue(new Error('DB error'));

      await getEventById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  // ------------------- updateEvent -------------------
  describe('updateEvent', () => {
    it('should update an event successfully', async () => {
      const req = mockRequest(
        { nome: 'Evento atualizado', data: '2025-09-16', descricao: 'Nova descrição' },
        { id: 'evt1' }
      );
      const res = mockResponse();

      Evento.findOneAndUpdate.mockResolvedValue({
        toJSON: () => ({ id: 'evt1', nome: 'Evento atualizado', descricao: 'Nova descrição' })
      });

      await updateEvent(req, res);

      expect(Evento.findOneAndUpdate).toHaveBeenCalledWith(
        { id: 'evt1' },
        { nome: 'Evento atualizado', data: '2025-09-16', descricao: 'Nova descrição' },
        { new: true, runValidators: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 'evt1', nome: 'Evento atualizado', descricao: 'Nova descrição' });
    });

    it('should return 404 if not found', async () => {
      const req = mockRequest({ nome: 'Evento atualizado' }, { id: 'evt1' });
      const res = mockResponse();

      Evento.findOneAndUpdate.mockResolvedValue(null);

      await updateEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Evento not found' });
    });

    it('should handle errors', async () => {
      const req = mockRequest({ nome: 'Evento atualizado' }, { id: 'evt1' });
      const res = mockResponse();

      Evento.findOneAndUpdate.mockRejectedValue(new Error('DB error'));

      await updateEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  // ------------------- deleteEvent -------------------
  describe('deleteEvent', () => {
    it('should delete an event successfully', async () => {
      const req = mockRequest({}, { id: 'evt1' });
      const res = mockResponse();

      Evento.findOneAndDelete.mockResolvedValue({ id: 'evt1' });

      await deleteEvent(req, res);

      expect(Evento.findOneAndDelete).toHaveBeenCalledWith({ id: 'evt1' });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return 404 if not found', async () => {
      const req = mockRequest({}, { id: 'evt1' });
      const res = mockResponse();

      Evento.findOneAndDelete.mockResolvedValue(null);

      await deleteEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Evento not found' });
    });

    it('should handle errors', async () => {
      const req = mockRequest({}, { id: 'evt1' });
      const res = mockResponse();

      Evento.findOneAndDelete.mockRejectedValue(new Error('DB error'));

      await deleteEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});