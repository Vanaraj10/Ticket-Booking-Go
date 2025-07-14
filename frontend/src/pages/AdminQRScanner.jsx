import { useRef, useEffect, useState } from "react";
import jsQR from "jsqr";

const BACKEND_URL = "https://ticket-booking-go.onrender.com";

export default function AdminQRScanner() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [feedback, setFeedback] = useState("");
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    let stream;
    let animationId;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", true);
        videoRef.current.play();
        scan();
      } catch (err) {
        setFeedback("Camera access denied or not available.");
      }
    };

    const scan = () => {
      if (
        videoRef.current &&
        videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA &&
        !scanned
      ) {
        const canvas = canvasRef.current;
        const width = videoRef.current.videoWidth || 400;
        const height = videoRef.current.videoHeight || 300;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoRef.current, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const code = jsQR(imageData.data, width, height);
        if (code) {
          setScanned(true);
          handleScan(code.data);
          return;
        }
      }
      animationId = requestAnimationFrame(scan);
    };

    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
      if (animationId) cancelAnimationFrame(animationId);
    };
    // eslint-disable-next-line
  }, [scanned]);

  const handleScan = async (data) => {
    setFeedback("Validating...");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/admin/validate-booking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code: data }),
        }
      );
      const json = await res.json();
      setFeedback(json.message || json.error);
    } catch {
      setFeedback("Network error. Please try again.");
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "2rem auto",
        padding: "2rem",
        background: "#23272f",
        borderRadius: 12,
        color: "#fff",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Scan Booking QR Code
      </h2>
      <video ref={videoRef} style={{ width: "100%", borderRadius: 8 }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div style={{ marginTop: 20, textAlign: "center", fontWeight: 500 }}>
        {feedback}
      </div>
      {scanned && (
        <button
          style={{
            marginTop: 16,
            padding: "8px 16px",
            borderRadius: 8,
            background: "#1976d2",
            color: "#fff",
            border: "none",
            fontWeight: 500,
            cursor: "pointer",
          }}
          onClick={() => {
            setScanned(false);
            setFeedback("");
          }}
        >
          Scan Another
        </button>
      )}
    </div>
  );
}
