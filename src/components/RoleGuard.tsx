import { JSX } from 'solid-js';
import { isAdmin } from './userStore';

interface RoleGuardProps {
	children: JSX.Element;
	adminOnly?: boolean;
}

const RoleGuard = (props: RoleGuardProps) => {
	if (props.adminOnly && !isAdmin()) {
		return (
			<div class="min-h-screen flex flex-col items-center justify-center bg-gray-50">
				<div class="bg-white p-8 rounded-lg shadow text-center">
					<h2 class="text-2xl font-bold text-red-600 mb-4">Akses Ditolak</h2>
					<p class="text-gray-700 mb-4">Halaman ini hanya dapat diakses oleh admin.</p>
					<a href="/Beranda" class="text-blue-600 hover:underline">Kembali ke Beranda</a>
				</div>
			</div>
		);
	}
	return props.children;
};

export default RoleGuard;
