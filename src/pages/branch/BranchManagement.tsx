import React, { useState } from 'react';
import { MapPin, Plus, Edit2, Trash2, Search } from 'lucide-react';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';

type Branch = {
    id: number;
    name: string;
    location: string;
    type: 'Headquarters' | 'Sub-Branch';
    status: 'Active' | 'Inactive';
};

const BranchManagement: React.FC = () => {
    const [branches, setBranches] = useState<Branch[]>([
        { id: 1, name: 'Main Branch', location: 'Chennai, TN', type: 'Headquarters', status: 'Active' },
        { id: 2, name: 'Madurai West', location: 'Madurai, TN', type: 'Sub-Branch', status: 'Active' },
        { id: 3, name: 'Coimbatore Central', location: 'Coimbatore, TN', type: 'Sub-Branch', status: 'Inactive' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentBranch, setCurrentBranch] = useState<Partial<Branch>>({});
    const [branchToDelete, setBranchToDelete] = useState<number | null>(null);

    const openAddModal = () => {
        setCurrentBranch({ type: 'Sub-Branch', status: 'Active' });
        setIsModalOpen(true);
    };

    const openEditModal = (branch: Branch) => {
        setCurrentBranch(branch);
        setIsModalOpen(true);
    };

    const openDeleteModal = (id: number) => {
        setBranchToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleSave = () => {
        if (!currentBranch.name || !currentBranch.location) return;

        if (currentBranch.id) {
            // Edit
            setBranches(branches.map(b => b.id === currentBranch.id ? { ...currentBranch } as Branch : b));
        } else {
            // Add
            const newBranch: Branch = {
                ...currentBranch as Branch,
                id: Date.now(),
            };
            setBranches([...branches, newBranch]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = () => {
        if (branchToDelete) {
            setBranches(branches.filter(b => b.id !== branchToDelete));
            setBranchToDelete(null);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Branch Management</h2>
                    <p className="text-sm text-slate-500">Manage your store branches and locations</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                    <Plus size={20} />
                    <span className="font-semibold">Add New Branch</span>
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search branches..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                </div>
                {/* Additional filters can go here */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {branches.map(branch => (
                    <div key={branch.id} className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-900 transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 dark:bg-indigo-900/10 rounded-bl-[100px] -mr-10 -mt-10 transition-transform group-hover:scale-110" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                                    <MapPin size={24} />
                                </div>
                                <div className="flex gap-1 bg-slate-50 dark:bg-slate-800 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openEditModal(branch)}
                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all"
                                        title="Edit Branch"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(branch.id)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all"
                                        title="Delete Branch"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">{branch.name}</h3>
                            <p className="text-slate-500 text-sm mb-4 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                {branch.location}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide ${branch.type === 'Headquarters'
                                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                    }`}>
                                    {branch.type}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full animate-pulse ${branch.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                    <span className={`text-sm font-medium ${branch.status === 'Active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                        {branch.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentBranch.id ? 'Edit Branch' : 'Add New Branch'}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Branch Name</label>
                        <input
                            type="text"
                            value={currentBranch.name || ''}
                            onChange={e => setCurrentBranch({ ...currentBranch, name: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="e.g. Madurai West"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
                        <input
                            type="text"
                            value={currentBranch.location || ''}
                            onChange={e => setCurrentBranch({ ...currentBranch, location: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="e.g. Madurai, TN"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                            <select
                                value={currentBranch.type || 'Sub-Branch'}
                                onChange={e => setCurrentBranch({ ...currentBranch, type: e.target.value as any })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                <option value="Sub-Branch">Sub-Branch</option>
                                <option value="Headquarters">Headquarters</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                            <select
                                value={currentBranch.status || 'Active'}
                                onChange={e => setCurrentBranch({ ...currentBranch, status: e.target.value as any })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
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
                            {currentBranch.id ? 'Save Changes' : 'Create Branch'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Branch"
                message="Are you sure you want to delete this branch? This action cannot be undone."
                type="danger"
            />
        </div>
    );
};

export default BranchManagement;
