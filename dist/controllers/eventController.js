"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventController = void 0;
const Event_1 = require("@/models/Event");
const errorHandler_1 = require("@/middleware/errorHandler");
class EventController {
    static async getAllEvents(req, res, next) {
        try {
            const events = await Event_1.EventModel
                .find()
                .sort({ data: -1 })
                .lean();
            const formattedEvents = events.map(event => ({
                id: event._id,
                nome: event.nome,
                data: event.data.toISOString(),
                descricao: event.descricao
            }));
            res.status(200).json(formattedEvents);
        }
        catch (error) {
            next(error);
        }
    }
    static async getEventsByUserId(req, res, next) {
        try {
            const { user_id } = req.params;
            const events = await Event_1.EventModel
                .find({ userId: user_id })
                .sort({ data: -1 })
                .lean();
            if (events.length === 0) {
                next(new errorHandler_1.AppError('Nenhum evento encontrado para este usuário', 404));
                return;
            }
            const formattedEvents = events.map(event => ({
                id: event._id,
                nome: event.nome,
                data: event.data.toISOString(),
                descricao: event.descricao
            }));
            res.status(200).json(formattedEvents);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.EventController = EventController;
//# sourceMappingURL=eventController.js.map