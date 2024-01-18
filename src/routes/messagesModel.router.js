import { Router } from "express";
import { messagesModel } from "../models/messages.model.js";

const router = Router();

// devuelve todos los mensajes
router.get("/messages", async (req, res) => {
  try {
    const messages = await messagesModel.find();
    const response = {
      message: "Lista de mensajes",
      data: messages.length > 0 ? messages : "No hay mensajes",
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la lista de mensajes" });
  }
});

// mensaje buscado por id
router.get("/messages/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const message = await messagesModel.findById(id);

    if (!message) {
      return res.status(404).json({ error: "mensaje no encontrado" });
    }

    const response = {
      message: "Mensaje encontrado",
      data: message,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el mensaje" });
  }
});

// genera un nuevo mensaje
router.post("/messages", async (req, res) => {
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
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el mensaje" });
  }
});

// actualiza un mensaje por id
router.put("/messages/:id", async (req, res) => {
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
router.delete("/messages/:id", async (req, res) => {
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

export default router;