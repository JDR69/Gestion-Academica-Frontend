import { useEffect, useState } from "react";
import { Sidebar } from "../components/sidebar";
import { Navbar } from "../components/navbar";
import { Plus, Edit, Trash2, FileText } from "lucide-react";
import {
  getHorarios,
  createHorario,
  deleteHorario,
  updateHorario,
} from "../api/axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

/*const initialHorarios = [
  { id: 1, horaInicio: "08:00", horaFin: "10:00" },
  { id: 2, horaInicio: "10:00", horaFin: "12:00" },
];*/

export const Horarios = ({ user, setUser }) => {
  const [horarios, setHorarios] = useState([]);
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [editId, setEditId] = useState(null);
  const [editInicio, setEditInicio] = useState("");
  const [editFin, setEditFin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Crear horario
  // Convierte 'HH:mm' a 'HH:mm:ss'
  const formatHora = (hora) => {
    if (!hora) return "";
    return hora.length === 5 ? `${hora}:00` : hora;
  };

  const handleAdd = async () => {
    if (horaInicio && horaFin) {
      setLoading(true);
      setError("");
      try {
        const horarioData = {
          Hora_Inicio: formatHora(horaInicio),
          Hora_Fin: formatHora(horaFin),
        };
        await createHorario(horarioData);
        await fetchHorarios();
        setHoraInicio("");
        setHoraFin("");
      } catch (e) {
        console.error(e);
        setError("No se pudo crear el horario");
      } finally {
        setLoading(false);
      }
    }
  };

  // Obtener horarios
  const fetchHorarios = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getHorarios();
      const raw = Array.isArray(data) ? data : data.data || [];
      const list = raw.map((m) => ({
        id: m.ID ?? m.id,
        horaInicio: m.Hora_Inicio ?? m.horaInicio,
        horaFin: m.Hora_Fin ?? m.horaFin,
      }));
      setHorarios(list);
    } catch (e) {
	  console.error(e);
      setError("No se pudo cargar la lista de horarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHorarios();
  }, []);

  // Eliminar horario
  const handleDelete = async (id) => {
    setLoading(true);
    setError("");
    try {
      await deleteHorario(id);
      await fetchHorarios();
    } catch (e) {
      console.error(e);
      setError("No se pudo eliminar el horario");
    } finally {
      setLoading(false);
    }
  };

  // Iniciar edición
  const handleEdit = (id, inicio, fin) => {
    setEditId(id);
    setEditInicio(inicio);
    setEditFin(fin);
  };

  // Guardar edición
  const handleUpdate = async () => {
    setLoading(true);
    setError("");
    try {
      const horarioData = {
        Hora_Inicio: formatHora(editInicio),
        Hora_Fin: formatHora(editFin),
      };
      await updateHorario(editId, horarioData);
      await fetchHorarios();
      setEditId(null);
      setEditInicio("");
      setEditFin("");
    } catch (e) {
      console.error(e);
      setError("No se pudo actualizar el horario");
    } finally {
      setLoading(false);
    }
  };

  // PDF
  const handleReportPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Horarios", 14, 16);
    autoTable(doc, {
      startY: 22,
      head: [["ID", "Hora Inicio", "Hora Fin"]],
      body: horarios.map((h) => [h.id, h.horaInicio, h.horaFin]),
      theme: "grid",
      styles: { halign: "center" },
      headStyles: { fillColor: [37, 99, 235] },
    });
    doc.save("horarios.pdf");
  };

  // Excel
  const handleReportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(horarios);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Horarios");
    XLSX.writeFile(wb, "horarios.xlsx");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} setUser={setUser} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Gestión de Horarios
            </h2>

            {/* Mensaje de carga */}
            {loading && (
              <div className="mb-4 text-blue-600 font-medium flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                Cargando...
              </div>
            )}
            {/* Mensaje de error */}
            {error && (
              <div className="mb-4 text-red-600 font-medium flex items-center gap-2">
                <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
                <button className="ml-2 underline text-sm" onClick={fetchHorarios}>Reintentar</button>
              </div>
            )}

            <div className="flex items-center gap-3 mb-8">
              <input
                type="time"
                className="border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Hora inicio"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                disabled={loading}
              />
              <input
                type="time"
                className="border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Hora fin"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                disabled={loading}
              />
              <button
                className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
                onClick={handleAdd}
                disabled={loading}
              >
                <Plus className="w-5 h-5" />
                Crear
              </button>
            </div>
            <ul className="space-y-4 mb-8">
              {horarios.map((h) => (
                <li
                  key={h.id}
                  className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  {editId === h.id ? (
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="time"
                        className="border border-purple-200 rounded-lg px-3 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        value={editInicio}
                        onChange={(e) => setEditInicio(e.target.value)}
                        disabled={loading}
                      />
                      <input
                        type="time"
                        className="border border-purple-200 rounded-lg px-3 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        value={editFin}
                        onChange={(e) => setEditFin(e.target.value)}
                        disabled={loading}
                      />
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 disabled:opacity-60"
                        onClick={handleUpdate}
                        disabled={loading}
                      >
                        Guardar
                      </button>
                      <button
                        className="bg-gray-200 text-gray-600 px-3 py-1 rounded-lg hover:bg-gray-300 disabled:opacity-60"
                        onClick={() => setEditId(null)}
                        disabled={loading}
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-gray-900">
                        {h.horaInicio} - {h.horaFin}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          className="bg-purple-100 text-purple-600 px-2 py-1 rounded-lg hover:bg-purple-200 disabled:opacity-60"
                          onClick={() =>
                            handleEdit(h.id, h.horaInicio, h.horaFin)
                          }
                          disabled={loading}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="bg-orange-100 text-orange-600 px-2 py-1 rounded-lg hover:bg-orange-200 disabled:opacity-60"
                          onClick={() => handleDelete(h.id)}
                          disabled={loading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
            <div className="flex gap-4">
              <button
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                onClick={handleReportPDF}
                disabled={loading}
              >
                <FileText className="w-5 h-5" />
                Reporte PDF de Horarios
              </button>
              <button
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={handleReportExcel}
                disabled={loading}
              >
                <FileText className="w-5 h-5" />
                Reporte Excel de Horarios
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Horarios;
