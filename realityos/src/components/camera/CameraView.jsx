import { useRef, useState } from "react";
import {
  Camera,
  Upload,
  RotateCcw,
  X,
  Zap,
} from "lucide-react";

export default function CameraView({ onCapture }) {
  const inputRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [camera, setCamera] = useState(false);
  const [facing, setFacing] = useState("environment");

  const selectFile = (file) => {
    if (!file) return;

    const url = URL.createObjectURL(file);

    setPreview(url);
    onCapture(file);
  };

  const handleUpload = (event) => {
    selectFile(event.target.files?.[0]);
  };

  return (
    <section className="camera-section">
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
      </div>

      <div className="camera-frame">
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
            </div>

            <span className="format-label">
              JPG · PNG · WEBP
            </span>
          </div>
        )}
      </div>

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
  onClose,
  onSwitch,
  onUpload,
}) {
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
          <div className="live-grid" />

          <div className="live-target">
            <span />
          </div>

          <div className="live-message">
            Camera preview
          </div>
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
            onClick={onUpload}
          >
            <span>
              <Camera size={23} />
            </span>
          </button>

          <button className="round-control">
            <Zap size={19} />
          </button>
        </div>
      </div>
    </div>
  );
}