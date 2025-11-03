import { useEffect, useState } from 'react';
import { Sidebar } from '../components/sidebar';
import { Navbar } from '../components/navbar';
import { getDocentes } from '../api/axios';
import { User, Mail, Calendar, Eye } from 'lucide-react';

export const Docente = ({ user, setUser }) => {
	const [docentes, setDocentes] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		fetchDocentes();
	}, []);

	const fetchDocentes = async () => {
		setLoading(true);
		setError('');
		try {
			const res = await getDocentes();
			setDocentes(Array.isArray(res.data) ? res.data : res.data.data || []);
		} catch (e) {
			setError('No se pudo cargar la lista de docentes', e);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex h-screen bg-gray-50">
			<Sidebar user={user} />
			<div className="flex-1 flex flex-col overflow-hidden">
				<Navbar user={user} setUser={setUser} />
				<main className="flex-1 overflow-y-auto p-6">
					<div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
						<h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
							<User className="w-7 h-7 text-blue-600" /> Gestión de Docentes
						</h2>
						{loading && <div className="mb-4 text-blue-600">Cargando...</div>}
						{error && <div className="mb-4 text-red-600">{error}</div>}
						<div className="overflow-x-auto">
							<table className="min-w-full bg-white rounded-xl border border-gray-200">
								<thead className="bg-blue-50">
									<tr>
										<th className="px-4 py-3 text-left">Nombre</th>
										<th className="px-4 py-3 text-left">Apellido</th>
										<th className="px-4 py-3 text-left">Registro</th>
										<th className="px-4 py-3 text-left">Correo</th>
										<th className="px-4 py-3 text-left">Fecha Nacimiento</th>
										<th className="px-4 py-3 text-left">Género</th>
										<th className="px-4 py-3 text-left">Estado Civil</th>
									</tr>
								</thead>
								<tbody>
									{docentes.length === 0 ? (
										<tr>
											<td colSpan={7} className="text-center py-8 text-gray-500">No hay docentes registrados.</td>
										</tr>
									) : (
										docentes.map((d) => (
											<tr key={d.ID} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
												<td className="px-4 py-3">{d.Nombre}</td>
												<td className="px-4 py-3">{d.Apellido}</td>
												<td className="px-4 py-3">{d.Registro}</td>
												<td className="px-4 py-3">{d.Correo}</td>
												<td className="px-4 py-3">{d.Fecha_Nacimiento}</td>
												<td className="px-4 py-3">{d.Genero}</td>
												<td className="px-4 py-3">{d.Estado === true ? 'Casado' : d.Estado === false ? 'Soltero' : ''}</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};
