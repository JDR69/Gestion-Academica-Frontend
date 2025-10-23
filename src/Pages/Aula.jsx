import { useState } from 'react';
import { Sidebar } from '../components/sidebar';
import { Navbar } from '../components/navbar';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const initialAulas = [
	{ id: 1, nroFacultad: 236, nroAula: '101' },
	{ id: 2, nroFacultad: 236, nroAula: '203' }
];

export const Aula = ({ user, setUser }) => {
	const [aulas, setAulas] = useState(initialAulas);
	const [nroFacultad, setNroFacultad] = useState('236');
	const [nroAula, setNroAula] = useState('');
	const [editId, setEditId] = useState(null);
	const [editFacultad, setEditFacultad] = useState('236');
	const [editAula, setEditAula] = useState('');

	// Crear aula
	const handleAdd = () => {
		if (nroAula.trim()) {
			setAulas([...aulas, { id: Date.now(), nroFacultad: nroFacultad, nroAula }]);
			setNroFacultad('236');
			setNroAula('');
		}
	};

	// Eliminar aula
	const handleDelete = (id) => {
		setAulas(aulas.filter(a => a.id !== id));
	};

	// Iniciar edición
	const handleEdit = (id, facultad, aula) => {
		setEditId(id);
		setEditFacultad(facultad);
		setEditAula(aula);
	};

	// Guardar edición
	const handleUpdate = () => {
		setAulas(aulas.map(a => a.id === editId ? { ...a, nroFacultad: editFacultad, nroAula: editAula } : a));
		setEditId(null);
		setEditFacultad('236');
		setEditAula('');
	};

	// PDF
	const handleReportPDF = () => {
		const doc = new jsPDF();
		doc.text('Reporte de Aulas', 14, 16);
		autoTable(doc, {
			startY: 22,
			head: [['ID', 'Nro Facultad', 'Nro Aula']],
			body: aulas.map(a => [a.id, a.nroFacultad, a.nroAula]),
			theme: 'grid',
			styles: { halign: 'center' },
			headStyles: { fillColor: [37, 99, 235] },
		});
		doc.save('aulas.pdf');
	};

	// Excel
	const handleReportExcel = () => {
		const ws = XLSX.utils.json_to_sheet(aulas);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Aulas');
		XLSX.writeFile(wb, 'aulas.xlsx');
	};

	return (
		<div className="flex h-screen bg-gray-50">
			<Sidebar user={user} />
			<div className="flex-1 flex flex-col overflow-hidden">
				<Navbar user={user} setUser={setUser} />
				<main className="flex-1 overflow-y-auto p-6">
					<div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
						<h2 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Aulas</h2>
						<div className="flex items-center gap-3 mb-8">
							<input
								type="number"
								className="border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 w-32"
								placeholder="Nro Facultad"
								value={nroFacultad}
								onChange={e => setNroFacultad(e.target.value)}
							/>
							<input
								type="text"
								className="border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 w-32"
								placeholder="Nro Aula"
								value={nroAula}
								onChange={e => setNroAula(e.target.value)}
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
							{aulas.map(a => (
								<li key={a.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
									{editId === a.id ? (
										<div className="flex items-center gap-2 w-full">
											<input
												type="number"
												className="border border-purple-200 rounded-lg px-3 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 w-32"
												value={editFacultad}
												onChange={e => setEditFacultad(e.target.value)}
											/>
											<input
												type="text"
												className="border border-purple-200 rounded-lg px-3 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 w-32"
												value={editAula}
												onChange={e => setEditAula(e.target.value)}
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
											<span className="font-medium text-gray-900">{a.nroFacultad} - {a.nroAula}</span>
											<div className="flex items-center gap-2">
												<button
													className="bg-purple-100 text-purple-600 px-2 py-1 rounded-lg hover:bg-purple-200"
													onClick={() => handleEdit(a.id, a.nroFacultad, a.nroAula)}
												>
													<Edit className="w-4 h-4" />
												</button>
												<button
													className="bg-orange-100 text-orange-600 px-2 py-1 rounded-lg hover:bg-orange-200"
													onClick={() => handleDelete(a.id)}
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
								Reporte PDF de Aulas
							</button>
							<button
								className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
								onClick={handleReportExcel}
							>
								<FileText className="w-5 h-5" />
								Reporte Excel de Aulas
							</button>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default Aula;
