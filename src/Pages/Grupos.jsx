import { useState } from 'react';
import { Sidebar } from '../components/sidebar';
import { Navbar } from '../components/navbar';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const initialGrupos = [
	{ id: 1, nombre: 'Grupo A' },
	{ id: 2, nombre: 'Grupo B' }
];

export const Grupos = ({ user, setUser }) => {
	const [grupos, setGrupos] = useState(initialGrupos);
	const [nombreNuevo, setNombreNuevo] = useState('');
	const [editId, setEditId] = useState(null);
	const [editNombre, setEditNombre] = useState('');

	// Crear grupo
	const handleAdd = () => {
		if (nombreNuevo.trim()) {
			setGrupos([...grupos, { id: Date.now(), nombre: nombreNuevo }]);
			setNombreNuevo('');
		}
	};

	// Eliminar grupo
	const handleDelete = (id) => {
		setGrupos(grupos.filter(g => g.id !== id));
	};

	// Iniciar edición
	const handleEdit = (id, nombre) => {
		setEditId(id);
		setEditNombre(nombre);
	};

	// Guardar edición
	const handleUpdate = () => {
		setGrupos(grupos.map(g => g.id === editId ? { ...g, nombre: editNombre } : g));
		setEditId(null);
		setEditNombre('');
	};

	// PDF
	const handleReportPDF = () => {
		const doc = new jsPDF();
		doc.text('Reporte de Grupos', 14, 16);
		autoTable(doc, {
			startY: 22,
			head: [['ID', 'Nombre']],
			body: grupos.map(g => [g.id, g.nombre]),
			theme: 'grid',
			styles: { halign: 'center' },
			headStyles: { fillColor: [37, 99, 235] },
		});
		doc.save('grupos.pdf');
	};

	// Excel
	const handleReportExcel = () => {
		const ws = XLSX.utils.json_to_sheet(grupos);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Grupos');
		XLSX.writeFile(wb, 'grupos.xlsx');
	};

	return (
		<div className="flex h-screen bg-gray-50">
			<Sidebar user={user} />
			<div className="flex-1 flex flex-col overflow-hidden">
				<Navbar user={user} setUser={setUser} />
				<main className="flex-1 overflow-y-auto p-6">
					<div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
						<h2 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Grupos</h2>
						<div className="flex items-center gap-3 mb-8">
							<input
								type="text"
								className="border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
								placeholder="Nuevo grupo"
								value={nombreNuevo}
								onChange={e => setNombreNuevo(e.target.value)}
							/>
							<button
								className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
								onClick={handleAdd}
							>
								<Plus className="w-5 h-5" />
								Crear
							</button>
						</div>
						<ul className="space-y-4 mb-8">
							{grupos.map(g => (
								<li key={g.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
									{editId === g.id ? (
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
											<span className="font-medium text-gray-900">{g.nombre}</span>
											<div className="flex items-center gap-2">
												<button
													className="bg-purple-100 text-purple-600 px-2 py-1 rounded-lg hover:bg-purple-200"
													onClick={() => handleEdit(g.id, g.nombre)}
												>
													<Edit className="w-4 h-4" />
												</button>
												<button
													className="bg-orange-100 text-orange-600 px-2 py-1 rounded-lg hover:bg-orange-200"
													onClick={() => handleDelete(g.id)}
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
							>
								<FileText className="w-5 h-5" />
								Reporte PDF de Grupos
							</button>
							<button
								className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
								onClick={handleReportExcel}
							>
								<FileText className="w-5 h-5" />
								Reporte Excel de Grupos
							</button>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default Grupos;
