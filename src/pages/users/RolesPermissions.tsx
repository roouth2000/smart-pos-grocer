import React, { useState } from 'react';
import { Shield, Plus, Edit2, Trash2, Users, Check } from 'lucide-react';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';

type Permission = {
    id: string;
    label: string;
};

type PermissionGroup = {
    category: string;
    permissions: Permission[];
};

type Role = {
    id: number;
    name: string;
    description: string;
    permissions: string[]; // List of permission IDs
    userCount: number;
};

const PERMISSION_MATRIX: PermissionGroup[] = [
    {
        category: 'Dashboard',
        permissions: [
            { id: 'dashboard.view', label: 'View Dashboard' },
            { id: 'dashboard.analytics', label: 'View Analytics' },
        ]
    },
    {
        category: 'Sales',
        permissions: [
            { id: 'sales.view', label: 'View Sales' },
            { id: 'sales.create', label: 'Create Order' },
            { id: 'sales.edit', label: 'Edit Order' },
            { id: 'sales.delete', label: 'Delete Order' },
        ]
    },
    {
        category: 'Purchase',
        permissions: [
            { id: 'purchase.view', label: 'View Purchase' },
            { id: 'purchase.create', label: 'Create PO' },
            { id: 'purchase.edit', label: 'Edit PO' },
            { id: 'purchase.approve', label: 'Approve PO' },
        ]
    },
    {
        category: 'Inventory',
        permissions: [
            { id: 'inventory.view', label: 'View Stock' },
            { id: 'inventory.adjust', label: 'Adjust Stock' },
            { id: 'products.manage', label: 'Manage Products' },
        ]
    },
    {
        category: 'Branch',
        permissions: [
            { id: 'branch.view', label: 'View Branches' },
            { id: 'branch.manage', label: 'Manage Branches' },
        ]
    },
    {
        category: 'Users & Roles',
        permissions: [
            { id: 'users.view', label: 'View Users' },
            { id: 'users.manage', label: 'Manage Users' },
            { id: 'roles.manage', label: 'Manage Roles' },
        ]
    },
];

const RolesPermissions: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([
        {
            id: 1,
            name: 'Super Admin',
            description: 'Full access to all system features',
            permissions: ['*'], // '*' implies all
            userCount: 2
        },
        {
            id: 2,
            name: 'Branch Manager',
            description: 'Manage branch operations, sales, and staff',
            permissions: ['dashboard.view', 'sales.view', 'sales.create', 'sales.edit', 'inventory.view', 'inventory.adjust', 'users.view'],
            userCount: 5
        },
        {
            id: 3,
            name: 'Sales Agent',
            description: 'Handle sales orders and basic customer interactions',
            permissions: ['dashboard.view', 'sales.create', 'sales.view'],
            userCount: 12
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentRole, setCurrentRole] = useState<Partial<Role>>({ permissions: [] });
    const [roleToDelete, setRoleToDelete] = useState<number | null>(null);

    // Helper to check if a permission is selected
    const isPermSelected = (permId: string) => {
        return currentRole.permissions?.includes(permId) || currentRole.permissions?.includes('*');
    };

    const togglePermission = (permId: string) => {
        const currentPerms = currentRole.permissions || [];
        if (currentPerms.includes(permId)) {
            setCurrentRole({ ...currentRole, permissions: currentPerms.filter(id => id !== permId) });
        } else {
            setCurrentRole({ ...currentRole, permissions: [...currentPerms, permId] });
        }
    };

    const handleSelectAll = () => {
        if (currentRole.permissions?.length === getAllPermissionIds().length) {
            setCurrentRole({ ...currentRole, permissions: [] });
        } else {
            setCurrentRole({ ...currentRole, permissions: getAllPermissionIds() });
        }
    };

    const getAllPermissionIds = () => {
        return PERMISSION_MATRIX.flatMap(g => g.permissions.map(p => p.id));
    };

    const openAddModal = () => {
        setCurrentRole({ name: '', description: '', permissions: [], userCount: 0 });
        setIsModalOpen(true);
    };

    const openEditModal = (role: Role) => {
        setCurrentRole({ ...role });
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!currentRole.name) return;

        if (currentRole.id) {
            setRoles(roles.map(r => r.id === currentRole.id ? { ...currentRole } as Role : r));
        } else {
            const newRole = {
                ...currentRole,
                id: Date.now(),
                userCount: 0 // New roles start with 0 users
            } as Role;
            setRoles([...roles, newRole]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = () => {
        if (roleToDelete) {
            setRoles(roles.filter(r => r.id !== roleToDelete));
            setRoleToDelete(null);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Roles & Permissions</h2>
                    <p className="text-sm text-slate-500">Manage access levels and control system security</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                    <Plus size={20} />
                    <span className="font-semibold">Create Role</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Roles List */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {roles.map(role => (
                        <div key={role.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEditModal(role)}
                                        className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setRoleToDelete(role.id);
                                            setIsDeleteModalOpen(true);
                                        }}
                                        className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{role.name}</h3>
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mt-1">
                                        <Users size={12} />
                                        <span>{role.userCount} Assigned Users</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 flex-1">
                                {role.description}
                            </p>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Access Level</div>
                                <div className="flex flex-wrap gap-2">
                                    {role.permissions.includes('*') ? (
                                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 rounded text-xs font-bold">
                                            Super Admin Access
                                        </span>
                                    ) : (
                                        <>
                                            {role.permissions.slice(0, 3).map(p => (
                                                <span key={p} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-xs">
                                                    {p.split('.')[0]}
                                                </span>
                                            ))}
                                            {role.permissions.length > 3 && (
                                                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded text-xs">
                                                    +{role.permissions.length - 3} more
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentRole.id ? 'Edit Role' : 'Create New Role'}
                maxWidth="2xl"
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role Name</label>
                            <input
                                type="text"
                                value={currentRole.name}
                                onChange={e => setCurrentRole({ ...currentRole, name: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="e.g. Finance Manager"
                            />
                        </div>
                        <div className="col-span-2 md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                            <input
                                type="text"
                                value={currentRole.description}
                                onChange={e => setCurrentRole({ ...currentRole, description: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="Describe the role's responsibilities..."
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Permissions</label>
                            <button
                                onClick={handleSelectAll}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                            >
                                Select/Deselect All
                            </button>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto pr-2 space-y-6">
                            {PERMISSION_MATRIX.map(group => (
                                <div key={group.category}>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 border-b border-slate-100 dark:border-slate-800 pb-1">
                                        {group.category}
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {group.permissions.map(perm => (
                                            <label
                                                key={perm.id}
                                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${isPermSelected(perm.id)
                                                        ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800'
                                                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-transparent bg-slate-50 dark:bg-slate-800/50'
                                                    }`}
                                            >
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isPermSelected(perm.id)
                                                        ? 'bg-indigo-600 border-indigo-600 text-white'
                                                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                                                    }`}>
                                                    {isPermSelected(perm.id) && <Check size={12} strokeWidth={3} />}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={isPermSelected(perm.id)}
                                                    onChange={() => togglePermission(perm.id)}
                                                />
                                                <span className={`text-sm ${isPermSelected(perm.id) ? 'font-medium text-indigo-900 dark:text-indigo-100' : 'text-slate-600 dark:text-slate-400'}`}>
                                                    {perm.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                        >
                            {currentRole.id ? 'Save Changes' : 'Create Role'}
                        </button>
                    </div>
                </div>
            </Modal>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Role"
                message="Are you sure you want to delete this role? Users assigned to this role may lose access to certain features."
                type="danger"
            />
        </div>
    );
};

export default RolesPermissions;
