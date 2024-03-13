import { messagesModel } from "../models/messages.model.js";
import CustomRouter from "../routes/customRouter.js";
import twilio from 'twilio';
import dotenv from 'dotenv'

dotenv.config()

// inicialización del cliente de twilio
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

class MessagesRouter extends CustomRouter {
  constructor() {
    super();
    this.initRoutes();
  }

  initRoutes() {
// devuelve todos los mensajes
this.get("/", async (req, res) => {
  try {
    const messages = await messagesModel.find();
    res.render('messagesList', { messages: messages.length > 0 ? messages : null });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la lista de mensajes" });
  }
});

// mensaje buscado por id
this.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const message = await messagesModel.findById(id);
    if (!message) {
      return res.status(404).json({ error: "mensaje no encontrado" });
    }
    res.render('messageDetail', { message });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el mensaje" });
  }
});


// genera un nuevo mensaje
this.post("/", async (req, res) => {
  try {
    const { message, email } = req.body;
    const newMessage = new messagesModel({
      message,
      email
    });
    await newMessage.save();
    const response = {
      message: "mensaje creado",
      data: newMessage,
    };
    console.log(response.data)
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el mensaje" });
  }
});

// actualiza un mensaje por id
this.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { message, email } = req.body;

  try {
    const updatedMessage = await messagesModel.findByIdAndUpdate(
      id,
      {
        message,
        email
      },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ error: "mensaje no encontrado" });
    }

    const response = {
      message: "mensaje actualizado",
      data: updatedMessage,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el mensaje" });
  }
});

// borra un mensaje por su id
this.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMessage = await messagesModel.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({ error: "mensaje no encontrado" });
    }

    const response = {
      message: "mensaje eliminado",
      data: deletedMessage,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el mensaje" });
  }
});

// crea un SMS con Twilio
this.post('/sms', async (req, res) => {
  const { to, body } = req.body; 
  if (!to || !body) {
    return res.status(400).json({ error: "Faltan datos para enviar el SMS" });
  }
  try {
    let result = await twilioClient.messages.create({
      body: 'SMS desde Twilio',
      from: process.env.TWILIO_SMS_NUMBER,
      to: to
    });
    res.send({ status: "success", result: "Mensaje enviado" });
  } catch (error) {
    console.error("Error enviando SMS: ", error);
    res.status(500).json({ error: "Error al enviar SMS con Twilio" });
  }
});
  }}


// export default router;
export default new MessagesRouter().getRouter();
