import  ollama  from "ollama";
import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "*",
  },
});



io.on("connection", (socket) => {
  socket.on("mess", async (mess) => {

    const message = { role: "user", content: mess };

    const response = await ollama.chat({
      model: "gemma3",
      messages: [message],
      stream: true,
    });

    for await (const part of response) {
      socket.emit("aires",(part.message))
    }

    socket.emit("save","save")

  });
});

io.listen(3000);
