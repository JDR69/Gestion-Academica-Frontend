import { useState } from 'react';
import { useEffect } from 'react';
import { getAulas, createAula, updateAula, deleteAula } from '../api/axios';
import { Sidebar } from '../components/sidebar';
import { Navbar } from '../components/navbar';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// El backend espera Nro_Facultad y Nro_Aula

export const Aula = ({ user, setUser }) => {
	const [aulas, setAulas] = useState([]);
	const [nroFacultad, setNroFacultad] = useState('236');
	const [nroAula, setNroAula] = useState('');
	const [editId, setEditId] = useState(null);
	const [editFacultad, setEditFacultad] = useState('236');
	const [editAula, setEditAula] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	// Obtener aulas
	const fetchAulas = async () => {
		setLoading(true);
		setError('');
		try {
			const { data } = await getAulas();
			const raw = Array.isArray(data) ? data : data.data || [];
			const list = raw.map((a) => ({
				id: a.ID ?? a.id,
				nroFacultad: a.Nro_Facultad ?? a.nroFacultad,
				nroAula: a.Nro_Aula ?? a.nroAula,
			}));
			setAulas(list);
		} catch (e) {
			console.error(e);
			setError('No se pudo cargar la lista de aulas');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAulas();
	}, []);

	// Crear aula
	const handleAdd = async () => {
		if (nroAula.trim()) {
			setLoading(true);
			setError('');
			try {
				const aulaData = {
					Nro_Facultad: parseInt(nroFacultad, 10),
					Nro_Aula: parseInt(nroAula, 10),
				};
				await createAula(aulaData);
				await fetchAulas();
				setNroFacultad('236');
				setNroAula('');
			} catch (e) {
				console.error(e);
				setError('No se pudo crear el aula');
			} finally {
				setLoading(false);
			}
		}
	};

	// Eliminar aula
	const handleDelete = async (id) => {
		setLoading(true);
		setError('');
		try {
			await deleteAula(id);
			await fetchAulas();
		} catch (e) {
			console.error(e);
			setError('No se pudo eliminar el aula');
		} finally {
			setLoading(false);
		}
	};

	// Iniciar edición
	const handleEdit = (id, facultad, aula) => {
		setEditId(id);
		setEditFacultad(facultad);
		setEditAula(aula);
	};

	// Guardar edición
	const handleUpdate = async () => {
		setLoading(true);
		setError('');
		try {
			const aulaData = {
				Nro_Facultad: parseInt(editFacultad, 10),
				Nro_Aula: parseInt(editAula, 10),
			};
			await updateAula(editId, aulaData);
			await fetchAulas();
			setEditId(null);
			setEditFacultad('236');
			setEditAula('');
		} catch (e) {
			console.error(e);
			setError('No se pudo actualizar el aula');
		} finally {
			setLoading(false);
		}
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

						{/* Loading y error */}
						{loading && (
							<div className="mb-4 text-blue-600 font-medium flex items-center gap-2">
								<svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
								Cargando...
							</div>
						)}
						{error && (
							<div className="mb-4 text-red-600 font-medium flex items-center gap-2">
								<svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
								{error}
								<button className="ml-2 underline text-sm" onClick={fetchAulas}>Reintentar</button>
							</div>
						)}

						<div className="flex items-center gap-3 mb-8">
							<input
								type="number"
								className="border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 w-32"
								placeholder="Nro Facultad"
								value={nroFacultad}
								onChange={e => setNroFacultad(e.target.value)}
								disabled={loading}
							/>
							<input
								type="number"
								className="border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 w-32"
								placeholder="Nro Aula"
								value={nroAula}
								onChange={e => setNroAula(e.target.value)}
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
							{aulas.map(a => (
								<li key={a.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
									{editId === a.id ? (
										<div className="flex items-center gap-2 w-full">
											<input
												type="number"
												className="border border-purple-200 rounded-lg px-3 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 w-32"
												value={editFacultad}
												onChange={e => setEditFacultad(e.target.value)}
												disabled={loading}
											/>
											<input
												type="number"
												className="border border-purple-200 rounded-lg px-3 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 w-32"
												value={editAula}
												onChange={e => setEditAula(e.target.value)}
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
											<span className="font-medium text-gray-900">{a.nroFacultad} - {a.nroAula}</span>
											<div className="flex items-center gap-2">
												<button
													className="bg-purple-100 text-purple-600 px-2 py-1 rounded-lg hover:bg-purple-200 disabled:opacity-60"
													onClick={() => handleEdit(a.id, a.nroFacultad, a.nroAula)}
													disabled={loading}
												>
													<Edit className="w-4 h-4" />
												</button>
												<button
													className="bg-orange-100 text-orange-600 px-2 py-1 rounded-lg hover:bg-orange-200 disabled:opacity-60"
													onClick={() => handleDelete(a.id)}
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
								Reporte PDF de Aulas
							</button>
							<button
								className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
								onClick={handleReportExcel}
								disabled={loading}
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
