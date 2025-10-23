import { useState } from 'react';
import { Sidebar } from '../components/sidebar';
import { Navbar } from '../components/navbar';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const initialHorarios = [
	{ id: 1, horaInicio: '08:00', horaFin: '10:00' },
	{ id: 2, horaInicio: '10:00', horaFin: '12:00' }
];

export const Horarios = ({ user, setUser }) => {
	const [horarios, setHorarios] = useState(initialHorarios);
	const [horaInicio, setHoraInicio] = useState('');
	const [horaFin, setHoraFin] = useState('');
	const [editId, setEditId] = useState(null);
	const [editInicio, setEditInicio] = useState('');
	const [editFin, setEditFin] = useState('');

	// Crear horario
	const handleAdd = () => {
		if (horaInicio && horaFin) {
			setHorarios([...horarios, { id: Date.now(), horaInicio, horaFin }]);
			setHoraInicio('');
			setHoraFin('');
		}
	};

	// Eliminar horario
	const handleDelete = (id) => {
		setHorarios(horarios.filter(h => h.id !== id));
	};

	// Iniciar edición
	const handleEdit = (id, inicio, fin) => {
		setEditId(id);
		setEditInicio(inicio);
		setEditFin(fin);
	};

	// Guardar edición
	const handleUpdate = () => {
		setHorarios(horarios.map(h => h.id === editId ? { ...h, horaInicio: editInicio, horaFin: editFin } : h));
		setEditId(null);
		setEditInicio('');
		setEditFin('');
	};

	// PDF
	const handleReportPDF = () => {
		const doc = new jsPDF();
		doc.text('Reporte de Horarios', 14, 16);
		autoTable(doc, {
			startY: 22,
			head: [['ID', 'Hora Inicio', 'Hora Fin']],
			body: horarios.map(h => [h.id, h.horaInicio, h.horaFin]),
			theme: 'grid',
			styles: { halign: 'center' },
			headStyles: { fillColor: [37, 99, 235] },
		});
		doc.save('horarios.pdf');
	};

	// Excel
	const handleReportExcel = () => {
		const ws = XLSX.utils.json_to_sheet(horarios);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Horarios');
		XLSX.writeFile(wb, 'horarios.xlsx');
	};

	return (
		<div className="flex h-screen bg-gray-50">
			<Sidebar user={user} />
			<div className="flex-1 flex flex-col overflow-hidden">
				<Navbar user={user} setUser={setUser} />
				<main className="flex-1 overflow-y-auto p-6">
					<div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
						<h2 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Horarios</h2>
						<div className="flex items-center gap-3 mb-8">
							<input
								type="time"
								className="border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
								placeholder="Hora inicio"
								value={horaInicio}
								onChange={e => setHoraInicio(e.target.value)}
							/>
							<input
								type="time"
								className="border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
								placeholder="Hora fin"
								value={horaFin}
								onChange={e => setHoraFin(e.target.value)}
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
							{horarios.map(h => (
								<li key={h.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
									{editId === h.id ? (
										<div className="flex items-center gap-2 w-full">
											<input
												type="time"
												className="border border-purple-200 rounded-lg px-3 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
												value={editInicio}
												onChange={e => setEditInicio(e.target.value)}
											/>
											<input
												type="time"
												className="border border-purple-200 rounded-lg px-3 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
												value={editFin}
												onChange={e => setEditFin(e.target.value)}
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
											<span className="font-medium text-gray-900">{h.horaInicio} - {h.horaFin}</span>
											<div className="flex items-center gap-2">
												<button
													className="bg-purple-100 text-purple-600 px-2 py-1 rounded-lg hover:bg-purple-200"
													onClick={() => handleEdit(h.id, h.horaInicio, h.horaFin)}
												>
													<Edit className="w-4 h-4" />
												</button>
												<button
													className="bg-orange-100 text-orange-600 px-2 py-1 rounded-lg hover:bg-orange-200"
													onClick={() => handleDelete(h.id)}
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
								Reporte PDF de Horarios
							</button>
							<button
								className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
								onClick={handleReportExcel}
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
