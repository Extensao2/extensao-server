import Evento from '../../models/Evento.js';

export const getAllEvents = async (req, res) => {
  try {
    const events = await Evento.find().sort({ data: 1 });
    const response = events.map(evento => evento.toJSON());
    res.status(200).json(response);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};