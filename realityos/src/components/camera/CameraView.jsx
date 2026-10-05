import { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  Upload,
  MonitorUp,
  RotateCcw,
  X,
  Zap,
  Maximize2,
  Minimize2,
} from "lucide-react";

export default function CameraView({ onCapture }) {
  const inputRef = useRef(null);
  const sectionRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [camera, setCamera] = useState(false);
  const [facing, setFacing] = useState("environment");
  const [mode, setMode] = useState("auto");
  const [language, setLanguage] = useState(() => navigator.language || "en-US");
  const [dragging, setDragging] = useState(false);
  const [screenError, setScreenError] = useState("");
  const [immersive, setImmersive] = useState(false);
  const selectFile = useCallback((file) => {
    if (!file) return;

    const url = URL.createObjectURL(file);

    setPreview(url);
    onCapture(file, mode, language);
  }, [language, mode, onCapture]);

  useEffect(() => {
    const handlePaste = (event) => {
      const image = [...(event.clipboardData?.items || [])].find((item) => item.type.startsWith("image/"));
      if (!image) return;
      event.preventDefault();
      const file = image.getAsFile();
      if (file) selectFile(file);
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [selectFile]);

  useEffect(() => {
    const syncFullscreen = () => setImmersive(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  const handleUpload = (event) => {
    selectFile(event.target.files?.[0]);
  };

  const captureScreen = async () => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      setScreenError("Screen capture is not supported in this browser.");
      return;
    }
    try {
      setScreenError("");
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      const video = document.createElement("video");
      video.srcObject = stream;
      video.muted = true;
      await video.play();
      await new Promise((resolve) => window.requestAnimationFrame(resolve));
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 1920;
      canvas.height = video.videoHeight || 1080;
      canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
      stream.getTracks().forEach((track) => track.stop());
      canvas.toBlob((blob) => {
        if (blob) selectFile(new File([blob], `realityos-screen-${Date.now()}.jpg`, { type: "image/jpeg" }));
      }, "image/jpeg", 0.9);
    } catch (error) {
      if (error.name !== "AbortError") setScreenError("Screen capture was unavailable. You can upload an image instead.");
    }
  };

  const toggleImmersive = async () => {
    try {
      if (!document.fullscreenElement) {
        await sectionRef.current?.requestFullscreen?.();
      } else {
        await document.exitFullscreen?.();
      }
    } catch {
      setImmersive(false);
    }
  };

  return (
    <section ref={sectionRef} className={`camera-section ${immersive ? "immersive" : ""}`}>
      <div className="camera-top">
        <div>
          <span className="eyebrow">
            REALITY INPUT
          </span>

          <h2>Point. Capture. Understand.</h2>

          <p>
            Show RealityOS anything around you.
          </p>
        </div>

        <div className="live-pill">
          <span />
          Vision ready
        </div>
        <button className="immersive-button" onClick={toggleImmersive} aria-label={immersive ? "Exit focus mode" : "Enter focus mode"} title={immersive ? "Exit focus mode" : "Focus mode"}>
          {immersive ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </button>
      </div>

      <div className="lens-modes" aria-label="Reality Lens mode">
        <span className="lens-modes-label">REALITY LENS</span>
        {[['auto', 'Auto'], ['document', 'Documents'], ['product', 'Products'], ['place', 'Places'], ['object', 'Objects'], ['translate', 'Translate']].map(([id, label]) => (
          <button key={id} className={mode === id ? "active" : ""} onClick={() => setMode(id)} aria-pressed={mode === id}>{label}</button>
        ))}
      </div>
      {mode === "translate" && <label className="lens-language">Translate to <select value={language} onChange={(event) => setLanguage(event.target.value)}><option value="en-US">English</option><option value="hi-IN">Hindi</option><option value="es-ES">Spanish</option><option value="fr-FR">French</option><option value="ja-JP">Japanese</option><option value="ar-SA">Arabic</option></select></label>}

      <div className={`camera-frame ${dragging ? "dragging" : ""}`} onDragEnter={(event) => { event.preventDefault(); setDragging(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={(event) => { if (event.currentTarget === event.target) setDragging(false); }} onDrop={(event) => { event.preventDefault(); setDragging(false); const file = [...event.dataTransfer.files].find((item) => item.type.startsWith("image/")); if (file) selectFile(file); }}>
        {dragging && <div className="drop-overlay"><Upload size={22} /><strong>Drop to understand</strong><span>RealityOS will analyze this image</span></div>}
        {preview ? (
          <>
            <img
              src={preview}
              alt="RealityOS input"
              className="camera-preview"
            />

            <button
              className="remove-preview"
              onClick={() => setPreview(null)}
            >
              <X size={18} />
            </button>
          </>
        ) : (
          <div className="camera-empty">
            <div className="scan-corners" />

            <div className="camera-icon">
              <Camera size={30} />
            </div>

            <h3>Capture your surroundings</h3>

            <p>
              Scan a document, product, sign,
              object or anything you want to
              understand.
            </p>

            <div className="camera-buttons">
              <button
                className="primary-button"
                onClick={() => setCamera(true)}
              >
                <Camera size={17} />
                Open camera
              </button>

              <button
                className="secondary-button"
                onClick={() =>
                  inputRef.current?.click()
                }
              >
                <Upload size={17} />
                Upload image
              </button>

              <button className="secondary-button" onClick={captureScreen}>
                <MonitorUp size={17} />
                Scan screen
              </button>
            </div>

            <span className="format-label">
              JPG · PNG · WEBP · DROP OR PASTE
            </span>
          </div>
        )}
      </div>

      {screenError && <p className="camera-error" role="alert">{screenError}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleUpload}
      />

      {camera && (
        <CameraModal
          facing={facing}
          onClose={() => setCamera(false)}
          onSwitch={() =>
            setFacing((value) =>
              value === "environment"
                ? "user"
              : "environment"
            )
          }
          onCapture={(file) => {
            setCamera(false);
            selectFile(file);
          }}
          onUpload={() => {
            setCamera(false);
            inputRef.current?.click();
          }}
        />
      )}
    </section>
  );
}

function CameraModal({
  facing,
  onClose,
  onSwitch,
  onCapture,
  onUpload,
}) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(() =>
    typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia
      ? ""
      : "Camera access is unavailable. You can upload an image instead."
  );
  const [barcode, setBarcode] = useState("");
  const [barcodeCopied, setBarcodeCopied] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [torchAvailable, setTorchAvailable] = useState(false);

  useEffect(() => {
    let active = true;
    let nextStream;

    if (!navigator.mediaDevices?.getUserMedia) {
      return undefined;
    }

    navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: facing }, width: { ideal: 1920 }, height: { ideal: 1080 } },
      audio: false,
    }).then((value) => {
      nextStream = value;
      if (!active) {
        value.getTracks().forEach((track) => track.stop());
        return;
      }
      setStream(value);
      setTorchAvailable(Boolean(value.getVideoTracks()[0]?.getCapabilities?.().torch));
      setTorchOn(false);
      setCameraError("");
    }).catch(() => {
      if (active) setCameraError("Camera access is unavailable. You can upload an image instead.");
    });

    return () => {
      active = false;
      nextStream?.getTracks().forEach((track) => track.stop());
      setStream((value) => {
        value?.getTracks().forEach((track) => track.stop());
        return null;
      });
      setTorchAvailable(false);
      setTorchOn(false);
    };
  }, [facing]);

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);

  useEffect(() => {
    if (!stream || !("BarcodeDetector" in window)) return undefined;
    let active = true;
    let detector;
    try {
      detector = new window.BarcodeDetector({ formats: ["qr_code", "ean_13", "ean_8", "upc_a", "upc_e", "code_128"] });
    } catch {
      return undefined;
    }
    const scan = async () => {
      if (!active || !videoRef.current || videoRef.current.readyState < 2) return;
      try {
        const codes = await detector.detect(videoRef.current);
        if (active && codes[0]?.rawValue) setBarcode(codes[0].rawValue);
      } catch { /* A frame can be undecodable while the camera is starting. */ }
    };
    const interval = window.setInterval(scan, 700);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [stream]);

  const copyBarcode = async () => {
    if (!barcode) return;
    try { await navigator.clipboard?.writeText(barcode); } catch { return; }
    setBarcodeCopied(true);
    window.setTimeout(() => setBarcodeCopied(false), 1600);
  };

  const toggleTorch = async () => {
    const track = stream?.getVideoTracks()[0];
    const capabilities = track?.getCapabilities?.();
    if (!track || !capabilities?.torch) {
      setCameraError("Torch control is not available on this camera. You can still capture normally.");
      return;
    }
    try {
      await track.applyConstraints({ advanced: [{ torch: !torchOn }] });
      setTorchOn((value) => !value);
      setCameraError("");
    } catch {
      setCameraError("The camera could not change its torch setting.");
    }
  };

  const capture = () => {
    if (!videoRef.current || !stream) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) onCapture(new File([blob], `realityos-${Date.now()}.jpg`, { type: "image/jpeg" }));
    }, "image/jpeg", 0.9);
  };

  return (
    <div className="modal-backdrop">
      <div className="camera-modal">
        <div className="modal-header">
          <div>
            <span className="eyebrow">LIVE CAMERA</span>
            <h3>Reality scanner</h3>
          </div>

          <button
            className="icon-button"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="live-camera">
          {stream && <video ref={videoRef} autoPlay muted playsInline className="live-video" style={{ transform: facing === "user" ? "scaleX(-1)" : "none" }} />}
          <div className="live-grid" />

          {!stream && <div className="live-target">
            <span />
          </div>}

          <div className="live-message" role={cameraError ? "alert" : undefined}>
            {cameraError || (stream ? "Align an object inside the frame" : "Starting camera…")}
          </div>

          {barcode && <div className="barcode-result"><span>LIVE CODE DETECTED</span><strong>{barcode}</strong><div><button onClick={copyBarcode}>{barcodeCopied ? "Copied" : "Copy"}</button>{/^https?:\/\//i.test(barcode) && <a href={barcode} target="_blank" rel="noreferrer">Open link</a>}</div></div>}
        </div>

        <div className="camera-controls">
          <button
            className="round-control"
            onClick={onSwitch}
          >
            <RotateCcw size={19} />
          </button>

          <button
            className="capture-button"
            onClick={capture}
            disabled={!stream}
            aria-label="Capture image"
          >
            <span>
              <Camera size={23} />
            </span>
          </button>

          <button className={`round-control ${torchOn ? "active" : ""}`} onClick={toggleTorch} disabled={!stream} aria-label={torchOn ? "Turn torch off" : "Turn torch on"} aria-pressed={torchOn} title={torchAvailable ? "Toggle torch" : "Torch unavailable"}>
            <Zap size={19} />
          </button>
        </div>
        <button className="camera-upload-link" onClick={onUpload}>Upload an image instead</button>
      </div>

      <div className="lens-modes" aria-label="Reality Lens mode">
        <span className="lens-modes-label">REALITY LENS</span>
        {[['auto', 'Auto'], ['document', 'Documents'], ['product', 'Products'], ['place', 'Places'], ['object', 'Objects']].map(([id, label]) => (
          <button key={id} className={mode === id ? "active" : ""} onClick={() => setMode(id)} aria-pressed={mode === id}>{label}</button>
        ))}
      </div>
    </div>
  );
}
