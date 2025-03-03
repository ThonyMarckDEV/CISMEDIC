import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../js/urlHelper.js";
import LoadingScreen from "../home/LoadingScreen.jsx";
import SweetAlert from "../../components/SweetAlert";
import jwtUtils from "../../utilities/jwtUtils.jsx";
import { verificarYRenovarToken } from "../../js/authToken";

const MercadoPago = ({ cita, appointment }) => {
  const [loading, setLoading] = useState(false);
  const [mercadoPago, setMercadoPago] = useState(null);
  const [error, setError] = useState(null);
  const [tipoComprobante, setTipoComprobante] = useState("boleta");
  const [ruc, setRuc] = useState("");
  const [rucError, setRucError] = useState("");
  const [rucValid, setRucValid] = useState(false);

  useEffect(() => {
    //console.log("Appointment data:", appointment);
    const initializeMercadoPago = () => {
      const scriptId = "mercadoPagoScript";
      const existingScript = document.getElementById(scriptId);
      
      if (existingScript && window.MercadoPago) {
        setMercadoPago(new window.MercadoPago("APP_USR-3565480b-bcf8-469b-afaa-e690729444af", { locale: "es-PE" }));
       //setMercadoPago(new window.MercadoPago("APP_USR-befe1f6a-9fa4-40c5-85db-22f44139f7d8", { locale: "es-PE" }));
        return;
      }

      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://sdk.mercadopago.com/js/v2";
      
      script.onload = () => {
        if (window.MercadoPago) {
          setMercadoPago(new window.MercadoPago("APP_USR-3565480b-bcf8-469b-afaa-e690729444af", { locale: "es-PE" }));
        // setMercadoPago(new window.MercadoPago("APP_USR-befe1f6a-9fa4-40c5-85db-22f44139f7d8", { locale: "es-PE" }));
        } else {
          setError("Error al cargar el SDK de MercadoPago.");
        }
      };
      
      script.onerror = () => setError("Error al cargar el SDK de MercadoPago.");
      document.body.appendChild(script);
      
      return () => {
        const loadedScript = document.getElementById(scriptId);
        if (loadedScript) {
          document.body.removeChild(loadedScript);
        }
      };
    };

    initializeMercadoPago();
  }, [appointment]);

  const validateRuc = async (rucNumber) => {
    if (!/^\d{11}$/.test(rucNumber)) {
      setRucError("El RUC debe tener exactamente 11 dígitos numéricos");
      setRucValid(false);
      return;
    }
    
    setLoading(true);
    
    try {
      // Obtener el token de autenticación (si estás usando autenticación)
      const token = jwtUtils.getTokenFromCookie();
      
      // Hacer fetch al endpoint de Laravel
      const response = await fetch(`${API_BASE_URL}/api/validate-ruc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ ruc: rucNumber })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data.ruc) {
        setRucValid(true);
        setRucError("");
      } else {
        setRucError(data.message || "RUC no encontrado o inválido");
        setRucValid(false);
      }
    } catch (error) {
      console.error("Error validando RUC:", error);
      setRucError(
        error.message.includes("HTTP error")
          ? "Servicio de validación no disponible. Intente más tarde."
          : "Error al validar el RUC. Verifique su conexión."
      );
      setRucValid(false);
    } finally {
      setLoading(false);
    }
  };

  const handleComprobanteChange = (e) => {
    setTipoComprobante(e.target.value);
    if (e.target.value === "boleta") {
      setRuc("");
      setRucError("");
      setRucValid(false);
    }
  };

  const actualizarComprobante = async () => {
    try {
      const token = jwtUtils.getTokenFromCookie();
      await verificarYRenovarToken();

      const requestBody = {
        idPago: appointment.idPago, // Using idPago from appointment
        tipo_comprobante: tipoComprobante,
      };

      if (tipoComprobante === "factura") {
        requestBody.ruc = ruc;
      }

    //  console.log("Sending actualizarComprobante request:", requestBody);

      const response = await fetch(`${API_BASE_URL}/api/actualizar-comprobante`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
   //   console.log("actualizarComprobante response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Error al actualizar el comprobante");
      }

      return data;
    } catch (error) {
      console.error("Error in actualizarComprobante:", error);
      throw new Error(`Error al actualizar comprobante: ${error.message}`);
    }
  };

  const handlePago = async () => {
    if (!mercadoPago) {
      setError("MercadoPago no está disponible. Por favor, intenta más tarde.");
      return;
    }
  
    if (!appointment?.idPago) {
      console.error("No payment ID found:", appointment);
      setError("No se encontró un ID de pago válido.");
      return;
    }
  
    if (tipoComprobante === "factura" && !rucValid) {
      setError("Por favor, ingresa un RUC válido.");
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
     // console.log("Starting payment process for payment ID:", appointment.idPago);
  
      // Primero actualizar el comprobante
      await actualizarComprobante();
  
      const token = jwtUtils.getTokenFromCookie();
      const decodedToken = decodeJWT(token);
      const correoUsuario = decodedToken?.correo;
  
      if (!correoUsuario) {
        throw new Error("No se pudo obtener el correo del usuario.");
      }
  
      await verificarYRenovarToken();
  
      const paymentRequestBody = {
        idCita: cita.idCita,
        monto: cita.monto,
        correo: correoUsuario,
        tipo_comprobante: tipoComprobante,
        ruc: tipoComprobante === "factura" ? ruc : null,
      };
  
      //console.log("Sending payment preference request:", paymentRequestBody);
  
      const response = await fetch(`${API_BASE_URL}/api/payment/preference`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentRequestBody),
      });
  
      // Clone the response to read it multiple times
      const responseClone = response.clone();
  
      let data;
      try {
        data = await response.json();
      } catch (error) {
        console.error("Failed to parse JSON response:", error);
        const textResponse = await responseClone.text(); // Use the cloned response
        console.error("Server response:", textResponse);
        throw new Error("Server returned an invalid response");
      }
  
      if (!response.ok) {
        throw new Error(data?.message || "Error al crear la preferencia de pago.");
      }
  
      if (data.success) {
        mercadoPago.checkout({
          preference: { id: data.preference_id },
          autoOpen: true,
        });
      } else {
        throw new Error(data.message || "Error al crear la preferencia de pago.");
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      setError(error.message || "Error al procesar el pago. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };


  const decodeJWT = (token) => {
    try {
      const payloadBase64 = token.split(".")[1];
      const payload = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
      return JSON.parse(payload);
    } catch (error) {
      console.error("Error al decodificar el JWT:", error);
      return null;
    }
  };

  return (
    <div>
      {loading && <LoadingScreen />}
      {error && (
        <div className="py-2 text-center text-white bg-red-500 rounded-lg mb-2">
          {error}
        </div>
      )}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tipo de Comprobante
          </label>
          <select
            value={tipoComprobante}
            onChange={handleComprobanteChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-700 focus:border-green-700 sm:text-sm"
          >
            <option value="boleta">Boleta</option>
            <option value="factura">Factura</option>
          </select>
        </div>

        {tipoComprobante === "factura" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">RUC</label>
            <input
              type="text"
              value={ruc}
              onChange={(e) => {
                const value = e.target.value.trim();
                setRuc(value);
                if (value.length === 11) {
                  validateRuc(value);
                } else {
                  setRucValid(false);
                }
              }}
              maxLength={11}
              placeholder="Ingrese RUC"
              className={`mt-1 block w-full border ${
                rucError ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-700 focus:border-green-700 sm:text-sm`}
            />
            {rucError && <p className="text-sm text-red-500">{rucError}</p>}
          </div>
        )}

        <button
          onClick={handlePago}
          disabled={tipoComprobante === "factura" && !rucValid}
          className={`w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
            tipoComprobante === "factura" && !rucValid
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-700 text-white hover:bg-green-800"
          }`}
        >
          {loading ? "Procesando..." : "Pagar Cita"}
        </button>
      </div>
    </div>
  );
};

export default MercadoPago;