import { useEffect, useRef, useState } from "react";

export default function AdminQRScanner() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    let stream;
    const startCamera = async () => {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      videoRef.current.srcObject = stream;
      videoRef.current.setAttribute("playsinline", true);
      videoRef.current.play();
      scan();
    };

    const scan = () => {
      if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        if (code) {
          handleScan(code.data);
        }
      }
      requestAnimationFrame(scan);
    };

    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleScan = async (data) => {
     setFeedback("Validating QR code...");
     const token = localStorage.getItem("token");
     try {
        const res = await fetch("https://ticket-booking-go.onrender.com/api/admin/validate-booking",{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({code:data})
        });

        const json = await res.json();
        setFeedback(json.message);
     } catch (error) {
       console.error("Error validating QR code:", error);
       setFeedback("Failed to validate QR code. Please try again.");
     }
  }

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: "2rem", background: "#23272f", borderRadius: 12, color: "#fff" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Scan Booking QR Code</h2>
      <video ref={videoRef} style={{ width: "100%", borderRadius: 8 }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div style={{ marginTop: 20, textAlign: "center", fontWeight: 500 }}>
        {feedback}
      </div>
    </div>
  )
}
