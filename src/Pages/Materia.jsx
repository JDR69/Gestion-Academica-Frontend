import { useEffect, useState } from 'react';
import { Sidebar } from '../components/sidebar';
import { Navbar } from '../components/navbar';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';

// Importar jsPDF y xlsx
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { getMaterias, createMateria, updateMateria, deleteMateria } from '../api/axios';


export const Materia = ({ user, setUser }) => {
  const [materias, setMaterias] = useState([]);
  const [nombreNueva, setNombreNueva] = useState('');
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar materias desde el backend
  useEffect(() => {
    const fetchMaterias = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await getMaterias();
        // data puede ser {data: [...]} o un array directo; normalizamos y mapeamos a {id, nombre}
        const raw = Array.isArray(data) ? data : (data.data || []);
        const list = raw.map(m => ({ id: m.ID ?? m.id, nombre: m.Nombre ?? m.nombre }));
        setMaterias(list);
      } catch (e) {
        console.error('Error cargando materias', e);
        setError('No se pudo cargar la lista de materias');
      } finally {
        setLoading(false);
      }
    };
    fetchMaterias();
  }, []);

  // Crear materia
  const handleAdd = async () => {
    if (!nombreNueva.trim()) return;
    try {
      const { data } = await createMateria({ Nombre: nombreNueva.trim() });
      const created = data?.data || data; // normalizar
      const normalized = { id: created.ID ?? created.id, nombre: created.Nombre ?? created.nombre };
      setMaterias(prev => [...prev, normalized]);
      setNombreNueva('');
    } catch (e) {
      console.error('Error creando materia', e);
      alert('No se pudo crear la materia');
    }
  };

  // Eliminar materia
  const handleDelete = async (id) => {
    try {
      await deleteMateria(id);
      setMaterias(prev => prev.filter(m => m.id !== id));
    } catch (e) {
      console.error('Error eliminando materia', e);
      alert('No se pudo eliminar la materia');
    }
  };

  // Iniciar edición
  const handleEdit = (id, nombre) => {
    setEditId(id);
    setEditNombre(nombre);
  };

  // Guardar edición
  const handleUpdate = async () => {
    try {
      const { data } = await updateMateria(editId, { Nombre: editNombre });
      const updated = data?.data || data;
      const normalized = { id: updated.ID ?? updated.id, nombre: updated.Nombre ?? updated.nombre };
      setMaterias(prev => prev.map(m => (m.id === editId ? normalized : m)));
      setEditId(null);
      setEditNombre('');
    } catch (e) {
      console.error('Error actualizando materia', e);
      alert('No se pudo actualizar la materia');
    }
  };


  // Generar reporte PDF de materias
  const handleReportPDF = () => {
    const doc = new jsPDF();
    doc.text('Reporte de Materias', 14, 16);
    autoTable(doc, {
      startY: 22,
      head: [['ID', 'Nombre']],
      body: materias.map(m => [m.id, m.nombre]),
      theme: 'grid',
      styles: { halign: 'center' },
      headStyles: { fillColor: [37, 99, 235] }, // blue-600
    });
    doc.save('materias.pdf');
  };

  // Generar reporte Excel de materias
  const handleReportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(materias);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Materias');
    XLSX.writeFile(wb, 'materias.xlsx');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} setUser={setUser} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Materias</h2>
            {/* Crear materia */}
            <div className="flex items-center gap-3 mb-8">
              <input
                type="text"
                className="border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
                placeholder="Nueva materia"
                value={nombreNueva}
                onChange={e => setNombreNueva(e.target.value)}
              />
              <button
                className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={handleAdd}
              >
                <Plus className="w-5 h-5" />
                Crear
              </button>
            </div>

            {loading && (
              <div className="mb-4 text-sm text-gray-500">Cargando materias...</div>
            )}
            {error && (
              <div className="mb-4 text-sm text-red-600">{error}</div>
            )}
            {/* Lista de materias */}
            <ul className="space-y-4 mb-8">
              {materias.map(m => (
                <li key={m.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
                  {editId === m.id ? (
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="text"
                        className="border border-purple-200 rounded-lg px-3 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 w-full"
                        value={editNombre}
                        onChange={e => setEditNombre(e.target.value)}
                      />
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                        onClick={handleUpdate}
                      >
                        Guardar
                      </button>
                      <button
                        className="bg-gray-200 text-gray-600 px-3 py-1 rounded-lg hover:bg-gray-300"
                        onClick={() => setEditId(null)}
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-gray-900">{m.nombre}</span>
                      <div className="flex items-center gap-2">
                        <button
                          className="bg-purple-100 text-purple-600 px-2 py-1 rounded-lg hover:bg-purple-200"
                          onClick={() => handleEdit(m.id, m.nombre)}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="bg-orange-100 text-orange-600 px-2 py-1 rounded-lg hover:bg-orange-200"
                          onClick={() => handleDelete(m.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>

            {/* Botones de reportes */}
            <div className="flex gap-4">
              <button
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                onClick={handleReportPDF}
              >
                <FileText className="w-5 h-5" />
                Reporte PDF de Materias
              </button>
              <button
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={handleReportExcel}
              >
                <FileText className="w-5 h-5" />
                Reporte Excel de Materias
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Materia;