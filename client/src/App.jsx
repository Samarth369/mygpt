import { useRef, useState } from "react";
import "./App.css";
import { useEffect } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");

function App() {
  const [chat, setchat] = useState([]);
  const [text, settext] = useState("");

  const inpref = useRef();
  const textref = useRef();

  useEffect(() => {
    textref.current = text;
  }, [text]);

  useEffect(() => {
    socket.on("aires", (aires) => {
      settext((x) => x + " " + aires.content);
    });
  }, []);

  useEffect(() => {
    socket.on("save", (save) => {
      let savetext = textref.current
      setchat((x) => [...x, { role: "assistant", content: savetext }]);
      settext((x) => "");
    });
  }, []);

  function formsub(e) {
    e.preventDefault();
    let mess = e.target[0].value;
    e.target[0].value = null;
    socket.emit("mess", mess);
    setchat((x) => [...x, { role: "user", content: mess }]);
  }

  useEffect(() => {
    inpref.current.focus();
  }, []);

  function MainContent() {
    return (
      <>
        <div className="chat">
          <div className="ai-chat">
            {chat.map((x, idx) => {
              if (x.role == "assistant") {
                return (
                  <>
                    <div key={idx} className="aitext">
                      {x.content}
                    </div>
                  </>
                );
              } else if (x.role == "user") {
                return (
                  <>
                    <div key={idx} className="mytext">
                      {x.content}
                    </div>
                  </>
                );
              }
            })}
            <div className="aitext">{text}</div>
          </div>

          <form className="inform" onSubmit={formsub}>
            <input type="text" name="inp" id="inp" ref={inpref} />
            <button>Send</button>
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="main-block">
        <div className="side-bar-block"></div>

        <div className="main">
          <MainContent />
        </div>
      </div>
    </>
  );
}

export default App;
