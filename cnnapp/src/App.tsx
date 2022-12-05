import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [result, setResult] = useState("");
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadFile = async () => {
    if (selectedFile) {
      const formData = new FormData();

      formData.append("img", selectedFile, selectedFile.name);
      const data = await fetch("http://127.0.0.1:8000/upload-image", {
        method: "post",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      const uploadedImage = await data.json();
      if (uploadedImage?.result) setResult(uploadedImage.result);
    }
  };

  return (
    <div className="App">
      <span>Upload your image</span>
      <input
        id="input"
        type="file"
        onChange={(e) => {
          if (e?.target?.files) {
            setFilename(e.target.files[0].name);
            setSelectedFile(e.target.files[0]);
          }
        }}
      />
      <label htmlFor="input">{!filename ? "Select file" : filename}</label>
      <div id="button-upload" onClick={() => uploadFile()}>
        Classify
      </div>
      {result ? (
        <div id="result-container">
          <p id="result-label">{result}</p>
        </div>
      ) : (
        <div id="empty-result-container" />
      )}
    </div>
  );
}

export default App;
